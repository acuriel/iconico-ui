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
    const paths = []
    urls.forEach(url => {
      console.log(url.split('/'));
      paths.concat(url.split('/'))
    });
    return this.modelUrl + paths.join('/');
  }

  getItem(id) {
    return this.baseService.get(this._getUrl(this.modelUrl, id))
  }
  getAll() {
    console.log(this.modelUrl);
    return this.baseService.get(this.modelUrl)
  }
  create(elem) {
    return this.baseService.post(this.modelUrl, elem);
  }
  update(elem) {
    return this.baseService.put(this._getUrl(this.modelUrl, elem.id), elem)
  }
  remove(id) {
    return this.baseService.delete(this._getUrl(this.modelUrl, id))
  }
}
