import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RecordModalModuleStateInterface } from './state';

const getters: GetterTree<RecordModalModuleStateInterface, StateInterface> = {
  getModalState(state) {
    return state.modalState;
  }
};

export default getters;