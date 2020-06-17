import {observable, action, computed, runInAction, decorate} from 'mobx';
import { toast } from 'react-toastify';
import BaseStore from './BaseStore';
import AuthService from 'services/api/AuthService';
import UserMigrator from 'migrators/UserMigrator';

export default class UIStore extends BaseStore{
  loadingState = false;
  sweetAlertState = null;

  setLoading(value=true){
    this.loadingState = value;
  }
}

decorate(UIStore, {
  loadingState: observable,
  sweetAlertState: observable,
  setLoading: action,
})
