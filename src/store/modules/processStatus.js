const state = {
  processStatus: [
    {
      name: '填写项目信息',
    },
    {
      name: '专家确认',
    },
    {
      name: '专家补录',
    },
    {
      name: '存档与打印',
    },
  ],
  processId: "1902932148034379776",
  processStatusIndex: 1
}
const mutations = {
  SET_PROCESS_STATUS: (state, value) => {
    state.processStatusIndex = value
  },
  SET_PROCESS_ID: (state, value) => {
    state.processId = value
  },
  RESET_PROCESS: (state) => {
    state.processStatusIndex = 0
    state.processId = ''
  }
}



export default {
  namespaced: true,
  state,
  mutations,

}

