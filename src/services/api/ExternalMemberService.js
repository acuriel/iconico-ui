import AxiosApiService, {baseService} from "./AxiosApiService";

class ExternalMemberService extends AxiosApiService{
  constructor(baseService) {
    super("api/ExternalMembers/", baseService);
  }
}

export default new ExternalMemberService(baseService);
