import { InjectionKey } from 'vue'
import {
  createStore,
  Store as VuexStore,
  StoreOptions,
  useStore as vuexUseStore,
} from 'vuex'
import RecordModalModule, { RecordModalModuleStateInterface } from './RecordModalModule'

export interface StateInterface {
  RecordModalModule: StoreOptions<RecordModalModuleStateInterface>;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key')

export default createStore<StateInterface>({
  modules: {
    RecordModalModule
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
});

export function useStore() {
  return vuexUseStore(storeKey)
}