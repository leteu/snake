import { defineComponent, h, Transition } from 'vue';

export default defineComponent({
  emits: ['close'],
  setup(props, { slots, emit }) {
    return () => h(Transition,
      {
        name: 'modal',
        appear: true
      },
      () => h('div',
        {
          class: 'modal',
          onClick: () => emit('close')
        },
        slots
      )
    )
  }
});
