<template>
  <div class="expert-confirm">
    <div class="expert-header">
      已选择 {{ selectedCount }} / {{ totalCount }} 名专家
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="judgeName"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="workLocation"
        label="单位"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactInformation"
        label="联系方式"
        align="center">
      </el-table-column>
      <el-table-column
        label="到场状态"
        align="center">
        <template slot-scope="scope">
          <div class="status-buttons">
            <el-tag
              class="status-button"
              :type="scope.row.status === 1 ? 'success' : 'info'"
              @click="handleConfirm(scope.row,1)"
              >
             到场
            </el-tag>
            <el-tag
              class="status-button"
              :type="scope.row.status === 0 ? 'danger' : 'info'"
               @click="handleConfirm(scope.row,0)"
              >
               补录
            </el-tag>

          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"></el-input>
        </template>
      </el-table-column>


    </el-table>

    <div class="table-footer">
      <el-button @click="handleBack">返回</el-button>
      <el-button type="primary" @click="handleNext">下一步</el-button>
    </div>
  </div>
</template>

<script>
import modal from '@/plugins/modal'
import { getExpertInfo,updateExpertStatus } from '@/api/expert'
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
    ...mapState('processStatus', ['processId']),

    selectedCount() {
      return this.tableData.filter(item => item.status===true).length===this.totalCount?'确认':'点击补录'
    }
  },
  methods: {
    async getExpertInfo() {
      if (!this.processId) return;
      try {
        this.loading = true;
        const res = await getExpertInfo(this.processId);
        this.tableData = res.data.map(item => ({
          ...item,
          attendance: ''
        }));
      } catch (error) {
        this.$message.error('获取专家信息失败');
      } finally {
        this.loading = false;
      }
    },
     async handleConfirm(row, status) {
       row.status = status;
       const res =await updateExpertStatus({
        project_id:this.processId,
        judge_id:row.id,
        state:status,
        remark:row.remark
       })

    },

    handleViewDetail(row) {
      // 实现查看详情逻辑
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
    processId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getExpertInfo();
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.expert-confirm {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  .expert-header {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
    text-align: right;
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