import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

import {apiService, authService} from "../../services";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/core components
import Assignment from "@material-ui/icons/Assignment";

// core components
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import saStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import efstyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";


const useStyles = makeStyles(styles);
const useSWStyles = makeStyles(saStyles);
const useefStyles = makeStyles(efstyles);


export default function ConsultationCreate(props) {
  const classes = useStyles();
  const saClases = useSWStyles();
  const efClasses = useefStyles();
  const [alert, setAlert] = React.useState(null);
  const [newConsultation, setConsultation] = React.useState({
    Tittle: "",
    Description: "",
    IssuedOn: Date.now(),
    ExpiresIn: 0,
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
    if (!verifyNumber(newConsultation.ExpiresIn)) {
      setExpireInputState("error");
      allValid = false;
    }
    console.log(allValid);
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
          console.log(res.response);
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
                <CustomInput
                  labelText="Titulo *"
                  success={titleInputState === "success"}
                  error={titleInputState === "error"}
                  id="title"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text",
                    required: true,
                    onChange: e => {
                      validateField(
                        verifyLength(e.target.value),
                        setTitleInputState
                      );
                      setConsultation({
                        ...newConsultation,
                        Tittle: e.target.value
                      });
                    }
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <CustomInput
                  labelText="Expira en (dias) *"
                  success={expireInputState === "success"}
                  error={expireInputState === "error"}
                  id="expiresIn"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "number",
                    required: true,
                    onChange: e => {
                      validateField(
                        verifyNumber(e.target.value),
                        setExpireInputState
                      );
                      setConsultation({
                        ...newConsultation,
                        ExpiresIn: parseInt(e.target.value)
                      });
                    }
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FormControl fullWidth className={efClasses.selectFormControl}>
                  <InputLabel
                    htmlFor="simple-select"
                    className={efClasses.selectLabel}
                  >
                    Miembros Internos
                  </InputLabel>
                  <Select
                    multiple
                    value={newConsultation.InternalMembers}
                    onChange={e => {
                      console.log(e.target.value);
                      setConsultation({
                        ...newConsultation,
                        InternalMembers: e.target.value
                      });
                    }}
                    MenuProps={{ className: efClasses.selectMenu }}
                    classes={{ select: efClasses.select }}
                    inputProps={{
                      name: "multipleSelect",
                      id: "multiple-select"
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: efClasses.selectMenuItem,
                        selected: efClasses.selectMenuItemSelected
                      }}
                    >
                      Seleccione los Miembros Internos
                    </MenuItem>
                    {allIntMembers.map(m => (
                      <MenuItem
                        key={m.id}
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
              </GridItem>
              <GridItem xs={12}>
                <CustomInput
                  labelText="Detalles *"
                  success={detailsInputState === "success"}
                  error={detailsInputState === "error"}
                  id="details"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text",
                    autoComplete: "off",
                    multiline: true,
                    rows: 7,
                    required: true,
                    onChange: e => {
                      validateField(
                        verifyLength(e.target.value),
                        setDetailsInputState
                      );
                      setConsultation({
                        ...newConsultation,
                        Description: e.target.value
                      });
                    }
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
    </div>
  );
}
