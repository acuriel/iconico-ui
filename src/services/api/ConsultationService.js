import AxiosApiService, {baseService} from "./AxiosApiService";

class ConsultationService extends AxiosApiService{
  constructor(baseService) {
    super("api/consultas/", baseService);
  }

  getExternalConnections(elem){
    return this.baseService.get(this._getUrl(elem.id, "ExternalConnections"))
  }
}

export default new ConsultationService(baseService);
