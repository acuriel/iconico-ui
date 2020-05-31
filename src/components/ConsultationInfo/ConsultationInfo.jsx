import React from 'react';
import { observer } from "mobx-react";

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import NotesIcon from '@material-ui/icons/Notes';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";

import { dateToString, getNameInitials, BGS } from "../../helpers/utils";


function ConsultationInfo({currentConsultation, ...props}){


  return (
    <div style={{width:"100%"}}>

      <div>

      </div>

      <div style={{marginTop:'10px'}}>
      </div>
      <div className="member-list-section">
        <GridContainer>
          <GridItem sm={9} xs={12}>
          <Person
          style={{
            fontSize: "1.5em",
            marginBottom: "-4px",
            marginRight: "5px"
          }}
        />
        {currentConsultation.author.userName}
        <CalendarToday
          style={{
            fontSize: "1.5em",
            marginBottom: "-4px",
            marginRight: "5px",
            marginLeft: "20px"
          }}
        />{" "}
        {dateToString(currentConsultation.issuedOn)} -{" "}
        {dateToString(currentConsultation.expiresOn)}
        <p style={{ marginTop: "15px" }}><b>Descripción: </b></p>
        {currentConsultation.description}

          </GridItem>
          <GridItem sm={3} xs={12}>
            <h5>Miembros Internos</h5>
            <AvatarGroup max={3}>
              {currentConsultation.internalMembers.map((m, k) =>
              <Avatar
                key={k}
                title={m.userName}
                alt={m.userName}
                className={BGS[k % BGS.length]}
              >{getNameInitials(m.userName)}</Avatar>)}
            </AvatarGroup>
            <h5>Miembros Externos</h5>
            {currentConsultation.externalMembers.length === 0
            ? "Ninguno"
            :<AvatarGroup>
              {currentConsultation.externalMembers.map((m, k) =>
              <Avatar
                key={k}
                title={m.Receiver.UserName}
                alt={m.Receiver.UserName}
                className={BGS[k % BGS.length]}
              >{getNameInitials(m.Receiver.UserName)}</Avatar>)}
            </AvatarGroup>}

          </GridItem>
        </GridContainer>
      </div>
    </div>)
}

export default observer(ConsultationInfo);
