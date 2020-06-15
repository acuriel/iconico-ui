import {observable, action, computed, runInAction, decorate, autorun} from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import Conversation from './Conversation';


export default class ProviderStore extends BaseStore{
  id="";
  consultationId="";
  internalUser=undefined;
  externalUser=undefined;
  status=0;

  constructor(externalConnection, rootStore){
    super(rootStore);
    this._loadProviderData(externalConnection);
  }

  _loadProviderData(externalConnection){
    this.id = externalConnection.id;
    this.consultationId = externalConnection.consultationId;
    this.internalUser = externalConnection.internalUser;
    this.externalUser = externalConnection.externalUser;
    this.status = externalConnection.status;
  }

  get conversation(){
    return new Conversation(this);
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
      console.log(error);
    }
  }

}

decorate(ProviderStore, {
  id:observable,
  consultationId:observable,
  internalUser:observable,
  externalUser:observable,
  status:observable,
  conversation: computed,
  updateStatus: action,
})
