import {observable, action, computed, decorate, runInAction} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import CommentMigrator from '../migrators/CommentMigrator';
import Conversation from './Conversation';

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
  externalMembers = [];
  highlights = [];


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
    this._loadExternalMembers();
  }

  get conversation(){
    return new Conversation(this);
  }

  _loadHighlights = async () => {
    try {
      const res = await ConsultationService.getHighlights(this.id);
      runInAction(() => this.conversation.replace(
        res.data.map(m => CommentMigrator.loadFromResponse(m))
      ));
    } catch (error) {

    }
  }

  _loadExternalMembers = async () => {
    try {
      const result = await ConsultationService.getExternalConnections(this.id);
      runInAction(() => this.externalMembers.push(...result.data));
    } catch (error) {
      console.log(error);
    }
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
    } catch (error) {
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
  externalMembers: observable,
  _loadExternalMembers: action,
  save: action,
  conversation: computed,
  _update:action,
})
