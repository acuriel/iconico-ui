import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {apiService} from "../../services";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Info from "@material-ui/icons/Info";
import Assignment from "@material-ui/icons/Assignment";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [lastConsultations, setLastConsultations] = useState([]);
  const [activeCons, setActiveCons] = useState(0);
  useEffect(() => {
    apiService
      .getAllConsultations()
      .then(res => {
        setLastConsultations(res.data.slice(0, 5));
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
      </GridContainer>
    </div>
  );
}
