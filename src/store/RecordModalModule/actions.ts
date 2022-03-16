import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { RecordModalModuleStateInterface } from './state';

const actions: ActionTree<RecordModalModuleStateInterface, StateInterface> = {
  show(context) {
    context.commit('setModalState', true);
  },

  hide(context) {
    context.commit('setModalState', false);
  }
};

export default actions;
