import React, {useEffect} from 'react';
import { observer } from "mobx-react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import PeopleAlt from '@material-ui/icons/PeopleAlt';
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";

function Highlights({currentConsultation}){

  useEffect(() => {
    currentConsultation.loadHighlights();
  }, [])
  return (
    <div style={{width:"100%"}}>
      <List>
        {currentConsultation.highlights.map(h => (
          <ListItem key={h.id}>
            <ListItemAvatar>
            <Badge badgeContent={h.highLightedBy.length} color="error">
                <PeopleAlt />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={h.text}
              secondary={h.highlightsListString}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => h.toggleHighlight(() => currentConsultation.loadHighlights())} title={h.highlightedByMe ? "Remover Highlight" : "Highlight"}>
                {h.highlightedByMe ? <FavoriteBorder/> : <Favorite  />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>)
}

export default observer(Highlights);
