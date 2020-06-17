import {observable, action, decorate, runInAction} from 'mobx';
import UserFolderService from '../services/api/UserFolderService';
import BaseStore from './BaseStore';
import UserFolderMigrator from 'migrators/UserFolderMigrator';

export default class UserFolder extends BaseStore{
  id=undefined;
  name="";
  author=undefined;
  isPinned=false;


  constructor(userFolder, rootStore){
    super(rootStore);
    if(userFolder){
      this.id = userFolder.id;
      this.name = userFolder.name;
      this.author = userFolder.author;
      this.isPinned = userFolder.isPinned;
    }

  }

  save = async () => {
    try {
      await UserFolderService.create(UserFolderMigrator.saveForRequest(this));
    } catch (error) {
      throw error;
    }
  }

  togglePinned = async () => {
    try {
      await UserFolderService.update(this.id, {...UserFolderMigrator.saveForRequest(this), isPinned: !this.isPinned});
      runInAction(() => this.isPinned = !this.isPinned);
    } catch (error) {
      console.log(error);
    }
  }

}

decorate(UserFolder, {
  id: observable,
  name: observable,
  isPinned: observable,
  author: observable,
  save: action,
  togglePinned: action,
})
