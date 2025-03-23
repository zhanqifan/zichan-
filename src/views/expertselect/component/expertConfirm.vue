<template>
  <div class="expert-confirm">
    <div class="expert-header">
      <div class="stat-item">
        <div class="number">{{ selectedCount }}</div>
        <div class="label">确认到场</div>
      </div>
      <div class="stat-item warning">
        <div class="number">{{ tableData.length - selectedCount }}</div>
        <div class="label">待补录</div>
      </div>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="judgeName" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="workLocation" label="单位" align="center">
      </el-table-column>
      <el-table-column prop="contactInformation" label="联系方式" align="center">
      </el-table-column>
      <el-table-column label="到场状态" align="center">
        <template slot-scope="scope">
          <div class="status-buttons">
            <el-tag  :type="scope.row.status === 1 ? 'success' :scope.row.status===0 ? 'primary' : 'danger'"
          >
              {{ scope.row.status === 1 ? '到场' : scope.row.status === 0 ? '待确认' : '补录' }}
            </el-tag>

          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text"     @click="handleConfirm(scope.row, 1)" >确认</el-button>
          <el-button type="text"     @click="handleConfirm(scope.row, 2)" >补录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-footer">
      <el-button @click="handleBack">返回</el-button>
      <el-button type="primary" @click="handleNext"  v-if="tableData.length - selectedCount==0" >下一步</el-button>
      <el-button type="primary" @click="handleRecord" v-else>开始补录</el-button>
    </div>
  </div>
</template>

<script>
import { getExpertInfo, updateExpertStatus,recordExpert } from '@/api/expert'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      totalCount: 5 // 总专家数，可以从store或接口获取
    };
  },
  computed: {
    ...mapState('processStatus', [
      'projectData',
      'projectId'
    ]),
    selectedCount() {
      return this.tableData.filter(item => item.status === 1).length
    },

  },
  methods: {
    // 获取列表
    async getExpertInfo() {
      if (!this.projectId) return;
      try {
        this.loading = true;
        const res = await getExpertInfo(this.projectId);
        this.tableData = res.data
      } catch (error) {
        this.$message.error('获取专家信息失败');
      } finally {
        this.loading = false;
      }
    },
    // 确认到场状态
    async handleConfirm(row, status) {
     row.status=status
      await updateExpertStatus({
        projectId: this.projectId,
        judgeId: row.id,
        state: status,
        remarks: row.remark
      })
    },

    async handleRecord(row) {
      // 存在待确认的专家不允许补录
      if(this.tableData.some(item=>item.status===0)){
        this.$message.warning('请先确认到场状态')
        return
      }
        const res =await recordExpert({
          id:  this.projectId,
            categorys: this.projectData.categorys,
            judgeNum:this.tableData.length - this.selectedCount
        })

        this.getExpertInfo()
    },
    handleBack() {
      this.$store.commit('processStatus/SET_PROCESS_STATUS', 0);
    },
    handleNext() {
      this.$store.commit('processStatus/SET_PROCESS_STATUS', 2);
    }
  },
  created() {
    if (this.processId) {
      this.getExpertInfo();
    }
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          console.log(newVal)
          this.getExpertInfo();
        }
      }
    },

  }
};
</script>

<style lang='scss' scoped>
.expert-confirm {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  .expert-header {
    display: flex;
    justify-content: flex-end;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px 24px;
    background: #f8f9fc;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .stat-item {
      text-align: center;

      .number {
        font-size: 24px;
        font-weight: 600;
        color: #409EFF;
        line-height: 1.4;
        margin-bottom: 4px;
      }

      .label {
        font-size: 14px;
        color: #606266;
      }

      &.warning {
        .number {
          color: #E6A23C;
        }
      }
    }
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

.status-button {
  cursor: pointer;
}

.status-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;

}

::v-deep .el-button--success.is-plain:hover {
  background-color: '';
}

.table-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

:deep(.el-input) {
  .el-input__inner {
    border-radius: 4px;

    &::placeholder {
      color: #c0c4cc;
    }
  }
}

:deep(.el-button--text) {
  padding: 0;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
}
</style>