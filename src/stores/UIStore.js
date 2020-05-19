import {observable, action, computed, runInAction, decorate} from 'mobx';
import BaseStore from './BaseStore';
import AuthService from 'services/api/AuthService';

export default class UIStore extends BaseStore{
  signedUser;
  loadingState = false;
  sweetAlertState = null;

  constructor(rootStore){
    super(rootStore);
    this.signedUser = AuthService.currentUserValue;
  }

  logout(){
    this.signedUser = undefined;
    AuthService.logout();
  }

  setLoading(value=true){
    this.loadingState = value;
  }
}

decorate(UIStore, {
  signedUser: observable,
  loadingState: observable,
  sweetAlertState: observable,
  setLoading: action,
})
