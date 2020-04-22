import { BehaviorSubject } from 'rxjs';
import baseService from './base.service';


const API_LOGIN_URL = "token";
const LS_KEY = 'iconicoUser'


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(LS_KEY)));


export const authService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    isInternal
};

async function login(email, password) {
  const res = await baseService.post(
    API_LOGIN_URL, 
    `grant_type=password&username=${email}&password=${password}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
  localStorage.setItem(LS_KEY, JSON.stringify(res.data));
  currentUserSubject.next(res.data);
}

function isInternal(user=undefined){
  user = user || currentUserSubject.value;
  const mail = user.hasOwnProperty('userName') ? user.userName : user.UserEmail
  const domain = mail.indexOf('@') > -1 ? mail.split('@')[1] : "";
  return  domain === "iconico.es"
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(LS_KEY);
    currentUserSubject.next(null);
}
