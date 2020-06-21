import React, {useContext} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import { observer } from "mobx-react";
import StoreContext from "stores/RootStore";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import { secuencialStringSearch } from "../../helpers/utils";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Search from "@material-ui/icons/Search";
import Close from "@material-ui/icons/Close";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// core components
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";

const useStyles = makeStyles(styles);
const usePopperStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));


function HeaderLinks(props) {
  const {consultationStore, authStore} = useContext(StoreContext);
  const [openNotification, setOpenNotification] = React.useState(null);
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const logout = () => {
    handleCloseProfile();
    authStore.logout();
    props.history.push("/auth/login");
  }
  const classes = useStyles();
  const searchButton =
    classes.top +
    " " +
    classes.searchButton +
    " ";
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover);
  const wrapper = classNames();
  const managerClasses = classNames({
    [classes.managerClasses]: true
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pattern, setPattern] = React.useState("");

  const handleFocus = (elem) => {
    setAnchorEl(elem);
  }

  return (
    <div className={wrapper}>
      <CustomInput
        formControlProps={{
          className: classes.top + " " + classes.search
        }}
        inputProps={{
          placeholder: "Search",
          inputProps: {
            "aria-label":  "Search",
            value: pattern,
            className: classes.searchInput,
            onFocus: (e) => handleFocus(e.currentTarget),
            onChange: e => setPattern(e.target.value)
          }
        }}
      />
      <Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom-end" style={{zIndex:500}} transition
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }
        }>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
            <List component="nav" aria-label="main mailbox folders">
              {consultationStore.consultations
              .filter(cons => !pattern || pattern.length === 0 || secuencialStringSearch(pattern, cons.title))
              .map(cons => {
                return (
                  <ListItem button>
                    <ListItemText primary={
                      <Link onClick={() => {
                        ("heree")
                        props.history.push("/admin/consulta/" + cons.id)
                      }}> {cons.title}</Link>

                    } />
                  </ListItem>
                )
              })}
            </List>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        onClick={() => handleFocus(undefined)}
        className={searchButton}
      >
        {anchorEl ? <Close className={classes.headerLinksSvg + " " + classes.searchIcon} /> :
        <Search className={classes.headerLinksSvg + " " + classes.searchIcon} />}
      </Button>
      <div className={managerClasses}>
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-owns={openProfile ? "profile-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
          muiClasses={{
            label: ""
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (classes.links)
            }
          />
          <Hidden mdUp implementation="css">
            <span onClick={handleClickProfile} className={classes.linkText}>
              {"Profile"}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem onClick={logout} className={dropdownItem} >Log out </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

export default observer(HeaderLinks);

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool
};
