<template>
  <Modal @close="() => {$store.dispatch('RecordModalModule/hide');}">
    <template #default>
      <div class="card">
        <div class="card-section text-center flex items-center justify-between">
          <span class="width-24px"></span>
          <span>기록</span>
          <span class="material-icons button" @click="() => {$store.dispatch('RecordModalModule/hide')}">clear</span>
        </div>
        <div class="card-section scroll-y max-height-250px">
          <template v-for="(item, index) in recordJson" :key="`record-${index}`">
            <div class="flex items-center justify-between gutter-x-md">
              <span>{{index + 1}}</span>
              <span>{{item.name}}</span>
              <span>{{item.score}}</span>
              <span>{{unixToDateTime(item.timestamp)}}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Modal from 'src/components/Modal';
import recordJsonData from 'src/assets/scoreRecord.json';
import { RecordItem } from 'src/components/Snake/RecordClass';
import moment from 'moment';

export default defineComponent({
  components: {
    Modal
  },
  computed: {
    recordJson: function() {
      return recordJsonData.record as RecordItem[]
    }
  },
  methods: {
    unixToDateTime(time: number) {
      return moment.unix(time).format('YYYY/MM/DD HH:mm:ss')
    }
  }
})
</script>

<style lang="sass" scoped>
*
  font-family: '둥근모꼴'

</style>
