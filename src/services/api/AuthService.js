import {baseService} from './AxiosApiService';

class AuthService {
  API_LOGIN_URL = "token";

  login(email, password){

    return baseService.post(
      this.API_LOGIN_URL,
      {
        username: email,
        password: password
      }
    );
  }

}

export default new AuthService();
