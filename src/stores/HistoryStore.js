import {observable, action, runInAction, decorate} from 'mobx';
import TruthService from '../services/api/TruthService';
import BaseStore from './BaseStore';
import Truth from './Truth';
import TruthMigrator from 'migrators/TruthMigrator';

export default class HistoryStore extends BaseStore{
  truthes = [];
  allTags = []

  constructor(rootStore){
    super(rootStore);
    this.getAllTruths();
  }

  getAllTruths = async () => {
    try {
      const res = await TruthService.getAll();
      runInAction(() => {
        this.truthes.replace(res.data.map(t => {
          const truth = TruthMigrator.loadFromResponse(t);
          this.allTags.push(...truth.tags.filter(truthTag => this.allTags.indexOf(truthTag) < 0))
          return new Truth(undefined, truth, this.rootStore);
        }));
      });
    } catch (error) {
      console.log(error);
    }
  }


}

decorate(HistoryStore, {
  truthes: observable,
  allTags: observable,
  getAllTruths: action,
})
