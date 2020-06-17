import { observable, action, decorate } from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import Conversation from './Conversation';
import CommentMigrator from 'migrators/CommentMigrator';
import Comment from './Comment';

export default class ProviderConversation extends Conversation {
  externalConnection = undefined
  constructor(externalConnection, consultation, rootStore) {
    super(consultation, rootStore);
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
    tempMsg.mentions = [this.externalConnection.internalUser.userName === this.rootStore.authStore.signedUser.userName ? this.externalConnection.externalUser : this.externalConnection.internalUser];
    this.newMessage = new Comment(tempMsg, this, this.rootStore);
  }
}

decorate(ProviderConversation, {
  externalConnection:observable,
  resetEmptyMessage:action,
})
