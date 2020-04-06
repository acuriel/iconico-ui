import { BehaviorSubject } from 'rxjs';
import baseService from './base.service';


const API_LOGIN_URL = "token";
const LS_KEY = 'iconicoUser'


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(LS_KEY)));


export const authService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

async function login(username, password) {
  const res = await baseService.post(
    API_LOGIN_URL, 
    `grant_type=password&username=${username}&password=${password}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
  localStorage.setItem(LS_KEY, JSON.stringify(res.data));
  currentUserSubject.next(res.data);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(LS_KEY);
    currentUserSubject.next(null);
}
