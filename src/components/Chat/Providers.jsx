import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import StoreContext from "stores/RootStore";

import "react-chat-elements/dist/main.css";

import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Accordion from "components/Accordion/Accordion";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import Button from "components/CustomButtons/Button";

import Done from "@material-ui/icons/Done";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import Warning from "@material-ui/icons/Warning";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import CardBody from "components/Card/CardBody";
import Chat from "./Chat";
import CustomizedMenus from "components/CustomButtons/CustomizedMenus";
import Consultation from "stores/Consultation";

const useStyles = makeStyles(styles);


const statusToColor = { 0: "danger", 1: "warning", 2: "success" };
const statusToIcon = { 0: <Warning/>, 1: <QueryBuilder/>, 2: <Done/> };

function Providers({ currentConsultation }) {
  const classes = useStyles();

  const {consultationStore, authStore} = useContext(StoreContext);

  const [conversation, setConversation] = useState(undefined);

  useEffect(() => {
    currentConsultation._loadExternalMembers();

  }, [])

  const renderProvidersChats = (internalMember) => {
    return (
      <GridContainer>
        {currentConsultation.externalConnections
          .filter(cnx => cnx.internalUser.userName === internalMember.userName)
          .map((ext, key) => (
          <GridItem sm={6} xs={12} key={key}>
            <Card>
              <CardHeader color={statusToColor[ext.status]} icon>
                {ext.internalUser.userName === authStore.signedUser.userName && <CustomizedMenus options={[
                  {icon:Done, text:"Resuelto", handler: () => ext.updateStatus(2)},
                  {icon:QueryBuilder, text:"En Proceso", handler: () => ext.updateStatus(1)},
                  {icon:Warning, text:"Sin solucion", handler: () => ext.updateStatus(0)}
                ]}/>}
                <CardIcon color={statusToColor[ext.status]}>
                  {statusToIcon[ext.status]}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  {" "}
                  <b>{ext.externalUser.userName}</b>
                </h4>

              </CardHeader>
              <CardBody style={{ textAlign: "right" }}>
                {ext.internalUser.userName === authStore.signedUser.userName && (
                  <Button
                    simple
                    color="info"
                    onClick={() => setConversation(ext.conversation)}
                  >
                  Discusion
                </Button>
                )}
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    );
  };


  const renderInternalProvidersSection = () =>{
    return (
      <div>
        <Autocomplete
          disabled={currentConsultation.finished}
          multiple
          options={consultationStore.allExternalMembers.filter(
            v => !currentConsultation.externalMembers.some(
              m => m.userName === v.userName
          ))}
          getOptionLabel={(option) => option.userName}
          defaultValue={currentConsultation.externalMembers}
          filterSelectedOptions
          disableClearable
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                key={index}
                label={option.userName}
                style={{margin:"5px 3px"}}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Proveedores"
              placeholder="Usuario"
            />
          )}
          onChange={(event, newValue, reason) => {
            if(reason === "select-option"){
              const temp = newValue.filter(
                v => !currentConsultation.externalMembers.some(
                  m => m.userName === v.userName
              ));
              if(temp.length > 0){
                currentConsultation.connectWithProvider(temp[0].id);
              }
            }
          }}
        />
        <Accordion
          active={0}
          collapses={currentConsultation.internalMembers
            .map(internalMember => {
              return {
                title: "Atendidos por " + internalMember.userName,
                content: renderProvidersChats(internalMember)
              };
            })
            .sort((a, _) =>
              a.user === authStore.signedUser.userName ? 1 : -1
            )}
        />
      </div>
    )
  }

  const renderExternalChats = () => {
    console.log(currentConsultation.externalConnections);
    return (
      <GridContainer>
        {currentConsultation.externalConnections
          .filter(cnx => {
            console.log(cnx)
            return cnx.externalUser.userName === authStore.signedUser.userName})
          .map((ext, key) => (
          <GridItem xs={4} key={key}>
            <Card>
              <CardHeader color={statusToColor[ext.status]} icon>
                <CardIcon color={statusToColor[ext.status]}>
                  {statusToIcon[ext.status]}
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  {" "}
                  <b>{ext.internalUser.userName}</b>
                </h4>

              </CardHeader>
              <CardBody style={{ textAlign: "right" }}>
                <Button
                  simple
                  color="info"
                  onClick={() => setConversation(ext.conversation)}
                >
                  Discusion
                </Button>

              </CardBody>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    );
  };

  return conversation ? (
    <div>
      <Button simple color="info" onClick={() => setConversation(undefined)}>
        Volver
      </Button>
      <Chat conversation={conversation}/>
    </div>
  ) : (authStore.signedUser.isInternal ? renderInternalProvidersSection() : renderExternalChats())
}

export default observer(Providers);
