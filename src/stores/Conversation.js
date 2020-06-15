import { observable, action, decorate, runInAction, computed } from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import CommentMigrator from 'migrators/CommentMigrator';
import Comment from './Comment';

export default class Conversation extends BaseStore {
  consultation = undefined;
  comments = observable.array([]);
  newMessage = undefined;
  reloadingInterval = undefined;
  galeryVisibility = observable.box(false);
  galeryActiveIndex = 0;

  constructor(consultation) {
    super();
    this.consultation = consultation;
    this.newMessage = new Comment(CommentMigrator.getEmptyElement(consultation.id));
    // this._reload();
  }

  _reload = async (force = false) => {
    try {
      const res = await ConsultationService.getConversation(this.consultation.id, this.comments.slice().length > 0 && !force ? this.comments[this.comments.length - 1].postedOn : undefined);
      if(force){
        runInAction(() => this.comments.replace(res.data.map(c => new Comment(CommentMigrator.loadFromResponse(c), this))));
      } else if (res.data.length > 0) {
        runInAction(() => this.comments.push(...res.data.map(c => new Comment(CommentMigrator.loadFromResponse(c), this))));
      }
    } catch (error) {
      console.log(error);
      toast.error("No se pudo actualizar la conversacion" + error, { toastId: "conversation-unreachable" });
    }
  }

  setReply(msg) {
    this.newMessage.replyTo = msg;
  }

  get allImagesSrc() {
    const result = this.comments.filter(msg => msg.imageData).map(msg => {
      return { src: `data:${msg.imageMimeType};base64,${msg.imageData}`, alt: '', messageId: msg.id }
    })
    return result;
  }

  setGaleryActiveIndex(msgId){
    this.galeryActiveIndex = this.allImagesSrc.findIndex(img => img.messageId === msgId);
  }

  setGaleryVisibility(value){
    this.galeryVisibility.set(value);
    console.log("Hide")
  }

  sendMessage = async () => {
    try {
      await this.newMessage.save()
      this.newMessage.text = "";
      runInAction(() => this.newMessage = new Comment(CommentMigrator.getEmptyElement(this.consultation.id), this));
    } catch (error) {
      console.log(error);
      toast.error("Hubo un problema enviando el mensaje: " + error);
    }
  }
}

decorate(Comment, {
  consultation: observable,
  newMessage: observable,
  galeryActiveIndex: observable,
  sendMessage: action,
  _reload: action,
  setReply: action,
  setGaleryVisibility: action,
  setGaleryActiveIndex: action
  // allImagesSrc: computed,
})
