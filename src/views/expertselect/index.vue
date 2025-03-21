<template>
  <div class="expert-select-container">
    <el-steps :active="processStatusIndex" finish-status="success" style="margin-bottom: 30px;">
      <el-step :title="item.name" v-for="(item, index) in processStatus" :key="index"></el-step>
    </el-steps>
    <div class="section" v-show="processStatusIndex === 0">
      <processStatus></processStatus>
    </div>
    <div class="section" v-if="processStatusIndex === 1">
      <expertConfirm></expertConfirm>
    </div>
    <div class="section" v-if="processStatusIndex === 2">
      <expertRecruit></expertRecruit>
    </div>
    <div class="section" v-if="processStatusIndex === 3">
      <expertResult></expertResult>
    </div>
  </div>
</template>

<script>
import processStatus from './component/projectMsg.vue'
import expertConfirm from './component/expertConfirm.vue'
import expertRecruit from './component/expertRecruit.vue'
import expertResult from './component/archiveAndPrint.vue'
import { mapState } from 'vuex'
export default {
  components: {
    processStatus,
    expertConfirm,
    expertRecruit,
    expertResult
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('processStatus', ['processStatus', 'processStatusIndex'])
  },
  methods: {
  },
  destroyed() {
    this.$store.commit('processStatus/SET_PROCESS_STATUS', 0)
  }
};
</script>

<style lang='scss' scoped>
.expert-select-container {
  padding: 40px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 80px);

  // 优化步骤条样式
  .el-steps {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }
}
</style>