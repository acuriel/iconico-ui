class UserStatusMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      userId: data.author._id,
      consultationId: data._idConsulta,
      folderId: data.idFolderToBelong,
      status: data.status
    }
  }
  saveForRequest(data) {
    return {
      _id: data._id,
      _idConsulta: data.consultationId,
      idFolderToBelong: data.folderId,
      status: data.status
    }
  }

}

export default new UserStatusMigrator();
