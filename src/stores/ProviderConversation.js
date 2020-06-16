import { observable, action, decorate } from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import Conversation from './Conversation';
import CommentMigrator from 'migrators/CommentMigrator';
import Comment from './Comment';
import AuthService from 'services/api/AuthService';

export default class ProviderConversation extends Conversation {
  externalConnection = undefined
  constructor(externalConnection, consultation) {
    super(consultation);
    this.externalConnection = externalConnection;
    this.resetEmptyMessage();
  }

  retrieve(force){
    return ConsultationService.getExternalConnectionConversation(
      this.externalConnection.consultationId,
      this.externalConnection.externalUser.id,
      this.comments.slice().length > 0 && !force
        ? this.comments[this.comments.length - 1].postedOn
        : undefined);
  }

  resetEmptyMessage(){
    const tempMsg = CommentMigrator.getEmptyElement(this.externalConnection.consultationId);
    tempMsg.mentions = [this.externalConnection.internalUser.userName === AuthService.currentUserValue.userName ? this.externalConnection.externalUser : this.externalConnection.internalUser];
    this.newMessage = new Comment(tempMsg);
  }
}

decorate(ProviderConversation, {
  externalConnection:observable,
  resetEmptyMessage:action,
})
