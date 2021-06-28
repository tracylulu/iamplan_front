const KeepAliveMag = {
  state: {
    includeList: [], // keep-alive的include属性的值
  },

  mutations: {
    addIncludeItem(state, pathName) {
      state.includeList.indexOf(pathName) < 0 && state.includeList.push(pathName)
    },

    removeIncludeItem(state, pathName) {
      let curIndex;
      state.includeList.forEach((item, index) => {
        if(item == pathName) {
          curIndex = index;
        }
      });
      state.includeList.splice(curIndex, 1)
    },

    clearIncludeList(state) {
      state.includeList.splice(0, state.includeList.length)
    }
  }
}

export default KeepAliveMag
