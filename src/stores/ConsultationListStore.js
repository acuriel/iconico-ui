import {observable, action, computed, runInAction, decorate} from 'mobx';
import { toast } from 'react-toastify';
import ConsultationService from '../services/api/ConsultationService';
import BaseStore from './BaseStore';
import Consultation from './Consultation';
import UserFolder from './UserFolder';
import Feed from './Feed';
import ConsultationMigrator from '../migrators/ConsultationMigrator';
import InternalMemberService from 'services/api/InternalMemberService';
import UserFolderService from 'services/api/UserFolderService';
import UserMigrator from 'migrators/UserMigrator';
import FeedMigrator from 'migrators/FeedMigrator';
import UserFolderMigrator from 'migrators/UserFolderMigrator';
import ExternalMemberService from 'services/api/ExternalMemberService';
import FeedService from 'services/api/FeedService';
import FileService from 'services/api/FileService';

export default class ConsultationListStore extends BaseStore{
  consultations = [];
  allInternalMembers = [];
  allExternalMembers = [];
  editingConsultation = this.getEmptyConsultation();
  selectedConsultation = undefined;
  selectedFolder = undefined;
  newFolder = new UserFolder();
  myFolders = [];
  feeds = []
  newFeed = new Feed();

  constructor(rootStore){
    super(rootStore);
    this.fetchConsultationsInFolder();
    this.getAllInternalMembers();
    this.getAllExternalMembers();
    this.fetchMyFolders();
    this.getFeeds();
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
        this.selectedConsultation = new Consultation(ConsultationMigrator.loadFromResponse(result.data), this.rootStore)
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
      if(error === '401'){
        toast.warn("Su sesión ha vencido", {toastId:"unauthorized"});
      }
    }
  }

  setFolder = (folder) => {
    this.selectedFolder = folder || undefined;
    this.fetchConsultationsInFolder();
  }

  fetchConsultationsInFolder = async () => {
    try{
      const result = await (!this.selectedFolder || typeof this.selectedFolder === "string"
        ? ConsultationService.getAll()
        : UserFolderService.getConsultations(this.selectedFolder)
      );
      console.log(result.data)
      runInAction(() => {
        this.consultations.replace(
          result.data.map(
            c => new Consultation(ConsultationMigrator.loadFromResponse(c), this.rootStore)
          )
        );
      });
    }
    catch(error){
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

  getFeeds = async () => {
    try {
      const result = await FeedService.getAll();
      runInAction(() => {
        this.feeds.replace(result.data.map(feed => FeedMigrator.loadFromResponse(feed)))
      })
    } catch (error) {
      console.log(error);
      toast.error("No se pudieron obtener Comunicados", {toastId:"fetch-feeds"});
    }
  }

  sendFeed = async () => {
    try {
      if(this.newFeed.attachedFile){
        await FileService.uploadImage(this.newFeed.attachedFile);
      }
      await FeedService.create(FeedMigrator.saveForRequest(this.newFeed));
      toast.success("Comunicado enviado", {toastId:"save-feed"});
      runInAction(() => {
        this.newFeed = new Feed();
      })
      this.getFeeds();
    } catch (error) {
      toast.error("No se pudo enviar el comunicado", {toastId:"save-feed"});
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
  feeds: observable,
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
  saveNewConsultation: action,
  getFeeds: action,
  sendFeed: action,
})
