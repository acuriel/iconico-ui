import {observable, decorate,} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import InternalMemberService from 'services/api/InternalMemberService';
import UserFolderService from 'services/api/UserFolderService';
import UserMigrator from 'migrators/UserMigrator';
import UserFolderMigrator from 'migrators/UserFolderMigrator';
import ExternalMemberService from 'services/api/ExternalMemberService';

export default class ConsultationStore extends BaseStore{
  id="";
  title="";
  description="";
  author=undefined;
  internalMembers=[];
  issuedOn=undefined;
  expiresOn=undefined;
  finished=false;
  finishedOn=undefined;


  constructor(id, title, description, author, internalMembers, issuedOn, expiresOn, finished=false, finishedOn=undefined){
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.author = author;
    this.internalMembers = internalMembers;
    this.issuedOn = issuedOn;
    this.expiresOn = expiresOn;
    this.finished = finished;
    this.finishedOn = finishedOn;
  }

}

decorate(ConsultationStore, {
  id: observable,
  title: observable,
  description: observable,
  author: observable,
  internalMembers: observable,
  issuedOn: observable,
  expiresOn: observable,
  finished: observable,
  finishedOn: observable,
})
