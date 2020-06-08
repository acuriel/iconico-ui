import {observable, action, decorate, computed} from 'mobx';
import { toast } from 'react-toastify';
import TruthService from '../services/api/TruthService';
import BaseStore from './BaseStore';
import CommentMigrator from 'migrators/CommentMigrator';
import TruthMigrator from 'migrators/TruthMigrator';

export default class Truth extends BaseStore{
  id=undefined;
  title="";
  summary="";
  author=undefined;
  createdOn=undefined
  consultationId="";
  consultationTitle="";
  consultationStart=undefined
  consultationEnd=undefined
  members=[];


  constructor(truth){
    super();
    if(truth){
      this._update(truth);
    }
  }

  _update(truth){
    this.id=truth.id;
    this.title=truth.title || "";
    this.summary=truth.summary || "";
    this.author = truth.author;
    this.createdOn=truth.createdOn;
    this.consultationId=truth.consultationId;
    this.consultationTitle=truth.consultationTitle;
    this.consultationStart=truth.consultationStart;
    this.consultationEnd=truth.consultationEnd;
    if(truth.members){
      this.members.replace(truth.members);
    }
  }

  save = async () => {
    try {
      await TruthService.create(TruthMigrator.saveForRequest(this));
      toast.success("Verdad guardada");
    } catch (error) {
      toast.error("Hubo un problema guardando la Verdad: " + error);
    }
  }
}

decorate(Truth, {
  id: observable,
  title: observable,
  summary: observable,
  author: observable,
  createdOn: observable,
  consultationId: observable,
  consultationTitle: observable,
  consultationStart: observable,
  consultationEnd: observable,
  members: observable,
  _update:action,
})
