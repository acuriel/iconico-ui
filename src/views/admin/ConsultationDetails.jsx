import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router";
import StoreContext from "stores/RootStore";
import { observer } from "mobx-react";
import {apiService, authService} from "../../services";
import Loading from "../../components/Loading/Loading.js";

// @material-ui/icons
import Comment from "@material-ui/icons/Comment";
import Assignment from "@material-ui/icons/Assignment";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import People from "@material-ui/icons/People";
import Code from "@material-ui/icons/Code";
import Done from "@material-ui/icons/Done";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import Warning from "@material-ui/icons/Warning";
// core components
import Tabs from "../../components/CustomTabs/CustomTabs";

import Chat from "../../components/Chat/Chat";
import Providers from "../../components/Chat/Providers";
import ConsultationInfo from "components/ConsultationInfo/ConsultationInfo";
import Highlights from "components/ConsultationInfo/Highlights";
import Truth from "components/ConsultationInfo/Truth";
import CustomizedMenus from "components/CustomButtons/CustomizedMenus";



function ConsultationDetails({match}) {
  const {consultationStore, uiStore} = useContext(StoreContext);

  useEffect(() => {
    consultationStore.selectConsultation(match.params.id);
  }, [])

  return !consultationStore.selectedConsultation ? (
    <Loading />
  ) : (
    <div>
      <div>
        {consultationStore.selectedConsultation.finished || <CustomizedMenus options={[
          {icon:Done, text:"Resuelto", handler: () => {}},
          {icon:QueryBuilder, text:"En Proceso", handler: () => {}},
          {icon:Warning, text:"Sin solucion", handler: () => {}}
        ]}/>}
        <h3>{consultationStore.selectedConsultation.title}</h3>
      </div>
      <Tabs
        headerColor="info"
        rightButtonHandler={() => consultationStore.selectedConsultation.terminate()}
        rightButtonDisabled={consultationStore.selectedConsultation.finished}
        tabs={[
          {
            tabName: "Detalles",
            tabIcon: Assignment,
            tabContent: <ConsultationInfo currentConsultation={consultationStore.selectedConsultation} />,
            visible: uiStore.signedUser.isInternal
          },
          {
            tabName: "Chat",
            tabIcon: Comment,
            tabContent: <Chat conversation={consultationStore.selectedConsultation.conversation}/>,
            visible: uiStore.signedUser.isInternal
          },
          {
            tabName: "Proveedores",
            tabIcon: People,
            tabContent: <Providers currentConsultation={consultationStore.selectedConsultation} />,
            visible: true
          },
          {
            tabName: "Highlights",
            tabIcon: Code,
            tabContent: <Highlights currentConsultation={consultationStore.selectedConsultation}/>,
            visible: true
          },
          {
            tabName: "Verdades",
            tabIcon: PlaylistAddCheck,
            tabContent: <Truth truth={consultationStore.selectedConsultation.truth}/>,
            visible: consultationStore.selectedConsultation.finished
          }
        ].filter(tab => tab.visible)}
      />
    </div>
  );
}

export default withRouter(observer(ConsultationDetails));
