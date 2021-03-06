import React, {useState} from 'react';
import { observer } from "mobx-react";

import Button from '@material-ui/core/Button';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { getNameInitials } from "../../helpers/utils";

const BGS = [ 'bg-danger','bg-warning', 'bg-success'];

function MembersAvatarGroup({users, statuses}){
  const [maxAvatars, setMaxAvatars] = useState(4);
  const [expanded, setExpanded] = useState(false);
  const expand = () =>  [...new Array(Math.ceil(users.length / maxAvatars)).keys()]
    .map((_,k) => (
      <AvatarGroup key={k} >
        {users.slice(k*maxAvatars, (k + 1) * maxAvatars).map(u =>
          <Avatar
            key={typeof u === "string" ? u : u.id}
            title={typeof u === "string" ? u : u.userName}
            alt={u.userName}
            className={BGS[statuses ? statuses.get(u.id) : 0]}
          >
            {getNameInitials(typeof u === "string" ? u : u.userName)}
          </Avatar>
          )
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
                key={typeof u === "string" ? u : u.id}
                title={typeof u === "string" ? u : u.userName}
                alt={u.userName}
                className={BGS[statuses ? statuses.get(u.id) : 0]}
              >
                {getNameInitials(typeof u === "string" ? u : u.userName)}
              </Avatar>)
            }
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
