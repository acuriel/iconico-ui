import {observable, action, computed, runInAction, decorate, autorun} from 'mobx';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import InternalMemberService from 'services/api/InternalMemberService';
import UserFolderService from 'services/api/UserFolderService';
import UserMigrator from 'migrators/UserMigrator';
import UserFolderMigrator from 'migrators/UserFolderMigrator';
import ExternalMemberService from 'services/api/ExternalMemberService';

export default class ConsultationStore extends BaseStore{
  consultations = [];
  allInternalMembers = [];
  allExternalMembers = [];
  editingConsultation = this.getEmptyConsultation();
  selectedFolder = "all";
  myFolders = [];

  constructor(rootStore){
    super(rootStore);
    this.fetchConsultationsInFolder();
    this.getAllInternalMembers();
    this.fetchMyFolders();
  }

  getAllConsultations = () => {
    this.setFolder("all");
  }

  saveNewConsultation = async () => {
    try {
      await ConsultationService.create(ConsultationMigrator.saveForRequest(this.editingConsultation));
      runInAction(()=>{
        this.editingConsultation = this.getEmptyConsultation();
        this.rootStore.uiStore.sweetAlertState = "success"
      })
    } catch (error) {
      this.rootStore.uiStore.sweetAlertState = "error"
    }
  }

  get activeConsultations() {
    return this.consultations.filter(
      c => !c.finished
    )
  }

  // FOLDERS

  fetchMyFolders = async () => {
    try{
      const result = await UserFolderService.getAll();
      runInAction(() => {
        this.myFolders.replace(result.data.map(f => UserFolderMigrator.loadFromResponse(f)))
      })
    }
    catch(error){
      console.log(error);
    }
  }

  setFolder = (folder) => {
    this.selectedFolder = folder;
    this.fetchConsultationsInFolder();
  }

  fetchConsultationsInFolder = async () => {
    try{
      const result = await ( typeof this.selectedFolder === "string"
        ? ConsultationService.getAll()
        : UserFolderService.getConsultations(this.selectedFolder)
      );
      console.log(result.data);
      runInAction(() => {
        this.consultations.replace(result.data.map(c => ConsultationMigrator.loadFromResponse(c)))
      })
    }
    catch(error){
      console.log(error);
    }
  }

  addFolder = async (name) => {
    try {
      await UserFolderService.create(UserFolderMigrator.getNewFolder(name));
      this.fetchMyFolders();
    } catch (error) {
      console.log(error);
    }
  }

  // MEMBERS

  getAllInternalMembers = async () => {
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

  get getAllMembers(){
    return this.allInternalMembers.concat(this.allExternalMembers).sort((a,b) => a.userName < b.userName ? -1 : 1);
  }

  getAllExternalMembers = async () => {
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
  myFolders: observable,
  allExternalMembers: observable,
  editingConsultation: observable,
  getAllConsultations: action,
  fetchConsultationsInFolder: action,
  fetchMyFolders: action,
  getAllInternalMembers: action,
  getAllExternalMembers: action,
  setFolder: action,
  addFolder: action,
  getAllMembers: computed,
  saveNewConsultation: action
})
