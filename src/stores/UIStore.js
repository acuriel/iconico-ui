import {observable, action, decorate} from 'mobx';
import BaseStore from './BaseStore';

export default class UIStore extends BaseStore{
  loadingState = false;
  sweetAlertState = null;

  setLoading(value=true){
    this.loadingState = value;
  }
}

decorate(UIStore, {
  loadingState: observable,
  sweetAlertState: observable,
  setLoading: action,
})
