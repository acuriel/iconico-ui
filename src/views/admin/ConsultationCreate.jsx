import React, { useState, useEffect } from "react";
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

export default function ConsultationCreate(props) {
  const classes = useStyles();
  const saClases = useSWStyles();
  const efClasses = useefStyles();
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
  const [expireInputState, setExpireInputState] = useState("");
  const [detailsInputState, setDetailsInputState] = useState("");

  useEffect(() => {
    apiService.getAllInternalMembers().then(res => setAllIntMembers(res.data.filter(m => m.UserName !== authService.currentUserValue.userName)));
  }, []);

  const validateField = (valid, setStateFunc) => {
    if (valid) setStateFunc("success");
    else setStateFunc("error");
  };

  const verifyLength = (value, length = 1) => value.length >= length;
  const verifyNumber = (value, minValue = 1, maxValue = Number.MAX_VALUE) =>
    value >= minValue && value <= maxValue;

  const hideAlert = () => {
    setAlert(null);
  };
  const successAlert = newConsultation => {
    let allValid = true;
    if (!verifyLength(newConsultation.Tittle)) {
      setTitleInputState("error");
      allValid = false;
    }
    if (!verifyLength(newConsultation.Description)) {
      setDetailsInputState("error");
      allValid = false;
    }
    if (newConsultation.ExpiresOn <= Date.now()) {
      setExpireInputState("error");
      allValid = false;
    }
    if (allValid) {
      apiService
        .addNewConsultation(newConsultation)
        .then(res => {
          setAlert(
            <SweetAlert
              success
              style={{ display: "block" }}
              title="Consulta creada!"
              onConfirm={() => props.history.push("/admin/consultas")}
              onCancel={() => hideAlert()}
              confirmBtnCssClass={saClases.button + " " + saClases.success}
            >
              Ha gregado una nueva consulta
            </SweetAlert>
          );
        })
        .catch(res => {
          setAlert(
            <SweetAlert
              error
              style={{ display: "block" }}
              title="Hubo un error"
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnCssClass={saClases.button + " " + saClases.success}
            >
              Hubo un problema agregando la consulta - {res.statusText}
            </SweetAlert>
          );
        });
    }
  };

  return (
    <div>
      {alert}
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
                  fullWidth
                  value={newConsultation.Tittle}
                  onChange={ e => {
                    validateField(
                      verifyLength(e.target.value),
                      setTitleInputState
                    );
                    setConsultation({
                      ...newConsultation,
                      Tittle: e.target.value
                    });
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
                  value={newConsultation.ExpiresOn}
                  onChange={(date) => {
                    console.log(date);
                    setConsultation({
                      ...newConsultation,
                      ExpiresOn: date
                    });
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
                  options={allIntMembers}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.UserName}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.UserName}
                    </React.Fragment>
                  )}
                  onChange={(_, v) => setConsultation({...newConsultation, InternalMembers: v})}
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
                  value={newConsultation.Description}
                  onChange= {e => {
                    validateField(
                      verifyLength(e.target.value),
                      setDetailsInputState
                    );
                    setConsultation({
                      ...newConsultation,
                      Description: e.target.value
                    });
                  }}
                />
              </GridItem>
            </GridContainer>
            <Button
              color="success"
              onClick={() => successAlert(newConsultation)}
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
