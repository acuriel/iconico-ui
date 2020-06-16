import {observable, action, computed, decorate, runInAction} from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ProviderStore from './ProviderStore';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import CommentMigrator from '../migrators/CommentMigrator';
import UserStatusMigrator from '../migrators/UserStatusMigrator';
import ExternalConnectionMigrator from '../migrators/ExternalConnectionMigrator';
import InternalConversation from './InternalConversation';
import Comment from './Comment';
import Truth from './Truth';

export default class Consultation extends BaseStore{
  id=undefined;
  title="";
  description="";
  author=undefined;
  internalMembers=[];
  issuedOn=undefined;
  expiresOn=undefined;
  finished=false;
  finishedOn=undefined;
  externalConnections = [];
  highlights = [];
  statuses = observable.map();
  truth = undefined;


  constructor(consultation){
    super();
    if(consultation){
      this._update(consultation);
    }
  }

  _update(consultation){
    this.id = consultation.id;
    this.title = consultation.title;
    this.description = consultation.description;
    this.author = consultation.author;
    this.internalMembers.replace(consultation.internalMembers);
    this.issuedOn = consultation.issuedOn;
    this.expiresOn = consultation.expiresOn;
    this.finished = consultation.finished;
    this.finishedOn = consultation.finishedOn;
    this.truth = new Truth(consultation);
    this._loadExternalMembers();
    this.loadHighlights();
    this._loadMembersStatuses();
  }

  get conversation(){
    return new InternalConversation(this);
  }

  get externalMembers(){
    return this.externalConnections.map(cnx => cnx.externalUser);
  }

  loadHighlights = async () => {
    try {
      const res = await ConsultationService.getHighlights(this.id);
      runInAction(() => {
        this.highlights.replace(res.data.map(h => new Comment(CommentMigrator.loadFromResponse(h))))
      })
    } catch (error) {
      console.log(error);
    }
  }

  _loadExternalMembers = async () => {
    try {
      const result = await ConsultationService.getExternalConnections(this.id);
      runInAction(() => this.externalConnections.replace(
        result.data.map(
          cnx => new ProviderStore(ExternalConnectionMigrator.loadFromResponse(cnx), this)
       ))
      );
    } catch (error) {
      console.log(error);
    }
  }
  _loadMembersStatuses = async () => {
    try {
      const result = await ConsultationService.getMembersStatuses(this.id);
      runInAction(() => {
        result.data.forEach(s => {
          const status = UserStatusMigrator.loadFromResponse(s);
          this.statuses.set(status.userId, status.status);
        })
      })
    } catch (error) {
      console.log(error);
    }
  }

  connectWithProvider = async (externalId) => {
    try {
      await ConsultationService.addExternalConnection(this.id, externalId);
      this._loadExternalMembers();
    } catch (error) {
      console.log(error);
    }
  }

  getMemberStatus(userId){
    const statuses = this.statuses.filter(s => s.userId === userId);
    if(statuses.length === 0) return 0;
    return statuses[0].status;
  }

  save = async (callback) => {
    try {
      var action = undefined;
      if(this.id){
        action = ConsultationService.update;
      } else{
        action = ConsultationService.create;
      }
      await action(ConsultationMigrator.saveForRequest(this.editingConsultation));
      if(callback) callback();
    } catch (error) {
      console.log(error);
    }
  }

  terminate = async (callback) => {
    try {
      const res = await ConsultationService.terminate(this.id)
      this._update(ConsultationMigrator.loadFromResponse(res.data));
      if(callback) callback();
      toast.success(`Consulta Finalizada`, {toastId:"finished-consultation"});
    } catch (error) {
      toast.error("Hubo un error: " + error, {toastId:"finished-consultation"});
      console.log(error);
    }
  }

}

decorate(Consultation, {
  id: observable,
  title: observable,
  description: observable,
  author: observable,
  internalMembers: observable,
  issuedOn: observable,
  expiresOn: observable,
  finished: observable,
  finishedOn: observable,
  externalConnections: observable,
  highlights: observable,
  _loadExternalMembers: action,
  _loadMembersStatuses:action,
  save: action,
  conversation: computed,
  externalMembers: computed,
  _update:action,
  loadHighlights:action,
})
