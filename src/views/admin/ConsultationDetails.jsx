import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import {apiService, authService} from "../../services";
import Loading from "../../components/Loading/Loading.js";

// @material-ui/icons
import Comment from "@material-ui/icons/Comment";
import Assignment from "@material-ui/icons/Assignment";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import People from "@material-ui/icons/People";
import Code from "@material-ui/icons/Code";
import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
// core components
import Tabs from "../../components/CustomTabs/CustomTabs";

import { addDays, dateToString } from "../../helpers/utils";
import Chat from "../../components/Chat/Chat";
import Providers from "../../components/Chat/Providers";


function ConsultationDetails(props) {
  const [currentConsultation, setCurrentConsultation] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    apiService.getConsultationById(props.match.params.id).then(res => {
      let data = res.data;
      setCurrentConsultation(data);
      setLoading(false);
    });
  }, []);
  const details = () => {
    let date = new Date(currentConsultation.IssuedOn);
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
          {dateToString(date)} -{" "}
          {dateToString(addDays(date, currentConsultation.ExpiresIn))}
        </div>
        <p style={{ marginTop: "15px", marginBottom: "50px" }}>
          {currentConsultation.Description}
        </p>
      </div>
    );
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div>
        <h3>{currentConsultation.Tittle}</h3>
      </div>
      <Tabs
        headerColor="info"
        tabs={[
          {
            tabName: "Detalles",
            tabIcon: Assignment,
            tabContent: details(),
            limited: false
          },
          {
            tabName: "Chat",
            tabIcon: Comment,
            tabContent: <Chat currentElement={currentConsultation} 
              getEndpoint={apiService.getConsultationConv} 
              postEndpoint={apiService.addMessage}/>,
            limited: true
          },
          {
            tabName: "Proveedores",
            tabIcon: People,
            tabContent: <Providers currentElement={currentConsultation} />,
            limited: false
          },
          {
            tabName: "Highlights",
            tabIcon: Code,
            tabContent: <p>Seccion en construccion</p>,
            limited: true
          },
          {
            tabName: "Verdades",
            tabIcon: PlaylistAddCheck,
            tabContent: <p>Seccion en construccion</p>,
            limited: true
          }
        ].filter(tab => authService.isInternal() || !tab.limited)}
      />
    </div>
  );
}

export default withRouter(ConsultationDetails);
