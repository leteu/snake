<template>
  <Snake />
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
</style>
