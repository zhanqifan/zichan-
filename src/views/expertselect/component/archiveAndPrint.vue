<template>
  <div class="archive-print">
    <div class="info-section">
      <div class="section-title">结果预览与存档</div>

      <!-- 项目基本信息 -->
      <div class="info-group">
        <div class="info-item">
          <span class="label">项目名称：</span>
          <span class="value">{{ projectData.projectName }}</span>
        </div>
        <div class="info-item">
          <span class="label">评审时间：</span>
          <span class="value">{{ projectData.reviewTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">专家类别：</span>
          <span class="value">{{ expertOptions }}</span>
        </div>
        <div class="info-item">
          <span class="label">总人数：</span>
          <span class="value">{{ projectData.judgeNum }}人</span>
        </div>
      </div>

      <!-- 专家名单表格 -->
      <div class="expert-list">
        <div class="sub-title">出席专家名单</div>
        <el-table
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

        </el-table>
      </div>

      <!-- 底部按钮 -->
      <div class="action-buttons">
        <el-button @click="handleBack">返回</el-button>
        <div class="right-buttons">
          <el-button @click="handlePreview">预览</el-button>

          <el-button type="primary" @click="handleDownload">下载确认单</el-button>
        </div>
      </div>

    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%">
        <DocxPreview :fileUrl="fileUrl"  />
      </el-dialog>
  </div>
</template>

<script>
import { getExpertInfo, printConfirm } from '@/api/expert'
import { mapState } from 'vuex'
import DocxPreview from '@/components/vueoffice/index.vue'
export default {
  components: {
    DocxPreview
  },

  data() {
    return {
      docx :null,
      previewLoading:false,
      projectInfo: {
        name: '',
        reviewTime: '',
        expertType: '',
        totalCount: 0
      },
      dialogVisible: false,
      tableData: [],
      fileUrl: ''
    }
  },
  computed: {
    ...mapState('processStatus', ['projectData', 'projectId', 'projectOptions']),
    expertOptions() {
      return JSON.parse(this.projectData.categorys).map(item => this.projectOptions.find(option => option.id === item).categoryName).join('、');

    }
  },

  methods: {
    async getProjectData() {
      if (!this.projectId) return
      try {
        // 获取项目信息
        const res = await getExpertInfo(this.projectId);
        console.log(res)
        this.tableData = res.data
      } catch (error) {
        this.$message.error('获取数据失败')
      }
    },

    handleBack() {
      this.$store.commit('processStatus/SET_PROCESS_STATUS', 1)
    },
    // async printWord() {

    //   // const res = await printConfirm(this.projectId)
    //   // const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //   // const url = URL.createObjectURL(blob);
    //   // if (!url) {
    //   //   this.$message.warning('请先加载文档');
    //   //   return;
    //   // }
    //   printJS({
    //     printable: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pdf',
    //     type: 'pdf', // 尝试以PDF方式打印
    //     showModal: true,
    //     modalMessage: '准备打印...',
    //     onLoadingEnd: () => {
    //       console.log('打印完成');
    //     }
    //   });
    // },
    // async handlePrint() {
    //   // TODO: 实现打印功能
    //   const res = await printConfirm(this.projectId)
    //   const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //   const url = URL.createObjectURL(blob);

    //   this.fileUrl = url
    //   console.log(this.fileUrl)
    //   this.dialogVisible = true
    // },
    async handlePreview(){
  const res = await printConfirm(this.projectId)
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      if (!url) {
        this.$message.warning('请先加载文档');
        return;
      }
      this.fileUrl = url
      this.dialogVisible = true
    },
    // 下载
    async handleDownload() {
      const res = await printConfirm(this.projectId)
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a')
      a.href = url
      a.download = '确认单.docx'
      a.click()
    }
  },

   watch: {
    projectId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          console.log(newVal)
          this.getProjectData();
        }
      }
    },

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
        max-width: 80px;
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


</style>
