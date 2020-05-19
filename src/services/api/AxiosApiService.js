import axios from "axios";


export const baseService = axios.create({baseURL: "https://localhost:44335/"})

baseService.interceptors.request.use(
  config => {
    const savedToken = localStorage.getItem('iconicoUser');
    if(savedToken){
      const token = JSON.parse(savedToken.toString())
      config.headers['Authorization'] = 'Bearer ' + token.access_token
    }
    else {
      Promise.reject({response:{status:401}});
    }
    return config;
  },
  error => Promise.reject(error)
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
      paths = paths.concat(url.split('/'))
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
  update(elem) {
    return this.baseService.put(this._getUrl(elem.id), elem)
  }
  remove(id) {
    return this.baseService.delete(this._getUrl(id))
  }
}
