<template>
  <div class="expert-recruit">
    <div class="section-title">专家补录</div>

    <!-- 未到场专家提示 -->
    <div class="absent-experts" v-if="absentExperts.length === 0">
      <el-alert title="所有专家均已到场" type="success" :closable="false" show-icon>
      </el-alert>
    </div>
    <div class="absent-experts" v-else>
      <div class="sub-title">未到场专家</div>
      <el-tag v-for="expert in absentExperts" :key="expert.id" type="danger" effect="plain" class="expert-tag">
        {{ expert.name }}
      </el-tag>
    </div>

    <!-- 补录专家选择 -->
    <div class="recruit-section">
      <div class="sub-title">请选择补录专家</div>
      <el-select no-data-text="无补录专家" v-model="selectedExpert" filterable placeholder="请选择专家" class="expert-select">
        <el-option v-for="item in expertOptions" :key="item.id" :label="item.name" :value="item.id">
          <span>{{ item.name }}</span>
          <span class="expert-unit">{{ item.unit }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAddExpert" :disabled="!selectedExpert">
        添加补录专家
      </el-button>
    </div>

    <!-- 已补录专家列表 -->
    <div class="recruited-experts">
      <div class="sub-title">已补录专家</div>
      <el-table :data="recruitedExperts" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRemoveExpert(scope.$index)" style="color: #F56C6C">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部按钮 -->
    <div class="action-buttons">
      <el-button @click="handleBack">返回</el-button>
      <el-button type="primary" @click="handleComplete" :disabled="!canComplete">
        完成补录
      </el-button>
    </div>
  </div>
</template>

<script>
import { getExpertInfo, getExpertList } from '@/api/expert'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      absentExperts: [], // 未到场专家列表
      expertOptions: [], // 可选专家列表
      selectedExpert: '', // 当前选中的专家
      recruitedExperts: [] // 已补录的专家列表
    }
  },
  computed: {
    ...mapState('processStatus', ['processId']),
    canComplete() {
      return this.absentExperts.length === this.recruitedExperts.length
    }
  },
  methods: {
    async getAbsentExperts() {
      try {
        const res = await getExpertInfo(this.processId)
        this.absentExperts = res.data.filter(expert => expert.status === false)
      } catch (error) {
        this.$message.error('获取未到场专家失败')
      }
    },
    async getExpertOptions() {
      try {
        const res = await getExpertList()
        this.expertOptions = res.rows.filter(item => item.status === false)
      } catch (error) {
        this.$message.error('获取专家列表失败')
      }
    },
    handleAddExpert() {
      const expert = this.expertOptions.find(e => e.id === this.selectedExpert)
      if (expert) {
        this.recruitedExperts.push(expert)
        this.selectedExpert = ''
      }
    },
    handleRemoveExpert(index) {
      this.recruitedExperts.splice(index, 1)
    },
    handleBack() {
      this.$store.commit('processStatus/SET_PROCESS_STATUS', 1)
    },
    async handleComplete() {
      if (!this.canComplete) {
        this.$message.warning('请补录所有未到场专家')
        return
      }
      try {
        // TODO: 调用补录专家的接口
        // await updateRecruitedExperts(this.processId, this.recruitedExperts)
        this.$message.success('补录成功')
        this.$store.commit('processStatus/SET_PROCESS_STATUS', 3)
      } catch (error) {
        this.$message.error('补录失败')
      }
    }
  },
  created() {
    this.getAbsentExperts()
    this.getExpertOptions()
  }
}
</script>

<style lang="scss" scoped>
.expert-recruit {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  .sub-title {
    font-size: 16px;
    color: #606266;
    margin-bottom: 16px;
  }

  .absent-experts {
    margin-bottom: 30px;

    .expert-tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .recruit-section {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 16px;

    .expert-select {
      width: 300px;
    }
  }

  .recruited-experts {
    margin-bottom: 30px;

    .empty-text {
      color: #909399;
      text-align: center;
      padding: 30px 0;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
}

:deep(.el-select-dropdown__item) {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .expert-unit {
    color: #909399;
    font-size: 13px;
  }
}

:deep(.el-table) {
  th {
    background-color: #f5f7fa !important;
    color: #606266;
    font-weight: 500;
  }
}
</style>