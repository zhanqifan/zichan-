const state = {
  processStatus: [
    {
      name: '填写项目信息',
    },
    {
      name: '专家确认',
    },

    {
      name: '存档与打印',
    },
  ],
  processStatusIndex: 0,//当前步骤
  projectData:{},//项目信息
  projectId:'',//项目id
  projectOptions:[]//项目选项
}
const mutations = {
  // 存储当前步骤
  SET_PROCESS_STATUS: (state, value) => {
    state.processStatusIndex = value
  },
  // 存储项目信息
  SET_PROJECT_DATA: (state, value) => {
    state.projectData = value
    state.projectId = value.id
  },
  // 存储项目选项
  SET_PROJECT_OPTIONS: (state, value) => {
    state.projectOptions = value
  },
  // 重置
  RESET_PROCESS: (state) => {
    state.processStatusIndex = 0
    state.prjectData = {}
  }
}



export default {
  namespaced: true,
  state,
  mutations,

}

