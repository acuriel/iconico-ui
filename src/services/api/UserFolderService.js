import AxiosApiService, {baseService} from "./AxiosApiService";

class UserFolderService extends AxiosApiService{
  constructor(baseService) {
    super("api/UserFolders/", baseService);
  }

  getConsultations(elem){
    return this.baseService.get(this._getUrl(elem.id, "Consultas"))
  }
}

export default new UserFolderService(baseService);
