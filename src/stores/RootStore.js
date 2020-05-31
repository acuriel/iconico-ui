import React from 'react';
import ConsultationListStore from './ConsultationListStore';
import UIStore from './UIStore';


class RootStoreClass {
  constructor() {
    this.consultationStore = new ConsultationListStore(this);
    this.uiStore= new UIStore(this);
  }
}

export const RootStore =  new RootStoreClass();

const StoreContext = React.createContext(RootStore);

export default StoreContext;
