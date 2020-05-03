import React, {useEffect, useState} from 'react';
import {apiService, authService} from "../../services";

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import { addDays, dateToString, getNameInitials, BGS } from "../../helpers/utils";


export default function ConsultationInfo({currentConsultation, ...props}){
  const [providers, setProviders] = useState([])

  useEffect(() => {
    apiService.getExternalMembers(currentConsultation._id).then(res => {
      setProviders(res.data);
    });
  }, [])

  
  return (
    <div style={{width:"100%"}}>
      
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
        {dateToString(new Date(currentConsultation.ExpiresOn))}
      </div>
      <div className="member-list-section">
        <h5>Miembros Internos</h5>
        <AvatarGroup>
          {currentConsultation.InternalMembers.map((m, k) => 
          <Avatar 
            key={k}
            title={m.UserName} 
            alt={m.UserName}
            className={BGS[k % BGS.length]}
          >{getNameInitials(m.UserName)}</Avatar>)}
        </AvatarGroup>
        <h5>Miembros Externos</h5>
        <AvatarGroup>
          {providers.map((m, k) => 
          <Avatar 
            key={k}
            title={m.Receiver.UserName} 
            alt={m.Receiver.UserName}
            className={BGS[k % BGS.length]}
          >{getNameInitials(m.Receiver.UserName)}</Avatar>)}
        </AvatarGroup>
      </div>
      <div>
        <h5>Descripción</h5>

        <p style={{ marginTop: "15px" }}>{currentConsultation.Description}</p>
      </div>
      
    </div>)
}
