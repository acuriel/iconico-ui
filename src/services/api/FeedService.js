import AxiosApiService, {baseService} from "./AxiosApiService";

class FeedService extends AxiosApiService{
  constructor(baseService) {
    super("api/Comunicados/", baseService);
  }
}

export default new FeedService(baseService);
