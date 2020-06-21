import React, {useEffect, useState, useContext } from "react";
import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../components/CustomButtons/Button";
import TextField from '@material-ui/core/TextField';
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import StoreContext from "stores/RootStore";
import FeedBox from "components/Feeds/FeedBox";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Add from "@material-ui/icons/Add";
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Collapse from '@material-ui/core/Collapse';
const useFormStyles = makeStyles(styles);


function Feeds() {
  const [adding, setAdding] = useState(false)
  const {consultationStore} = useContext(StoreContext)
  const classesForm = useFormStyles();


  useEffect(() => {
    consultationStore.getFeeds();
  }, [consultationStore])

  return  (
    <div>
      <div style={{width: "100%", height: "70px"}}>
        <div style={{float:"right"}}>
          {
            adding
            ? <Button
                onClick={() => setAdding(false)}
                // color="primary"
                className={classesForm.marginRight}
              >
                <Close
                  className={classesForm.icons}
                  style={{ marginTop: "-2px", marginRight: "2px" }}
                />
                Cancelar
              </Button>
            : <Button
                onClick={() => setAdding(true)}
                color="primary"
                className={classesForm.marginRight}
              >
                <Add
                  className={classesForm.icons}
                  style={{ marginTop: "-2px", marginRight: "2px" }}
                />
                Nuevo Comunicado
              </Button>
          }
        </div>
      </div>
      <Collapse in={adding}>
          <Card>
            <CardHeader color="info" icon
              action={
                <IconButton aria-label="close">
                  <Close />
                </IconButton>
              }
            >
              <CardIcon color="warning">
                <RecordVoiceOverIcon />
              </CardIcon>
              <h4 className={classesForm.cardIconTitle}>Enviar Comunicado</h4>
            </CardHeader>
            <CardBody>
              <form>
                <TextField
                  style={{marginTop:"16px"}}
                  label="Titulo"
                  autoFocus={true}
                  required
                  fullWidth={true}
                  value={consultationStore.newFeed.title}
                  onChange={ e => consultationStore.newFeed.title = e.target.value}
                />

                <TextField
                    style={{marginTop:"10px"}}
                      required
                      label="Detalles"
                      fullWidth={true}
                      multiline={true}
                      rows={7}
                      value={consultationStore.newFeed.summary}
                      onChange= {e => consultationStore.newFeed.summary = e.target.value}
                    />
                <Button
                  style={{marginTop: "15px"}}
                  color="success"
                  onClick={() => {
                    setAdding(false);
                    consultationStore.sendFeed();
                  }}
                >
                  Guardar
                </Button>
              </form>
            </CardBody>
          </Card>
        </Collapse>
        {consultationStore.feeds.sort((f1,f2) => f2.createdAt - f1.createdAt).map(feed =>
          <FeedBox feed={feed} />
        )}
    </div>
  );
}

export default observer(Feeds);
