<template>
  <div>
    <transition name="fade">
      <div class="section">
        <div class="section-title">项目基本信息</div>
        <el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="120px">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="projectForm.name" placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="评审时间" prop="reviewTime">
            <el-date-picker v-model="projectForm.reviewTime" type="datetime"   placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="专家抽取人数" prop="expertCount">
            <el-input-number v-model="projectForm.expertCount" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="专家类别" prop="expertType">
            <el-select v-model="projectForm.expertType" placeholder="请选择专家类别" multiple>
                <el-option :label="item.categoryName" :value="item.id" v-for="item in expertOptions" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="form-buttons">
              <el-button type="primary" @click="submitProjectForm" :loading="loading">
                <i class="el-icon-arrow-right"></i> 开始抽选
              </el-button>
              <el-button @click="resetForm" plain>重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
import { getExpertList,postProjectInfo } from '@/api/expert'

export default {
  data() {
    return {
      loading: false,
      projectForm: {
        name: '',
        reviewTime: '',
        expertCount: 5,
        expertType: []
      },
      expertOptions: [],
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        reviewTime: [{ required: true, message: '请选择评审时间', trigger: 'change' }],
        expertType: [{ required: true, message: '请选择专家类别', trigger: 'change' }]
      },
    };
  },
  methods: {
    async submitProjectForm() {
      this.$refs.projectForm.validate(async (valid) => {
        if (valid) {
          const res =await postProjectInfo(this.projectForm)
          this.$store.commit('processStatus/SET_PROCESS_STATUS', 1)
          this.$store.commit('processStatus/SET_PROCESS_ID', res.data.id)
        }
      })
    },
    resetForm() {
      this.$refs.projectForm.resetFields()
    }
  },
  created() {
    getExpertList().then(res => {
      this.expertOptions=res.rows
    })
  }
};
</script>

<style lang='scss' scoped>
.section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);

  .el-form {
    max-width: 800px;
  }
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #2c3e50;
  border-bottom: 2px solid #edeeee;
  padding-bottom: 15px;
  position: relative;


}





.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.form-buttons {
  margin-top: 40px;

  .el-button {
    margin: 0 10px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }
  }
}
</style>