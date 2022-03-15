<template>
  <Snake />
  <span class="press-start-2p dung-geun-mo dos-gothic">&nbsp;</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Snake from './components/Snake'

export default defineComponent({
  components: {
    Snake
  },
  setup() {
    
  },
})
</script>

<style lang="sass">
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

  #app
    overflow: hidden
</style>
