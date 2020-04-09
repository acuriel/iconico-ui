import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {apiService, authService} from "../../services";
import { addDays, dateToString, getNameInitials, getRandomBackground, BGS } from "../../helpers/utils";
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Add from "@material-ui/icons/Add";
import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";

// core components
import Accordion from "../../components/Accordion/Accordion.js";
import Loading from "../../components/Loading/Loading";

// import { consultations } from "variables/general.js";

import styles from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";

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
              <Link to={"/admin/consulta/" + c._id}>{c.Tittle}</Link>
              {/* {getInfoBadges()} */}
            </div>
          ),
          content: (
            <div>
              <div>
                <Person
                  style={{
                    fontSize: "1.5em",
                    marginBottom: "-4px",
                    marginRight: "5px"
                  }}
                />
                {c.Author.UserName}
                <CalendarToday
                  style={{
                    fontSize: "1.5em",
                    marginBottom: "-4px",
                    marginRight: "5px",
                    marginLeft: "20px"
                  }}
                />{" "}
                {dateToString(date)} -{" "}
                {dateToString(addDays(date, c.ExpiresIn))}
              </div>
              <div>
                Miembros Internos
                <AvatarGroup max={3}>
                  {c.InternalMembers.map((m, k) => 
                  <Avatar 
                    key={k}
                    title={m.UserName} 
                    alt={m.UserName}
                    className={BGS[k % BGS.length]}
                  >{getNameInitials(m.UserName)}</Avatar>)}
                </AvatarGroup>
              </div>
              {/* <div>
                Miembros Externos
                <AvatarGroup max={3}>
                  {c.ExternalMembers.map((m, k) => 
                  <Avatar 
                    key={k}
                    title={m.Receiver.UserName} 
                    alt={m.Receiver.UserName}
                    className={BGS[k % BGS.length]}
                  >{getNameInitials(m.Receiver.UserName)}</Avatar>)}
                </AvatarGroup>
              </div> */}
              <p style={{ marginTop: "15px" }}>{c.Description}</p>
            </div>
          )
        };
      })}
    />
  );
}

export default function ConsultationList() {
  const classes = useStyles();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiService
      .getAllConsultations()
      .then(res => {
        const data = res.data;
        console.log(data);
        setConsultations(data);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

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
      <Button
        href={"/admin/consultas/nueva"}
        color="primary"
        className={classes.marginRight}
      >
        <Add
          className={classes.icons}
          style={{ marginTop: "-2px", marginRight: "2px" }}
        />
        Nueva Consulta
      </Button>
      <h4 style={{ marginTop: "20px" }}>Mis Consultas</h4>
      {printConsultations(
        consultations.filter(
          c => c.Author.UserName === authService.currentUserValue.userName
        )
      )}
      <h4 style={{ marginTop: "20px" }}>Consultas Asociadas</h4>
      {printConsultations(
        consultations.filter(
          c => c.Author.UserName !== authService.currentUserValue.userName
        )
      )}
    </div>
  );
}
