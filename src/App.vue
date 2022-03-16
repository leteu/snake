<template>
  <Snake />
  <span class="press-start-2p dung-geun-mo dos-gothic">&nbsp;</span>

  <RecordListVue @close.stop.prevent="() => {  }" v-show="record" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex';
import Snake from './components/Snake'
import RecordListVue from './components/Snake/RecordList.vue'

export default defineComponent({
  components: {
    Snake,
    RecordListVue
  },
  computed: {
    record: function() {
      return this.$store.getters['RecordModalModule/getModalState'];
    }
  }
})
</script>

<style lang="sass">
  @import 'src/components/Modal/Modal.sass'
  @import 'src/style/app.sass'
  @import 'src/style/app.css'
  @import 'src/style/font.sass'

  @font-face
    font-family: 'Press Start 2P'
    src: url('font/PressStart2P-Regular.ttf') format('truetype')

  @font-face
    font-family: '둥근모꼴'
    src: url('font/DungGeunMo.ttf') format('truetype')

  @font-face
    font-family: 'DOSGothic'
    src: url('font/DOSGothic.ttf') format('truetype')

  .press-start-2p
    font-family: 'Press Start 2P'
  .dung-geun-mo
    font-family: '둥근모꼴'
  .dos-gothic
    font-family: 'DOSGothic'

  body
    margin: 0
    height: 100%
    overflow: hidden

  #app
    height: inherit
    overflow: hidden
</style>
