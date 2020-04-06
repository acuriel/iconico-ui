import React from "react";
import cx from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";

import {authService} from "../services";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import { dashboardRoutes } from "helpers/routes";

import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import { PrivateRoute } from "../components/Routes/PrivateRoute";

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const image = require("../assets/img/sidebar-2.jpg");
  const color = "blue";
  const bgColor = "black";
  // const [hasImage, setHasImage] = React.useState(true);
  const [logo, setLogo] = React.useState(require("../assets/img/logo-white.svg"));
  const [currentUser, setCurrentUser] = React.useState(undefined)
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    const subscription = authService.currentUser.subscribe(setCurrentUser);
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
      subscription.unsubscribe();
    };
  }, [currentUser, mainPanel]);
  // functions for changeing the states from components
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getActiveRoute = routes => {
    let activeRoute = "";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      return (
        <PrivateRoute
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      );
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={dashboardRoutes.filter(r => r.hasOwnProperty('icon'))}
        logoText={"Iconico"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        currentUser={currentUser}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(dashboardRoutes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
            <div className={classes.container}>
              {authService.currentUserValue ? (
                <Switch>
                  {getRoutes(dashboardRoutes)}
                  <Redirect from="/admin" to="/admin/dashboard" />
                </Switch>
              ) : (
                <Redirect to="/auth/login-page" />
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
