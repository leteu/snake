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
  @import url('app/public/font/PressStart2P-Regular.ttf');
</style>
