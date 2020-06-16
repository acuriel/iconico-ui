import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react";
import StoreContext from "stores/RootStore";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Add from "@material-ui/icons/Add";

// core components
import Accordion from "../../components/Accordion/Accordion.js";
import FolderSection from "../../components/Folders/FolderSection";
import ConsultationDragableItem from "../../components/ConsultationInfo/ConsultationDragableItem";


import styles from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";
import ConsultationInfo from "components/ConsultationInfo/ConsultationInfo";

const useStyles = makeStyles(styles);

function CounsultationListAccordion({consultations, ...props}) {
  return consultations.length === 0
    ? <p>No existen consultas</p>
    :(
      <Accordion
        style={{backgroundColor:"transparent !important"}}
        active={0}
        collapses={consultations.map(c => {
          return {
            title: (
              <div>
                <ConsultationDragableItem consultation={c}/>
              </div>
            ),
            content: <ConsultationInfo currentConsultation={c}/>
          };
        })}
      />
    );
}

function ConsultationList() {
  const classes = useStyles();
  const {consultationStore, uiStore} = useContext(StoreContext)

  useEffect(() => {
    consultationStore.getAllConsultations();
  }, [])

  return (
    <div>
      {uiStore.signedUser.isInternal
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
      <FolderSection/>
      <div>
        <CounsultationListAccordion consultations={consultationStore.activeConsultations}/>
      </div>
    </div>
  );
}

export default observer(ConsultationList);
