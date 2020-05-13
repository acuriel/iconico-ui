import UserMigrator from './UserMigrator';

class ConsultationMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      title: data.Tittle,
      description:data.Description,
      author: UserMigrator.loadFromResponse(data.Author),
      internalMembers:data.InternalMembers.map(m => UserMigrator.loadFromResponse(m)),
      issuedOn: new Date(data.IssuedOn),
      expiresOn: new Date(data.ExpiresOn),
      finished:data.IsManuallyFinished,
      finishedOn: new Date(data.ManuallyFinishedOn),
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      Tittle: data.title,
      Description:data.description,
      Author: data.author ? UserMigrator.saveForRequest(data.author) : undefined,
      InternalMembers:data.internalMembers.map(m => UserMigrator.saveForRequest(m)),
      IssuedOn:data.issuedOn,
      ExpiresOn:data.expiresOn,
      IsManuallyFinished:data.finished,
      ManuallyFinishedOn:data.finishedOn,
    }
  }
}

export default new ConsultationMigrator();
