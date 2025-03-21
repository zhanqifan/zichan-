<template>
  <div class="archive-print">
    <div class="info-section">
      <div class="section-title">结果预览与存档</div>

      <!-- 项目基本信息 -->
      <div class="info-group">
        <div class="info-item">
          <span class="label">项目名称</span>
          <span class="value">{{ projectInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">评审时间</span>
          <span class="value">{{ projectInfo.reviewTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">专家类别</span>
          <span class="value">{{ projectInfo.expertType }}</span>
        </div>
        <div class="info-item">
          <span class="label">总人数</span>
          <span class="value">{{ projectInfo.totalCount }}</span>
        </div>
      </div>

      <!-- 专家名单表格 -->
      <div class="expert-list">
        <div class="sub-title">出席专家名单</div>
        <el-table
          :data="expertList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center">
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部按钮 -->
      <div class="action-buttons">
        <el-button @click="handleBack">返回</el-button>
        <div class="right-buttons">
          <el-button type="default" @click="handleSave">存为档</el-button>
          <el-button type="primary" @click="handlePrint">合并打印</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExpertInfo } from '@/api/expert'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      projectInfo: {
        name: '',
        reviewTime: '',
        expertType: '',
        totalCount: 0
      },
      expertList: []
    }
  },
  computed: {
    ...mapState('processStatus', ['processId'])
  },
  methods: {
    async getProjectData() {
      if (!this.processId) return
      try {
        // 获取项目信息
        const res = await getExpertInfo(this.processId)
        this.expertList = res.data.filter(expert => expert.status === true)
        // TODO: 获取项目基本信息的接口
        // const projectRes = await getProjectInfo(this.processId)
        // this.projectInfo = projectRes.data
      } catch (error) {
        this.$message.error('获取数据失败')
      }
    },
    handleBack() {
      this.$store.commit('processStatus/SET_PROCESS_STATUS', 2)
    },
    handleSave() {
      // TODO: 实现存档功能
      this.$message.success('存档成功')
    },
    handlePrint() {
      // TODO: 实现打印功能
      window.print()
    }
  },
  created() {
    this.getProjectData()
  }
}
</script>

<style lang="scss" scoped>
.archive-print {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 200px);

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
  }

  .info-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 30px;

    .info-item {
      display: flex;
      align-items: center;

      .label {
        width: 100px;
        color: #606266;
        font-size: 14px;
      }

      .value {
        flex: 1;
        color: #303133;
        font-size: 14px;
      }
    }
  }

  .expert-list {
    margin-top: 30px;

    .sub-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }

  .action-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right-buttons {
      display: flex;
      gap: 12px;
    }
  }
}

// 打印样式
@media print {
  .action-buttons {
    display: none !important;
  }
}

:deep(.el-table) {
  th {
    background-color: #f5f7fa !important;
    color: #606266;
    font-weight: 500;
  }

  td {
    padding: 12px 0;
  }
}
</style>
