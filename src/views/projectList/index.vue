<template>
  <div class="expert-type">

    <div class="table-header">
      <el-form :model="queryParams" inline label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" style="width: 200px;" />
        </el-form-item>
        <el-form-item >
          <el-button icon="el-icon-search" type="primary"  @click="getList">搜索</el-button>
          <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号"  align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="categorys" label="专家类别" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ categorysFn(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="judgeNum" label="抽取人数" align="center" />
      <el-table-column prop="reviewTime" label="评审时间" align="center"  />
      <el-table-column prop="createTime" label="创建时间" align="center"  />
      <el-table-column prop="createBy" label="创建人" align="center"  />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleDetail(scope.row)"
          >
            <i class="el-icon-view"></i> 查看
          </el-button>
          <!-- <el-button
            type="text"
            class="delete-btn"
            @click="handleDelete(scope.row)"
          >
            <i class="el-icon-delete"></i> 删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 项目详情弹窗 -->
    <el-dialog
      title="项目详情"
      :visible.sync="detailDialogVisible"
      width="800px"
      :close-on-click-modal="false"
      class="detail-dialog"
    >
      <div v-loading="detailLoading" class="detail-content">
        <!-- 项目基本信息 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-info"></i> 项目基本信息
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">项目名称：</span>
              <span class="value">{{ projectDetail.projectName }}</span>
            </div>
            <div class="info-item">
              <span class="label">评审时间：</span>
              <span class="value">{{ projectDetail.reviewTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">专家人数：</span>
              <span class="value">{{ projectDetail.judgeNum }}人</span>
            </div>
            <div class="info-item">
              <span class="label">专家类别：</span>
              <span class="value">{{ projectCategorys }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ projectDetail.createTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建人：</span>
              <span class="value">{{ projectDetail.createBy }}</span>
            </div>
          </div>
        </div>

        <!-- 专家列表 -->
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-user"></i> 专家名单列表
          </div>
          <el-table
            :data="projectDetail.judgeList || []"
            style="width: 100%"
            size="small"
            class="detail-table"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="judgeName" label="专家姓名" align="center" />
            <el-table-column prop="workLocation" label="工作单位" align="center" />
            <el-table-column prop="contactInformation" label="联系方式" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" width="180" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="类别名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入类别名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList, getExpertList, getProjectDetail } from '@/api/expert'
export default {
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      dialogVisible: false,
      expertOptions: [],
      dialogTitle: '新增专家类别',
      form: {
        categoryName: '',
        parentId: null
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: ''
      },
      rules: {
        categoryName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      },
      // 详情弹窗相关数据
      detailDialogVisible: false,
      detailLoading: false,
      projectDetail: {},
    }
  },
  computed: {
    // 计算专家类别显示
    projectCategorys() {
      if (!this.projectDetail.categorys) return ''
      try {
        const categories = JSON.parse(this.projectDetail.categorys || '[]')
        return categories.map(id => {
          const category = this.expertOptions.find(item => item.id === id)
          return category ? category.categoryName : ''
        }).filter(Boolean).join('、')
      } catch (error) {
        return ''
      }
    }
  },
  methods: {
    // 获取表格数据
    async getList() {
      this.loading = true
      try {
        const res = await getProjectList(this.queryParams)
        if (res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
        }
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },
    categorysFn(row) {
      try {
        const categories = JSON.parse(row.categorys || '[]')
        return categories.map(item => {
          const category = this.expertOptions.find(option => option.id === item)
          return category ? category.categoryName : ''
        }).filter(Boolean).join('、')
      } catch (error) {
        return ''
      }
    },
    // 查看详情
    async handleDetail(row) {
      this.detailDialogVisible = true
      this.detailLoading = true
      this.projectDetail = {}

      try {
        const res = await getProjectDetail(row.id)
        if (res.code === 200) {
          this.projectDetail = res.data
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      } finally {
        this.detailLoading = false
      }
    },
    // 删除项目
    // handleDelete(row) {
    //   this.$confirm('确认删除该项目吗？操作后不可恢复！', '警告', {
    //     type: 'warning',
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(() => {

    //     this.$message.success('删除成功')
    //     this.getList()
    //   }).catch(() => {})
    // },
    // 打印项目详情

    // 重置查询
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        projectName: ''
      }
      this.getList()
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            // 这里替换为实际的提交API调用
            const res = await addExpertType(this.form)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.dialogVisible = false
              this.getList()
            }
          } catch (error) {
            this.$message.error('添加失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    }
  },
  created() {
    getExpertList({pageNum: 1, pageSize: 9999}).then(res => {
      this.expertOptions = res.rows
    })
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.expert-type {
  padding: 20px;
  min-height: calc(100vh - 80px);
  background: #fff;
  border-radius: 8px;
}

.table-header {
  margin-bottom: 20px;
}

.delete-btn {
  color: #F56C6C;
}

/* 详情弹窗样式 */
.detail-content {
  padding: 10px;
}

.detail-section {
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 16px;
    font-weight: 500;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    color: #303133;

    i {
      margin-right: 5px;
      color: #409EFF;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 20px;

  .info-item {
    display: flex;
    align-items: center;

    .label {
      width: 80px;
      color: #606266;
      font-weight: 500;
    }

    .value {
      flex: 1;
      color: #303133;
    }
  }
}

.detail-table {

  ::v-deep .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
  }
}

/* 弹窗样式优化 */
:deep(.detail-dialog) {
  .el-dialog__body {
    padding: 20px 20px 0;
  }

  .el-dialog__header {
    background-color: #f5f7fa;
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__title {
    font-weight: 500;
    font-size: 16px;
  }

  .el-dialog__headerbtn {
    top: 15px;
  }
}
</style>
