import AxiosApiService, {baseService} from "./AxiosApiService";

class InternalMemberService extends AxiosApiService{
  constructor(baseService) {
    super("api/internalMembers/", baseService);
  }
}

export default new InternalMemberService(baseService);
