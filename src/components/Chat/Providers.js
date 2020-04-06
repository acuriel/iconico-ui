import React, { useState, useEffect } from "react";

import {apiService} from "services";
import ProviderChat from "./ProviderChat.js";

import "react-chat-elements/dist/main.css";

import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "components/Badge/Badge.js";
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon";
import Button from "components/CustomButtons/Button.js";

import Done from "@material-ui/icons/Done";
import Add from "@material-ui/icons/Add";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import Warning from "@material-ui/icons/Warning";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import efstyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

import CardBody from "components/Card/CardBody";
import { Link } from "react-router-dom";

const useStyles = makeStyles(styles);
const useefStyles = makeStyles(efstyles);


const getUserList = elems => {
  let temp = [];
  elems.forEach(e => {
    if (temp.indexOf(e.Author.UserName) === -1) {
      temp.push(e.Author.UserName);
    }
  });
  return temp;
};
const groupByUser = elems =>
  getUserList(elems).map(u => {
    return { user: u, externals: elems.filter(e => u === e.Author.UserName) };
  });

const statusToColor = { 0: "danger", 1: "warning", 2: "success" };

export default function Providers({ currentElement, ...props }) {
  const classes = useStyles();
  const efClasses = useefStyles();
  const [currentConsultation, setcurrentConsultation] = useState(
    currentElement
  );
  const [currentConsExternals, setCurrentConsExternals] = useState([]);
  const [allExtMembers, setAllExtMembers] = useState([]);
  const [groupedExternal, setGroupedExternal] = useState([]);
  const [selectedExternal, setSelectedExternal] = useState(null);
  const [addingExternal, setAddingExternal] = useState(null);
  const [addingFlag, setAddingFlag] = useState(false);

  const loadMyExternals = () => {
    apiService.getExternalMembers(currentConsultation._id).then(res => {
      setCurrentConsExternals(res.data);
      setGroupedExternal(groupByUser(res.data));
    });
    apiService.getAllExternalMembers().then(res => setAllExtMembers(res.data));
  };
  const myExternals = () =>
    currentConsExternals.filter(
      ext => ext.Author.UserName === apiService.currentUser().userName
    );

  const addExternal = () => {
    apiService
      .addExternalToConsultation({
        _idConsulta: currentElement._id,
        Receiver: addingExternal
      })
      .then(() => {
        setAddingFlag(false);
        loadMyExternals();
      });
  };

  const renderMembers = () => {
    return (
      <div className="external-members-list">
        {myExternals().map((ext, i) => (
          <Badge color={statusToColor[ext.Status]} key={i}>
            {ext.Receiver.UserName}
          </Badge>
        ))}
        <div className="add-external">
          {!addingFlag ? (
            <Button simple color="info" onClick={() => setAddingFlag(true)}>
              Agregar
            </Button>
          ) : (
            <div>
              <FormControl
                style={{ width: "150px" }}
                className={efClasses.selectFormControl}
              >
                <Select
                  value={addingExternal ?? ""}
                  onChange={e => setAddingExternal(e.target.value)}
                  MenuProps={{ className: efClasses.selectMenu }}
                  classes={{ select: efClasses.select }}
                  inputProps={{
                    name: "select-external",
                    id: "select-external"
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: efClasses.selectMenuItem,
                      selected: efClasses.selectMenuItemSelected
                    }}
                  >
                    Seleccione un Miembro Externo
                  </MenuItem>
                  {allExtMembers
                    .filter(
                      ext =>
                        myExternals().filter(
                          myext => myext.Receiver._id === ext._id
                        ).length === 0
                    )
                    .map(m => (
                      <MenuItem
                        key={m._id}
                        value={m}
                        classes={{
                          root: efClasses.selectMenuItem,
                          selected: efClasses.selectMenuItemSelected
                        }}
                      >
                        {m.UserName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                simple
                color="info"
                onClick={() => {
                  addExternal();
                }}
              >
                Confirmar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderProvidersChats = (externals, readable = false) => {
    return (
      <GridContainer>
        {externals.map(ext => (
          <GridItem xs={4} key={ext.id}>
            <Card>
              <CardHeader color={statusToColor[ext.Status]} icon>
                <CardIcon color={statusToColor[ext.Status]}>
                  <Warning />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  {" "}
                  <b>{ext.Receiver.UserName}</b>
                </h4>
              </CardHeader>
              <CardBody style={{ textAlign: "right" }}>
                {readable ? (
                  <Button
                    simple
                    color="info"
                    onClick={() => setSelectedExternal(ext)}
                  >
                    Ver mas
                  </Button>
                ) : (
                  "Sin acceso"
                )}
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    );
  };

  // const showMeFirst = (a,b) => {
  //   if(a.user === apiService.currentUser().userName)
  //   return 1
  // }

  useEffect(() => {
    loadMyExternals();
  }, []);

  return selectedExternal ? (
    <div>
      <Button simple color="info" onClick={() => setSelectedExternal(null)}>
        Volver
      </Button>
      <ProviderChat
        currentElement={currentConsultation}
        currentExternal={selectedExternal}
      />
    </div>
  ) : (
    <div>
      {renderMembers()}
      <Accordion
        active={0}
        collapses={groupedExternal
          .map(group => {
            return {
              title: "Atendidos por " + group.user,
              content: renderProvidersChats(
                group.externals,
                group.user === apiService.currentUser().userName
              )
            };
          })
          .sort((a, b) =>
            a.user === apiService.currentUser().userName ? 1 : -1
          )}
      />
    </div>
  );
}
