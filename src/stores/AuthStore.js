import {observable, action, runInAction, decorate} from 'mobx';
import { toast } from 'react-toastify';
import BaseStore from './BaseStore';
import AuthService from 'services/api/AuthService';
import UserMigrator from 'migrators/UserMigrator';

export default class AuthStore extends BaseStore{
  signedUser = {userName:''};
  LS_KEY = 'iconicoUser';
  authenticated = false;

  constructor(rootStore){
    super(rootStore);
    const token = localStorage.getItem(this.LS_KEY);
    if(token){
      this.signedUser = UserMigrator.loadFromToken(token);
      this.authenticated = true;
    }
  }

  logout(){
    this.signedUser = undefined;
    localStorage.removeItem(this.LS_KEY);
  }

  login = async (email, password, callback) => {
    try{
      localStorage.removeItem(this.LS_KEY);
      const res = await AuthService.login(email, password);
      if(!res){
        throw new Error("Wrong credentials");
      }
      runInAction(() => {
        localStorage.setItem(this.LS_KEY, JSON.stringify(res.data))
        this.signedUser = UserMigrator.loadFromToken(res.data);
        this.authenticated = true;
        if(callback){
          callback();
        }
      })
    }catch(error){
      toast.error("No se pudo autenticar. Revise sus credenciales");
    }
  }
}

decorate(AuthStore, {
  signedUser: observable,
  authenticated: observable,
  login: action,
  logout: action,
})
