import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVert from "@material-ui/icons/MoreVert";
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Button from "components/CustomButtons/Button";


const StyledMenu = (props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
);

export default function CustomizedMenus({options}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{display: "inline-block", float:"right", marginTop:"5px"}}>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
      >
        <MoreVert/>
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((op, key) => {
          return (
            <MenuItem onClick={op.handler} key={key}>
              <ListItemIcon>
                <op.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={op.text} />
            </MenuItem>
          )
          
        })}
      </StyledMenu>
    </div>
  );
}
