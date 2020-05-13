import {observable, action, computed, runInAction, decorate} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import InternalMemberService from 'services/api/InternalMemberService';
import UserMigrator from 'migrators/UserMigrator';
import ExternalMemberService from 'services/api/ExternalMemberService';

export default class ConsultationStore extends BaseStore{
  consultations = [];
  allInternalMembers = [];
  allExternalMembers = [];
  editingConsultation = this.getEmptyConsultation();
  
  constructor(rootStore){
    super(rootStore);
    this.getAllConsultations();
    this.getAllInternalMembers();
  }

  getAllConsultations = async () => {
    try{
      const result = await ConsultationService.getAll();
      runInAction(() => {
        this.consultations.replace(result.data.map(c => ConsultationMigrator.loadFromResponse(c)))
      })
    }
    catch(error){
      console.log(error);
    }
  }

  get activeConsultations() {
    return this.consultations.filter(
      c => !c.finished
    )
  }

  getAllInternalMembers = async () => {
    try{
      const result = await ExternalMemberService.getAll();
      runInAction(() => {
        this.allExternalMembers.replace(result.data.map(c => UserMigrator.loadFromResponse(c)))
      })
    }
    catch(error){
      console.log(error);
    }
  }

  get getAllMembers(){
    return this.allInternalMembers.concat(this.allExternalMembers).sort((a,b) => a.userName < b.userName ? -1 : 1);
  }

  getAllExternalMembers = async () => {
    try{
      const result = await InternalMemberService.getAll();
      runInAction(() => {
        this.allInternalMembers.replace(result.data.map(c => UserMigrator.loadFromResponse(c)))
      })
    }
    catch(error){
      console.log(error);
    }
  }

  saveNewConsultation = async () => {
    try {
      await ConsultationService.create(this.editingConsultation);
      runInAction(()=>{
        this.editingConsultation = this.getEmptyConsultation();
      })
    } catch (error) {
      
    }
  }

  getEmptyConsultation(){
    return {
      id:"",
      title: "",
      description:"",
      internalMembers:[],
      expiresOn:new Date(Date.now()),
    }
  }
}

decorate(ConsultationStore, {
  consultations: observable,
  activeConsultations: computed,
  allInternalMembers: observable,
  allExternalMembers: observable,
  editingConsultation: observable,
  getAllConsultations: action,
  getAllInternalMembers: action,
  getAllExternalMembers: action,
  getAllMembers: computed, 
  saveNewConsultation: action
})
