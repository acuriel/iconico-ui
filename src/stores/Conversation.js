import {observable, action, decorate, runInAction} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import CommentMigrator from 'migrators/CommentMigrator';
import Comment from './Comment';

export default class Conversation extends BaseStore{
  consultation = undefined;
  comments = observable.array([]);
  newMessage = undefined;
  reloadingInterval = undefined;
  reloading = false;

  constructor(consultation){
    super();
    this.consultation = consultation;
    this.newMessage = new Comment(CommentMigrator.getEmptyElement(consultation.id));
    this._reload();
  }

  _reload = async (force=false) => {
    try {
      const res = await ConsultationService.getConversation(this.consultation.id);
      if(force || res.data.length !== this.comments.length){
        runInAction(() => this.comments.replace(res.data.map(c => new Comment(CommentMigrator.loadFromResponse(c), this))));
      }
    } catch (error) {
      console.log(error);
    }
  }

  setReply(msg){
    this.newMessage.replyTo = msg;
  }

  sendMessage = async () => {
    try {
      const tempMsg = CommentMigrator.saveForRequest(this.newMessage);
      await ConsultationService.addMessage(this.consultation.id, tempMsg);
      this.newMessage.text = "";
      runInAction(() => this.newMessage = new Comment(CommentMigrator.getEmptyElement(this.consultation.id), this) );
    } catch (error) {
      console.log(error);
    }
  }
}

decorate(Comment, {
  consultation: observable,
  newMessage: observable,
  reloading: observable,
  sendMessage: action,
  _reload: action,
  setReply:action,
})
