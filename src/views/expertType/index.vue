<template>
  <div class="expert-type">
    <div class="table-header">

      <el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="handleAdd">
        <i class="el-icon-plus "></i> 新增类别
      </el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号"  align="center" />
      <el-table-column prop="categoryName" label="类别名称" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center"  />
      <el-table-column prop="createBy" label="创建人" align="center"  />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="delete-btn"
            @click="handleDelete(scope.row)"
          >
            <i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
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
import { getExpertList, addExpertType,deleteExpertType } from '@/api/expert'
export default {
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      dialogVisible: false,
      dialogTitle: '新增专家类别',
      form: {
        categoryName: '',
        parentId: null
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        categoryName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取表格数据
    async getList() {
      this.loading = true
      try {
        // 这里替换为实际的API调用
        const res = await getExpertList(this.queryParams)
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
    // 新增按钮点击
    handleAdd() {
      this.dialogTitle = '新增专家类别'
      this.form = {
        categoryName: '',
        parentId: 0
      }
      this.dialogVisible = true
    },
    // 删除按钮点击
    handleDelete(row) {
      this.$confirm('确认删除该专家类别吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          // 这里替换为实际的删除API调用
          await deleteExpertType(row.id)
            this.$message.success('删除成功')
            this.getList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
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
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

.expert-type {
  padding: 20px;
  min-height: calc(100vh - 80px);
}


</style>