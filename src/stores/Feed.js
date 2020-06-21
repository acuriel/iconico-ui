import {observable, action, decorate} from 'mobx';
import { toast } from 'react-toastify';
import BaseStore from './BaseStore';

export default class Feed extends BaseStore{
  id=undefined;
  title="";
  summary="";
  author=undefined;
  createdOn=undefined;



  constructor(feed, rootStore){
    super(rootStore);
    if(feed){
      this._update(feed)
    }
  }

  _update(feed){
    this.id=feed.id;
    this.title=feed.title || "";
    this.summary=feed.summary || "";
    this.author = feed.author;
    this.createdOn=feed.createdOn;
  }

  save = async () => {
    try {
      toast.success("Comunicado enviado");
    } catch (error) {
      toast.error("Hubo un problema guardando el Comunicado: " + error);
    }
  }
}

decorate(Feed, {
  id: observable,
  title: observable,
  summary: observable,
  author: observable,
  createdOn: observable,
  _update:action,
})
