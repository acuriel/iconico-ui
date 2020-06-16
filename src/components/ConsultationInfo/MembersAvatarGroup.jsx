import React, {useState} from 'react';
import { observer } from "mobx-react";

import Button from '@material-ui/core/Button';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { getNameInitials, BGS } from "../../helpers/utils";

function MembersAvatarGroup({users, statuses}){
  const [maxAvatars, setMaxAvatars] = useState(4);
  const [expanded, setExpanded] = useState(false);

  const expand = () =>  [...new Array(Math.ceil(users.length / maxAvatars)).keys()]
    .map((_,k) => (
      <AvatarGroup key={k} >
        {users.slice(k*maxAvatars, (k + 1) * maxAvatars).map(u =>
          <Avatar
            key={u.id}
            title={u.userName}
            alt={u.userName}
            className={BGS[statuses.get(u.id)]}
          >{getNameInitials(u.userName)}</Avatar>)
        }
      </AvatarGroup>
    ));

  return (
    <div>
      {expanded
        ? <div>
          {expand()}
        </div>
        :<AvatarGroup max={maxAvatars}>
            {users.map(u =>
            <Avatar
              key={u.id}
              title={u.userName}
              alt={u.userName}
              className={BGS[statuses.get(u.id)]}
            >{getNameInitials(u.userName)}</Avatar>)}
          </AvatarGroup>
      }

      {users.length > maxAvatars && <Button variant="text" disableElevation fullWidth title="Ver más"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ExpandLessIcon/> :<ExpandMoreIcon/>}
      </Button>}
    </div>
  );
}

export default observer(MembersAvatarGroup);
