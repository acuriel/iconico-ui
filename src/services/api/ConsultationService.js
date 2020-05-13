import AxiosApiService, {baseService} from "./AxiosApiService";

class ConsultationService extends AxiosApiService{
  constructor(baseService) {
    super("api/consultas/", baseService);
  }
}

export default new ConsultationService(baseService);
