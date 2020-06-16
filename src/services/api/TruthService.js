import AxiosApiService, {baseService} from "./AxiosApiService";

class TruthService extends AxiosApiService{
  constructor(baseService) {
    super("api/Verdades/", baseService);
  }
}

export default new TruthService(baseService);
