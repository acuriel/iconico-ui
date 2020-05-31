import AxiosApiService, {baseService} from "./AxiosApiService";

class ConsultationService extends AxiosApiService{
  constructor(baseService) {
    super("api/consultas/", baseService);
  }

  getExternalConnections(id){
    return this.baseService.get(this._getUrl(id, "ExternalConnections"))
  }

  getConversation(id){
    return this.baseService.get(this._getUrl(id, "Conversation"))
  }

  addMessage(id, msg){
    console.log(id);
    console.log(msg);
    return this.baseService.post(this._getUrl(id, "Conversation"), msg);
  }

  getHighlights(id){
    return this.baseService.get(this._getUrl(id, "Highlights"))
  }

  getMessage(consultationId, commentId){
    return this.baseService.get(this._getUrl(consultationId, "Conversation", commentId))
  }

  toggleHighlight(consultationId, commentId){
    return this.baseService.put(this._getUrl(consultationId, "Conversation", commentId, "ToggleHighlight"))
  }

  terminate(id){
    return this.baseService.put(this._getUrl(id, "Terminate"))
  }
}

export default new ConsultationService(baseService);
