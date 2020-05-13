import {baseService} from './AxiosApiService';
import { BehaviorSubject } from 'rxjs';


class AuthService {
  API_LOGIN_URL = "token";
  LS_KEY = 'iconicoUser'
  currentUserSubject;


  constructor(){
    const savedToken = localStorage.getItem(this.LS_KEY);
    if(savedToken){
      const user = JSON.parse(savedToken);
      this.currentUserSubject = new BehaviorSubject(user);
    }else{
      this.currentUserSubject = new BehaviorSubject(null);
    }
  }

  async login(email, password){
    const res = await baseService.post(
      this.API_LOGIN_URL, 
      `grant_type=password&username=${email}&password=${password}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    localStorage.setItem(this.LS_KEY, JSON.stringify(res.data));
    this.currentUserSubject.next(res.data);
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(this.LS_KEY);
    this.currentUserSubject.next(null);
  }

  isInternal(user){
    const checkUser = user || this.currentUserSubject.value;
    if(!checkUser) return false;
    const domain = checkUser.email.indexOf('@') > -1 ? checkUser.email.split('@')[1] : "";
    return  domain === "iconico.es"
  }

  get currentUserValue() { return this.currentUserSubject.value }

  get currentUser() { return this.currentUserSubject.asObservable()}
}

export default new AuthService();
