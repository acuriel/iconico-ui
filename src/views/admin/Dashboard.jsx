import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {apiService, authService} from "../../services";
import { addDays } from "../../helpers/utils";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Info from "@material-ui/icons/Info";
import Assignment from "@material-ui/icons/Assignment";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Table from "components/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import GanttChart from "../../components/Charts/Gantt";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [allConsultations, setAllConsultations] = useState([]);
  const [activeCons, setActiveCons] = useState(0);
  useEffect(() => {
    apiService
      .getAllConsultations()
      .then(res => {
        setAllConsultations(res.data);
        setActiveCons(res.data.length);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <NotificationImportant />
              </CardIcon>
              <p className={classes.cardCategory}>Últimos Comunicados</p>
              <h3 className={classes.cardTitle}> 6 </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Info />
                Lo que te has perdido
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
              <h3 className={classes.cardTitle}>{activeCons}</h3>
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
                <LibraryBooks />
              </CardIcon>
              <p className={classes.cardCategory}>Proyectos Activos</p>
              <h3 className={classes.cardTitle}>{activeCons}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Info />
                Proyectos pendientes
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GanttChart
            elements={allConsultations}
            getElementTitle={ c => c.Tittle}
            getStartDate={ c => new Date(c.IssuedOn)}
            getEndDate={ c => new Date(c.ExpiresOn)}
            getManuallyFinishedDate={c => c.IsManuallyFinished ? new Date(c.ManuallyFinishedOn) : undefined}
            currentUser={authService.currentUserValue}
            getAuthorUser={c => c.Author.UserName}
           />
        </GridItem>
      </GridContainer>
      {/* <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Consultas Activas</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="info"
                tableHead={["Titulo", "Detalles"]}
                tableData={lastConsultations.map(c => [
                  c.Tittle.slice(0, 25) + "...",
                  c.Description.slice(0, 35) + "...",
                  <Link to={"/admin/consulta/" + c.id} key={c.id}>
                    Ver mas
                  </Link>
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Proyectos Activos</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="info"
                tableHead={["ID", "Titulo", "Detalles"]}
                tableData={[].map(c => [
                  c.id,
                  c.title.slice(0, 25) + "...",
                  c.details.slice(0, 35) + "...",
                  <Link to={"/admin/consulta/" + c.id} key={c.id}>
                    Ver mas
                  </Link>
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}
    </div>
  );
}
