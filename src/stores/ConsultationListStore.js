import {observable, action, computed, runInAction, decorate, autorun} from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import Consultation from './Consultation';
import UserFolder from './UserFolder';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import InternalMemberService from 'services/api/InternalMemberService';
import UserFolderService from 'services/api/UserFolderService';
import UserMigrator from 'migrators/UserMigrator';
import UserFolderMigrator from 'migrators/UserFolderMigrator';
import ExternalMemberService from 'services/api/ExternalMemberService';

export default class ConsultationListStore extends BaseStore{
  consultations = [];
  allInternalMembers = [];
  allExternalMembers = [];
  editingConsultation = this.getEmptyConsultation();
  selectedConsultation = undefined;
  selectedFolder = undefined;
  newFolder = new UserFolder();
  myFolders = [];

  constructor(rootStore){
    super(rootStore);
    this.fetchConsultationsInFolder();
    this.getAllInternalMembers();
    this.getAllExternalMembers();
    this.fetchMyFolders();
  }

  getAllConsultations = () => {
    this.setFolder(undefined);
  }

  saveNewConsultation = async () => {
    try {
      await ConsultationService.create(ConsultationMigrator.saveForRequest(this.editingConsultation));
      runInAction(()=>{
        this.editingConsultation = this.getEmptyConsultation();
        this.rootStore.uiStore.sweetAlertState = "success"
        this.fetchConsultationsInFolder();
      })
    } catch (error) {
      this.rootStore.uiStore.sweetAlertState = "error"
    }
  }

  selectConsultation = async (id) => {
    try {
      const result = await ConsultationService.getItem(id);
      runInAction(()=> {
        this.selectedConsultation = new Consultation(ConsultationMigrator.loadFromResponse(result.data))
      });
    } catch (e) {
      toast.error("No se pudo obtener la consulta", {toastId:"consultation-unreachable"});
    }
  }

  get activeConsultations() {
    return this.consultations.filter(
      c => !c.finished
    );
  }

  // FOLDERS

  fetchMyFolders = async () => {
    try{
      const result = await UserFolderService.getAll();
      runInAction(() => {
        this.myFolders.replace(result.data.map(f => new UserFolder(UserFolderMigrator.loadFromResponse(f))))
      })
    }
    catch(error){
      console.log('Here');
      console.log(error);
      if(error === '401'){
        toast.warn("Su sesión ha vencido", {toastId:"unauthorized"});
      }
    }
  }

  setFolder = (folder) => {
    this.selectedFolder = folder ? folder : undefined;
    this.fetchConsultationsInFolder();
  }

  fetchConsultationsInFolder = async () => {
    try{
      const result = await (!this.selectedFolder || typeof this.selectedFolder === "string"
        ? ConsultationService.getAll()
        : UserFolderService.getConsultations(this.selectedFolder)
      );
      runInAction(() => {
        this.consultations.replace(
          result.data.map(
            c => new Consultation(ConsultationMigrator.loadFromResponse(c))
          )
        );
      });
    }
    catch(error){
      console.log(error);
      toast.error(error, {toastId:"server-unreachable"});
    }
  }

  addFolder = async () => {
    try {
      await this.newFolder.save();
      const name = this.newFolder.name;
      toast.success(`Carpeta ${name} agreagada`, {toastId:"save-folfer"});
      this.fetchMyFolders();
      this.newFolder = new UserFolder();
    } catch (error) {
      console.log(error);
      toast.error("No se pudo guardar la carpeta", {toastId:"save-folfer"});

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

decorate(ConsultationListStore, {
  consultations: observable,
  activeConsultations: computed,
  allInternalMembers: observable,
  myFolders: observable,
  allExternalMembers: observable,
  selectedConsultation: observable,
  editingConsultation: observable,
  getAllConsultations: action,
  fetchConsultationsInFolder: action,
  fetchMyFolders: action,
  getAllInternalMembers: action,
  getAllExternalMembers: action,
  selectConsultation: action,
  setFolder: action,
  addFolder: action,
  newFolder: observable,
  getAllMembers: computed,
  selectedFolder: observable,
  saveNewConsultation: action
})
