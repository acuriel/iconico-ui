import {baseService} from './AxiosApiService';


class AuthService {
  API_LOGIN_URL = "token";

  login(email, password){
    return baseService.post(
      this.API_LOGIN_URL,
      `grant_type=password&username=${email}&password=${password}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  }

}

export default new AuthService();
