import AxiosApiService, {baseService} from "./AxiosApiService";

class FileService extends AxiosApiService{
  constructor(baseService) {
    super("api/ImageTemp/", baseService);
  }

  uploadImage = file => {
    const data = new FormData();
    data.append("image", file);
    return this.baseService.post(this.modelUrl, data);
  };
}

export default new FileService(baseService);
