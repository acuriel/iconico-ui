import { observable, decorate, action } from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import Conversation from './Conversation';
import CommentMigrator from 'migrators/CommentMigrator';
import Comment from './Comment';

export default class InternalConversation extends Conversation {
  consultation = undefined;

  constructor(consultation) {
    super();
    this.consultation = consultation;
    this.resetEmptyMessage();
  }

  retrieve(force){
    return ConsultationService.getConversation(
      this.consultation.id,
      this.comments.slice().length > 0 && !force
        ? this.comments[this.comments.length - 1].postedOn
        : undefined);
  }

  resetEmptyMessage(){
    this.newMessage = new Comment(CommentMigrator.getEmptyElement(this.consultation.id));
  }

}

decorate(InternalConversation, {
  consultation: observable,
  resetEmptyMessage:action,
})
