import React from 'react';
import ConsultationStore from './ConsultationStore';
import UIStore from './UIStore';


class RootStoreClass {
  constructor() {
    this.consultationStore = new ConsultationStore(this);
    this.uiStore= new UIStore(this);
  }
}

export const RootStore =  new RootStoreClass();

const StoreContext = React.createContext(RootStore);

export default StoreContext;
