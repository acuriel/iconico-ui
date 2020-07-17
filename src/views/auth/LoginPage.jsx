import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import StoreContext from "stores/RootStore";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
// import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

function LoginPage(props) {
  const { authStore } = useContext(StoreContext);


  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  useEffect(() => {

  }, [])
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
     login();
    }
  }
  const login = () => {
    authStore.login(email, password, () => {
      props.history.push("/admin")
    });
  };
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="info"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange:e => setEmail(e.target.value),
                      onKeyPress:(e) => handleKeyPress(e),
                      endAdornment: (
                        <Email className={classes.inputAdornmentIcon} />
                      ),
                      type: "email",
                      autoComplete: "off",
                    }}
                  />

                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}

                  inputProps={{
                    onChange:e => setPassword(e.target.value),
                    onKeyPress:(e) => handleKeyPress(e),
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setPasswordVisibility(!passwordVisibility)}
                        onMouseDown={event => event.preventDefault()}
                      >
                        {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                    type: passwordVisibility ? "text" : "password",
                    autoComplete: "off",
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button
                  color="info"
                  simple
                  size="lg"
                  block
                  onClick={e => {
                    login();
                  }}
                >
                  Entrar
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default observer(LoginPage);
