import React, { useEffect, useContext } from "react";
import StoreContext from "stores/RootStore";
import { observer } from "mobx-react";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Info from "@material-ui/icons/Info";
import Assignment from "@material-ui/icons/Assignment";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardFooter from "components/Card/CardFooter";
import GanttChart from "../../components/Charts/Gantt";

import {sameDay} from "helpers/utils";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function Dashboard() {
  const {consultationStore, authStore} = useContext(StoreContext);

  useEffect(() => {
    consultationStore.getAllConsultations();
  }, [])

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <RecordVoiceOverIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Últimos Comunicados</p>
              <h3 className={classes.cardTitle}>{consultationStore.feeds.filter(f => sameDay(f.createdAt, new Date(Date.now()))).length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Info />
                Lo que ha pasado hoy
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Assignment />
              </CardIcon>
              <p className={classes.cardCategory}>Consultas Activas</p>
              <h3 className={classes.cardTitle}>{consultationStore.activeConsultations.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Info />
                Consultas en proceso
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <AssignmentTurnedInIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Consultas Terminadas</p>
              <h3 className={classes.cardTitle}>{consultationStore.consultations.filter(c => c.finished).length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Info />
                Tus logros hasta el momento
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GanttChart
            elements={consultationStore.activeConsultations}
            getElementTitle={ c => c.title}
            getStartDate={ c => c.issuedOn}
            getEndDate={ c => c.expiresOn}
            getManuallyFinishedDate={c => c.finished ? c.finishedOn : undefined}
            currentUser={authStore.signedUser}
            getAuthorUser={c => c.author.userName}
           />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default observer(Dashboard);
