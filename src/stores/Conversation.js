import { observable, action, decorate, runInAction } from 'mobx';
import { toast } from 'react-toastify';
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

  constructor(consultation, rootStore){
    super(rootStore);
    this.consultation = consultation;
  }

  resetEmptyMessage(){
    throw new Error("Not Implemented")
  }

  retrieve(force){
    throw new Error("Not Implemented")
  }

  _reload = async (force = false) => {
    try {
      const res = await this.retrieve(force);
      if(force){
        runInAction(() => this.comments.replace(res.data.map(c => new Comment(CommentMigrator.loadFromResponse(c), this, this.rootStore))));
      } else if (res.data.length > 0) {
        runInAction(() => this.comments.push(...res.data.map(c => new Comment(CommentMigrator.loadFromResponse(c), this, this.rootStore))));
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
      runInAction(() => this.newMessage = new Comment(CommentMigrator.getEmptyElement(this.consultation.id), this, this.rootStore));
    } catch (error) {
      console.log(error);
      toast.error("Hubo un problema enviando el mensaje: " + error);
    }
  }
}

decorate(Conversation, {
  consultation: observable,
  newMessage: observable,
  galeryActiveIndex: observable,
  sendMessage: action,
  _reload: action,
  setReply: action,
  setGaleryVisibility: action,
  setGaleryActiveIndex: action,
  resetEmptyMessage: action
})
