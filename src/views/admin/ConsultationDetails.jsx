import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router";
import StoreContext from "stores/RootStore";
import { observer } from "mobx-react";
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
  const {consultationStore, authStore} = useContext(StoreContext);
  const consultation = consultationStore.selectedConsultation
  useEffect(() => {
    consultationStore.selectConsultation(match.params.id);
  }, [match.params.id])

  return !consultation ? (
    <Loading />
  ) : (
    <div>
      <div>
        {consultation.finished || <CustomizedMenus options={[
          {icon:Done, text:"Resuelto", handler: () => consultation.changeMyStatus(2)},
          {icon:QueryBuilder, text:"En Proceso", handler: () => consultation.changeMyStatus(1)},
          {icon:Warning, text:"Sin solucion", handler: () => consultation.changeMyStatus(0)}
        ]}/>}
        <h3>{consultation.title}</h3>
      </div>
      <Tabs
        headerColor="info"
        rightButtonHandler={() => consultation.terminate()}
        rightButtonDisabled={consultation.finished}
        tabs={[
          {
            tabName: "Detalles",
            tabIcon: Assignment,
            tabContent: <ConsultationInfo currentConsultation={consultation} />,
            visible: authStore.signedUser.isInternal
          },
          {
            tabName: "Chat",
            tabIcon: Comment,
            tabContent: <Chat conversation={consultation.conversation}/>,
            visible: authStore.signedUser.isInternal
          },
          {
            tabName: "Proveedores",
            tabIcon: People,
            tabContent: <Providers currentConsultation={consultation} />,
            visible: true
          },
          {
            tabName: "Highlights",
            tabIcon: Code,
            tabContent: <Highlights currentConsultation={consultation}/>,
            visible: true
          },
          {
            tabName: "Verdades",
            tabIcon: PlaylistAddCheck,
            tabContent: <Truth truth={consultation.truth}/>,
            visible: consultationStore.selectedConsultation.finished
          }
        ].filter(tab => tab.visible)}
      />
    </div>
  );
}

export default withRouter(observer(ConsultationDetails));
