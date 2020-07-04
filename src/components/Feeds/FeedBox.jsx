import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getNameInitials, dateToString} from "helpers/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width:"100%",
    margin:"30px 10px"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'scaleY(-1)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function FeedBox({feed}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {getNameInitials(feed.author.userName)}
          </Avatar>
        }
        title={feed.author.userName}
        subheader={dateToString(feed.createdAt)}
      />
      {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      /> */}
      <CardContent style={{paddingTop:"0", paddingBottom:"0"}} >
        <h4>
          {feed.title}
        </h4>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          fullWidth
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <h5>Detalles:</h5>
          <Typography paragraph>
            {feed.summary}
          </Typography>
          <img src={`data:${feed.imageMimeType};base64,${feed.imageData}`} alt="" style={{maxHeight:"300px"}}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}
