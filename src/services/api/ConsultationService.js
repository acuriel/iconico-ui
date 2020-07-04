import AxiosApiService, {baseService} from "./AxiosApiService";

class ConsultationService extends AxiosApiService{
  constructor(baseService) {
    super("api/consultas/", baseService);
  }

  getExternalConnections(id){
    return this.baseService.get(this._getUrl(id, "ExternalConnections"))
  }

  addExternalConnection(consultationId, externalId){
    return this.baseService.post(this._getUrl(consultationId, "ExternalConnections", externalId))
  }

  updateExternalConnectionStatus(consultationId, externalId, newStatus){
    return this.baseService.put(this._getUrl(consultationId, "ExternalConnections", externalId), null,
    {
      params:{
        newStatus,
      }
    })
  }

  getExternalConnectionConversation(consultationId, externalId, date){
    return this.baseService.get(
      this._getUrl(
        consultationId,
        "ExternalConnections",
        externalId,
        "Conversation"
      ),
      date ? { params: {
        fromDate: date
      }}: {}
    )
  }

  getConversation(id, date){
    return this.baseService.get(
      this._getUrl(id, "Conversation"),
      date ? { params: {
        fromDate: date
      }}: {})
  }

  addMessage(id, msg){
    return this.baseService.post(this._getUrl(id, "Conversation"), msg);
  }

  getHighlights(id){
    return this.baseService.get(this._getUrl(id, "Highlights"))
  }

  getTruth(id){
    return this.baseService.get(this._getUrl(id, "Truth"))
  }

  getMessage(consultationId, commentId){
    return this.baseService.get(this._getUrl(consultationId, "Conversation", commentId))
  }

  toggleHighlight(consultationId, commentId){
    console.log(consultationId)
    console.log(commentId)
    return this.baseService.put(this._getUrl(consultationId, "Conversation", commentId, "ToggleHighlight"))
  }

  getMembersStatuses(consultationId){
    return this.baseService.get(this._getUrl(consultationId, "Statuses"));
  }
  getMemberStatus(consultationId, userId){
    return this.baseService.get(this._getUrl(consultationId, "Statuses", userId));
  }
  updateMemberStatus(consultationId, statusCode){
    return this.baseService.put(this._getUrl(consultationId, "Statuses", "Update", statusCode));
  }

  terminate(id){
    return this.baseService.put(this._getUrl(id, "Terminate"))
  }
}

export default new ConsultationService(baseService);
