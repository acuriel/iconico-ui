class UserMigrator{
  loadFromResponse(data) {
    return {
      id: data._id,
      userName: data.UserName,
      email: data.UserEmail,
      isInternal: data.UserName.endsWith("iconico.es")
    }
  }
  saveForRequest(data) {
    return {
      _id: data.id,
      UserName: data.userName,
      UserEmail: data.email
    }
  }

  loadFromToken(data){
    var parsedUser = null;
    try{
      parsedUser = JSON.parse(data);
    }
    catch(e){
      return null;
    }
    return {
      id:'',
      userName: parsedUser.userName,
      email: parsedUser.userName,
      token: parsedUser.access_token,
      isInternal: parsedUser.userName.endsWith("iconico.es")
    }
  }
}

export default new UserMigrator();
