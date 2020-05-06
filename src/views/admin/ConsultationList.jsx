import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {apiService, authService} from "../../services";
import { addDays, dateToString, getNameInitials, BGS } from "../../helpers/utils";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Add from "@material-ui/icons/Add";
import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";

// core components
import Avatar from '@material-ui/core/Avatar';
import Accordion from "../../components/Accordion/Accordion.js";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Loading from "../../components/Loading/Loading";
import FolderSection from "../../components/Folders/FolderSection";
import ConsultationDragableItem from "../../components/ConsultationInfo/ConsultationDragableItem";


// import { consultations } from "variables/general.js";

import styles from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";
import ConsultationInfo from "components/ConsultationInfo/ConsultationInfo";

const useStyles = makeStyles(styles);

const avatarStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function CounsultationListAccordion({consultations, ...props}) {
  const avatarClasses = avatarStyles();

  return (
    <Accordion
      style={{backgroundColor:"transparent !important"}}
      active={0}
      collapses={consultations.map(c => {
        let date = new Date(c.IssuedOn);
        return {
          title: (
            <div>
              <ConsultationDragableItem consultation={c}/>
              {/* {getInfoBadges()} */}
            </div>
          ),
          content: <ConsultationInfo currentConsultation={c}/>
        };
      })}
    />
  );
}

export default function ConsultationList() {
  const classes = useStyles();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(undefined);
  const [updated, setUpdated] = useState(false);


  useEffect(() => {
    console.log("Updated");
    (currentFolder 
      ? apiService.getConsultationsInFolder(currentFolder._id) 
      : apiService.getAllConsultations())
    .then(res => {
      const data = res.data;
      setConsultations(data);
      setLoading(false);
      setUpdated(false);
    })
    .catch(err => console.log(err));

  }, [currentFolder, updated]);

  const printConsultations = elems => {
    return elems.length === 0 ? (
      <p>No existen consultas</p>
    ) : (
      <CounsultationListAccordion consultations={elems} />
    );
  };


  return loading ? (
    <Loading />
  ) : (
    <div>
      {authService.isInternal() 
        ? (<Button
          href={"/admin/consultas/nueva"}
          color="primary"
          className={classes.marginRight}
        >
          <Add
            className={classes.icons}
            style={{ marginTop: "-2px", marginRight: "2px" }}
          />
          Nueva Consulta
        </Button>) : ""
      }
      <FolderSection folderSelectedHandler={(f) => setCurrentFolder(f)}  updateEvent={setUpdated}/>
      {
        authService.isInternal() ?(
          <div>
            <h4 style={{ marginTop: "20px" }}>Mis Consultas</h4>
            {printConsultations(
              consultations.filter(
                c => c.Author.UserName === authService.currentUserValue.userName
              )
            )}
          </div>
        ):""
      }
      <h4 style={{ marginTop: "50px" }}>Consultas Asociadas</h4>
      {printConsultations(
        consultations.filter(
          c => c.Author.UserName !== authService.currentUserValue.userName
        )
      )}
    </div>
  );
}
