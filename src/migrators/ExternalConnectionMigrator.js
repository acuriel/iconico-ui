import UserMigrator from "./UserMigrator";

class ExternalConnectionMigrator{
  loadFromResponse(data) {
    return {
      id:data._id,
      consultationId:data._idConsulta,
      internalUser: UserMigrator.loadFromResponse(data.author),
      externalUser: UserMigrator.loadFromResponse(data.receiver),
      status: data.status,
    }
  }
  saveForRequest(data) {
    return {

    }
  }
}

export default new ExternalConnectionMigrator();
