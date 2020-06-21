import {observable, action, runInAction, decorate} from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ProviderConversation from './ProviderConversation';


export default class ProviderStore extends BaseStore{
  id="";
  consultationId="";
  consultation = undefined;
  internalUser=undefined;
  externalUser=undefined;
  status=0;
  conversation = undefined;

  constructor(externalConnection, consultation, rootStore){
    super(rootStore);
    this.consultation = consultation;
    this._loadProviderData(externalConnection);
    this.conversation = new ProviderConversation(this, this.consultation, this.rootStore);
  }

  _loadProviderData(externalConnection){
    this.id = externalConnection.id;
    this.consultationId = externalConnection.consultationId;
    this.internalUser = externalConnection.internalUser;
    this.externalUser = externalConnection.externalUser;
    this.status = externalConnection.status;
  }

  updateStatus = async (newValue) => {
    try {
      await ConsultationService.updateExternalConnectionStatus(
        this.consultationId,
        this.externalUser.id,
        newValue
      );
      runInAction(()=>{
        this.status = newValue;
      })
      toast.success(`Estado actualizado`, {toastId:"cnx-status-update"});
    } catch (error) {
      toast.error("Hubo un error actualizando el estado: " + error, {toastId:"cnx-status-update"})
      (error);
    }
  }

}

decorate(ProviderStore, {
  id:observable,
  consultationId:observable,
  consultation:observable,
  internalUser:observable,
  externalUser:observable,
  status:observable,
  conversation: observable,
  updateStatus: action,
})
