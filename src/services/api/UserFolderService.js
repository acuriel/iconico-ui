import AxiosApiService, {baseService} from "./AxiosApiService";

class UserFolderService extends AxiosApiService{
  constructor(baseService) {
    super("api/UserFolders/", baseService);
  }
}

export default new UserFolderService(baseService);
