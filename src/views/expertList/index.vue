<template>
  <div class="expert-list">
    <!-- 查询表单 -->

    <el-form :model="queryParams" size="small"  ref="queryForm" :inline="true" >
          <el-form-item label="专家姓名" prop="judgeName">
            <el-input
              v-model="queryParams.judgeName"
              placeholder="请输入专家姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工作单位" prop="workLocation">
            <el-input
              v-model="queryParams.workLocation"
              placeholder="请输入工作单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="联系方式" prop="contactInformation">
            <el-input
              v-model="queryParams.contactInformation"
              placeholder="请输入联系方式"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专业类别" prop="judgeCategory">
            <el-select
              v-model="queryParams.judgeCategory"
              placeholder="请选择专业类别"
              clearable
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
          <div class="search-buttons">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </div>
        </el-form-item>
      <el-row>

      </el-row>
    </el-form>

    <div class="action-buttons">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="success" plain icon="el-icon-upload2" size="mini" @click="handleImport">批量导入</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="judgeName" label="评审专家" />
      <el-table-column prop="workLocation" label="工作单位" />
      <el-table-column prop="contactInformation" label="联系方式" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增/修改弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="专家姓名" prop="judgeName">
          <el-input v-model="form.judgeName" placeholder="请输入专家姓名" />
        </el-form-item>
        <el-form-item label="工作单位" prop="workLocation">
          <el-input v-model="form.workLocation" placeholder="请输入工作单位" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInformation">
          <el-input v-model="form.contactInformation" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="专业类别" prop="judgeCategory">
          <el-select v-model="form.judgeCategory" placeholder="请选择专业类别" multiple style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="dialog.loading">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryParams.pageSize"
        :current-page="queryParams.pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getExpertInfoList, getExpertList, addExpert, updateExpert, deleteExpert, getExpertDetail } from '@/api/expert'
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      // 查询参数
      queryParams: {
        judgeName: '',
        workLocation: '',
        contactInformation: '',
        judgeCategory: '',
        pageNum: 1,
        pageSize: 10
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/judge_info/importData"
      },
      // 专业类别选项
      categoryOptions: [],
      // 弹窗属性
      dialog: {
        open: false,
        title: '',
        loading: false
      },
      // 表单参数
      form: {
        id: undefined,
        judgeName: '',
        workLocation: '',
        contactInformation: '',
        judgeCategory: ''
      },
      // 表单校验规则
      rules: {
        judgeName: [
          { required: true, message: '专家姓名不能为空', trigger: 'blur' }
        ],
        workLocation: [
          { required: true, message: '工作单位不能为空', trigger: 'blur' }
        ],
        contactInformation: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ],
        judgeCategory: [
          { required: true, message: '请选择专业类别', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    // 获取专家列表
    getExpertInfoList() {
      getExpertInfoList(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total
      })
    },
    // 搜索按钮点击事件
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getExpertInfoList()
    },
    // 重置按钮点击事件
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.queryParams.pageNum = 1
      this.handleQuery()
    },
    // 获取专业类别选项
    getCategoryOptions() {
      getExpertList({pageNum: 1, pageSize: 9999}).then(res => {
      this.categoryOptions = res.rows
    })
    },
    // 新增按钮
    handleAdd() {
      this.resetForm()
      this.dialog.open = true
      this.dialog.title = '新增专家'
    },
    // 修改按钮
    handleEdit(row) {
      this.resetForm()
      this.dialog.open = true
      this.dialog.title = '修改专家'
      this.dialog.loading = true

      // 获取专家详情进行回显
      getExpertDetail(row.id).then(res => {
        this.form = {
          id: res.data.id,
          judgeName: res.data.judgeName,
          workLocation: res.data.workLocation,
          contactInformation: res.data.contactInformation,
          judgeCategory: res.data.judgeCategoryList.map(item => item.id)
        }
        this.dialog.loading = false
      }).catch(() => {
        this.dialog.loading = false
      })
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('确认删除该专家吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteExpert(row.id)
      }).then(() => {
        this.$message.success('删除成功')
        this.getExpertInfoList()
      }).catch(() => {})
    },
    // 表单重置
    resetForm() {
      this.form = {
        id: undefined,
        judgeName: '',
        workLocation: '',
        contactInformation: '',
        judgeCategory: ''
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    // 取消按钮
    cancelForm() {
      this.dialog.open = false
      this.resetForm()
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialog.loading = true

          // 根据id判断是新增还是修改
          const request = this.form.id ? updateExpert({...this.form, judgeCategory: `[${this.form.judgeCategory}]`}) : addExpert({...this.form, judgeCategory: `[${this.form.judgeCategory}]`})

          request.then(() => {
            this.$message.success(this.form.id ? '修改成功' : '新增成功')
            this.dialog.open = false
            this.getExpertInfoList()
          }).finally(() => {
            this.dialog.loading = false
          })
        }
      })
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getExpertInfoList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getExpertInfoList()
    },
    // 导入专家
   handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
 /** 下载模板操作 */
 importTemplate() {
      this.download('system/judge_info/importTemplate', {
      }, `expert_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
     // 文件上传成功处理
     handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getExpertInfoList();
    },
    submitFileForm() {
      this.$refs.upload.submit();
    }
  },
  created() {
    this.getExpertInfoList()
    this.getCategoryOptions()
  }
};
</script>

<style lang='scss' scoped>
.expert-list {
  padding: 20px;
  background: #fff;
  border-radius: 4px;


  .search-buttons {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-top: 2px;

  }

  .action-buttons {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .el-button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .delete-btn {
    color: #F56C6C;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>