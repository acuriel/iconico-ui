import React from 'react';
import ConsultationStore from './ConsultationStore';


export const RootStore = {
  consultationStore: new ConsultationStore(this),
};

const StoreContext = React.createContext(RootStore);

export default StoreContext;
