import { defineComponent, h, Transition } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  emits: ['close'],
  setup(props, { slots, emit }) {
    const $store = useStore();

    return () => h(Transition,
      {
        name: 'modal',
        appear: true
      },
      () => h('div',
        {
          class: 'modal',
          onClick: () => $store.dispatch('RecordModalModule/hide')
        },
        slots
      )
    )
  }
});
