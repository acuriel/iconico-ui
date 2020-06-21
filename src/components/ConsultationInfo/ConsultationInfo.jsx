import React, {useContext} from 'react';
import { observer } from "mobx-react";
import StoreContext from "stores/RootStore";

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import MembersAvatarGroup from "./MembersAvatarGroup";

import { dateToString } from "../../helpers/utils";


function ConsultationInfo({currentConsultation, ...props}){
  const {authStore} = useContext(StoreContext);

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
        {authStore.signedUser.isInternal
        && <div><p style={{ marginTop: "15px" }}><b>Descripción: </b></p> {currentConsultation.description}</div>}

          </GridItem>
          {authStore.signedUser.isInternal && (
            <GridItem sm={3} xs={12}>
              <h5>Miembros Internos</h5>
              <MembersAvatarGroup
                users={currentConsultation.internalMembers.sort((a,_) => a.userName === authStore.signedUser.userName ? -1 : 1)}
                statuses={currentConsultation.statuses}
              />
              <h5>Miembros Externos</h5>
              {!currentConsultation.externalMembers.length || currentConsultation.externalMembers.length === 0
              ? "Ninguno"
              :<MembersAvatarGroup
                users={currentConsultation.externalMembers.sort((a,_) => a.userName === authStore.signedUser.userName ? -1 : 1)}
                statuses={currentConsultation.statuses}
              />}
            </GridItem>
          )}

        </GridContainer>
      </div>
    </div>)
}

export default observer(ConsultationInfo);
