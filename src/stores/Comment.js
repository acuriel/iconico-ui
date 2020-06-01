import {observable, action, decorate, computed} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import AuthService from '../services/api/AuthService';
import BaseStore from './BaseStore';
import CommentMigrator from 'migrators/CommentMigrator';

export default class Comment extends BaseStore{
  conversation;
  id=undefined;
  consultationId=undefined;
  text="";
  postedOn=undefined;
  author=undefined;
  mentions=[];
  highlighted=false;
  highLightedBy=[];
  replyTo = undefined;
  imageData = undefined;


  constructor(comment, conversation=undefined){
    super();
    this.conversation = conversation;
    if(comment){
      this._update(comment);
    }
  }

  _update(comment){
    this.id = comment.id;
    this.consultationId = comment.consultationId;
    this.text = comment.text;
    this.postedOn = comment.postedOn;
    this.author = comment.author;
    this.mentions.replace(comment.mentions);
    this.highlighted = comment.highlighted;
    this.highLightedBy.replace(comment.highLightedBy);
    this.replyTo = comment.replyTo;
    // this.imageData.replace(comment.imageData);
  }
  _reload = async () => {
    try {
      const res = await ConsultationService.getMessage(this.consultationId, this.id);
      this._update(CommentMigrator.loadFromResponse(res.data));
    } catch (error) {

    }
  }

  toggleHighlight = async () => {
    try {
      console.log("Toggled");
      await ConsultationService.toggleHighlight(this.consultationId, this.id);
      if(this.conversation) this.conversation._reload(true);
    } catch (error) {
      console.log(error);
    }
  }

  save = async () => {
    try {
      await ConsultationService.addMessage(this.consultationId, CommentMigrator.saveForRequest(this))
    } catch (error) {

    }
  }

  get highlightsListString(){
    return this.highLightedBy.map(u => u.userName).join(", ");
  }

  get highlightedByMe(){
    return this.highLightedBy.some(u => u.userName === AuthService.currentUserValue.userName);
  }

}

decorate(Comment, {
  id: observable,
  consultationId: observable,
  text: observable,
  postedOn: observable,
  author: observable,
  mentions: observable,
  highlighted: observable,
  highLightedBy: observable,
  replyTo: observable,
  imageData: observable,
  _update:action,
  highlightsListString: computed,
  highlightedByMe: computed,
  // toggleHighlight: action,
})
