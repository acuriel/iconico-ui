import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react";
import StoreContext from "stores/RootStore";

import SweetAlert from "react-bootstrap-sweetalert";

import {apiService, authService} from "../../services";
import {addDays} from "../../helpers/utils";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
// @material-ui/core components
import Assignment from "@material-ui/icons/Assignment";

// core components
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import saStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import efstyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";


const useStyles = makeStyles(styles);
const useSWStyles = makeStyles(saStyles);
const useefStyles = makeStyles(efstyles);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ConsultationCreate(props) {
  const {consultationStore, uiStore} = useContext(StoreContext);

  const classes = useStyles();
  const saClases = useSWStyles();
  const [alert, setAlert] = React.useState(null);
  const [newConsultation, setConsultation] = React.useState({
    Tittle: "",
    Description: "",
    ExpiresOn: addDays(Date.now(), 10),
    InternalMembers: [],
    ExternalMembers: []
  });
  const [allIntMembers, setAllIntMembers] = useState([]);
  const [titleInputState, setTitleInputState] = useState("");
  const [detailsInputState, setDetailsInputState] = useState("");

  useEffect(() => {
    apiService.getAllInternalMembers().then(res => setAllIntMembers(res.data.filter(m => m.UserName !== authService.currentUserValue.userName)));
  }, []);
  const validateField = (valid, setStateFunc) => {
    if (valid) setStateFunc("success");
    else setStateFunc("error");
  };

  const verifyLength = (value, length = 1) => value.length >= length;

  const hideAlert = () => {
    setAlert(null);
  };
  const getAlert = () => {
    var result = "";
    if(uiStore.sweetAlertState === "success"){
      result = (
        <SweetAlert
          success
          style={{ display: "block" }}
          title="Consulta creada!"
          onConfirm={() => props.history.push("/admin/consultas")}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={saClases.button + " " + saClases.success} >
            Ha gregado una nueva consulta
        </SweetAlert>)
    }
    else if(uiStore.sweetAlertState === "error"){
      result = (
        <SweetAlert
          success
          style={{ display: "block" }}
          title="Consulta creada!"
          onConfirm={() => {
            uiStore.sweetAlertState = null;
            props.history.push("/admin/consultas")}
          }
          onCancel={() => hideAlert()}
          confirmBtnCssClass={saClases.button + " " + saClases.success}
        >
          Ha gregado una nueva consulta
        </SweetAlert>
      )
    }
    return result;
  };

  return (
    <div>
      {getAlert()}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardHeader color="info" icon>
          <CardIcon color="info">
            <Assignment />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>
            {newConsultation.Tittle !== ""
              ? newConsultation.Tittle
              : "Nueva Consulta"}
          </h4>
        </CardHeader>
        <CardBody>
          <form>
            <GridContainer>
              <GridItem xs={6}>
                <TextField
                  style={{marginTop:"16px"}}
                  label="Titulo"
                  autoFocus={true}
                  required
                  success={titleInputState === "success"}
                  error={titleInputState === "error"}
                  fullWidth={true}
                  value={consultationStore.editingConsultation.title}
                  onChange={ e => {
                    validateField(
                      verifyLength(e.target.value),
                      setTitleInputState
                    );
                    consultationStore.editingConsultation.title = e.target.value
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <KeyboardDatePicker
                  style={{width:"100%"}}
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Fecha de expiración *"
                  value={consultationStore.editingConsultation.expiresOn}
                  onChange={(date) => {
                    consultationStore.editingConsultation.expiresOn = date;
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}/>
              </GridItem>
              <GridItem xs={12}>
                <Autocomplete
                  style={{marginTop:"10px"}}
                  multiple
                  id="checkboxes-tags-demo"
                  options={consultationStore.allInternalMembers}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.userName}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.userName}
                    </React.Fragment>
                  )}
                  onChange={(_, v) => consultationStore.editingConsultation.internalMembers = v}
                  fullWidth={true}
                  renderInput={(params) => (
                    <TextField {...params}  label="Miembros Internos" placeholder="Email" />
                  )}
              />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                style={{marginTop:"10px"}}
                  required
                  label="Detalles"
                  success={detailsInputState === "success"}
                  error={detailsInputState === "error"}
                  fullWidth={true}
                  multiline={true}
                  rows={7}
                  value={consultationStore.editingConsultation.description}
                  onChange= {e => {
                    validateField(
                      verifyLength(e.target.value),
                      setDetailsInputState
                    );
                    consultationStore.editingConsultation.description = e.target.value
                  }}
                />
              </GridItem>
            </GridContainer>
            <Button
              color="success"
              onClick={() => consultationStore.saveNewConsultation()}
            >
              Guardar
            </Button>
          </form>
        </CardBody>
      </Card>
      </MuiPickersUtilsProvider>
    </div>
  );
}


export default observer(ConsultationCreate);
