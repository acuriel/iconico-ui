import React from 'react';
import { observer } from "mobx-react";

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import MembersAvatarGroup from "./MembersAvatarGroup";

import { dateToString } from "../../helpers/utils";


function ConsultationInfo({currentConsultation, ...props}){
  return (
    <div style={{width:"100%"}}>
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
            <MembersAvatarGroup
              users={currentConsultation.internalMembers}
              statuses={currentConsultation.statuses}
            />
            <h5>Miembros Externos</h5>
            {!currentConsultation.externalMembers.length || currentConsultation.externalMembers.length === 0
            ? "Ninguno"
            :<MembersAvatarGroup
              users={currentConsultation.externalMembers}
              statuses={currentConsultation.statuses}
            />}
          </GridItem>
        </GridContainer>
      </div>
    </div>)
}

export default observer(ConsultationInfo);
