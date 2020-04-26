import React from 'react';

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import { addDays, dateToString, getNameInitials, BGS } from "../../helpers/utils";


export default function ConsultationInfo({currentConsultation, ...props}){
  return (
    <div>
      <div>
        <Person
          style={{
            fontSize: "1.5em",
            marginBottom: "-4px",
            marginRight: "5px"
          }}
        />
        {currentConsultation.Author.UserName}
        <CalendarToday
          style={{
            fontSize: "1.5em",
            marginBottom: "-4px",
            marginRight: "5px",
            marginLeft: "20px"
          }}
        />{" "}
        {dateToString(new Date(currentConsultation.IssuedOn))} -{" "}
        {dateToString(addDays(new Date(currentConsultation.IssuedOn), currentConsultation.ExpiresIn))}
      </div>
      <div>
        Miembros Internos
        <AvatarGroup max={3}>
          {currentConsultation.InternalMembers.map((m, k) => 
          <Avatar 
            key={k}
            title={m.UserName} 
            alt={m.UserName}
            className={BGS[k % BGS.length]}
          >{getNameInitials(m.UserName)}</Avatar>)}
        </AvatarGroup>
      </div>
      {/* <div>
        Miembros Externos
        <AvatarGroup max={3}>
          {c.ExternalMembers.map((m, k) => 
          <Avatar 
            key={k}
            title={m.Receiver.UserName} 
            alt={m.Receiver.UserName}
            className={BGS[k % BGS.length]}
          >{getNameInitials(m.Receiver.UserName)}</Avatar>)}
        </AvatarGroup>
      </div> */}
      <p style={{ marginTop: "15px" }}>{currentConsultation.Description}</p>
    </div>)
}
