import {observable, action, decorate, runInAction} from 'mobx';
import { toast } from 'react-toastify';
import TruthService from '../services/api/TruthService';
import BaseStore from './BaseStore';
import TruthMigrator from 'migrators/TruthMigrator';
import ConsultationService from '../services/api/ConsultationService';

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
  created = observable.box(false);


  constructor(consultation){
    super();
    this.consultationId = consultation.id;
    this._loadTruth(consultation.id);
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
    this.created.set(!!truth.id);

    if(truth.members){
      this.members.replace(truth.members);
    }
  }

  _loadTruth = async (consultationId) => {
    try {
      const res = await ConsultationService.getTruth(consultationId);
      const truth = res.data ? TruthMigrator.loadFromResponse(res.data) : TruthMigrator.getEmpty(this.consultationId)
      runInAction(() => {
        this._update(truth)
      })
    } catch (error) {
      console.log(error);
    }
  }

  save = async () => {
    try {
      const truth = TruthMigrator.saveForRequest(this);
      await this.created.get() ?  TruthService.update(this.consultationId, truth) : TruthService.create(truth);
      runInAction(()=>{
        this.created.set(true);
      })
      toast.success("Verdad guardada");
      // this._loadTruth(this.consultationId);
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
  created:observable,
  members: observable,
  _loadTruth:action,
  _update:action,
})
