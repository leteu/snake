import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { RecordModalModuleStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const StoreModule: Module<RecordModalModuleStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export {
  RecordModalModuleStateInterface
}
export default StoreModule;