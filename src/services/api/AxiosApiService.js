import axios from "axios";
import {history} from '../../App';


export const baseService = axios.create({baseURL: "https://localhost:44335/"})

baseService.interceptors.request.use(
  config => {
    const savedToken = localStorage.getItem('iconicoUser');
    if(savedToken){
      const token = JSON.parse(savedToken.toString())
      config.headers['Authorization'] = 'Bearer ' + token.access_token
    }
    else if(config.url !== "token") {
      Promise.reject({response:{status:401}});
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

baseService.interceptors.response.use(
  res => res,
  error => {
    console.log(error);
    if(error.response?.status === 401){
      history.push('/auth/login');
    }else{
      history.push('/auth/error');
    }
  }
)

export default class AxiosApiService {
  BASE_URL = "https://localhost:44335/";
  constructor(modelUrl, baseService) {
    this.modelUrl = this.BASE_URL + modelUrl;
    this.baseService = baseService;
  }

  _getUrl(...urls){
    var paths = []
    urls.forEach(url => {
      paths = paths.concat(url.toString().split('/'))
    });
    return this.modelUrl + paths.join('/');
  }

  getItem(id) {
    return this.baseService.get(this._getUrl(id))
  }
  getAll() {
    return this.baseService.get(this.modelUrl)
  }
  create(elem) {
    return this.baseService.post(this.modelUrl, elem);
  }
  update(id, elem) {
    return this.baseService.put(this._getUrl(id), elem)
  }
  remove(id) {
    return this.baseService.delete(this._getUrl(id))
  }
}
