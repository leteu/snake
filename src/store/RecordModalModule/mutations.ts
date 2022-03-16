import { MutationTree } from 'vuex';
import { RecordModalModuleStateInterface } from './state';

const mutation: MutationTree<RecordModalModuleStateInterface> = {
  setModalState(state, value) {
    state.modalState = value;
  }
};

export default mutation;