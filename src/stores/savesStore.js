import { defineStore } from 'pinia'

export const useSavesStore = defineStore('saves', {
  state: () => ({
    // 存储格式: { [saveId]: saveData }
    saves: {},
  }),
  actions: {
    // 所有存档的默认属性(每个存档创建都有的)
    getDefaultData() {
      return {
        baseData: {
          // 这里应该放根骨, 悟性等基本属性，但是现在先不做
        },
        skillsData: [], // 无技能数据
      }
    },

    // 初始化时检查并创建默认存档
    initDefaults() {
      // 检查是否已有存档, 没有则创建默认存档
      if (Object.keys(this.saves).length === 0) {
        this.createDefaultSave()
      }
    },

    // 创建默认存档
    createDefaultSave() {
      // 用时间戳当存档 ID
      const saveId = Date.now().toString()
      const defaultName = '默认存档'

      this.saves[saveId] = {
        id: saveId,
        name: defaultName,
        isDefault: true, // 默认存档，不可删除
        ...this.getDefaultData(),
      }

      // 默认存档有 2 种选择
      // 1. 设置默认存档，不可删除
      // 2. 任意存档，但是至少保留  1 个存档
      // 这里选择的是第一种, 第二种好像要额外处理
      // 不过第 2 种自由度更高, 再看

      return saveId
    },
  },
  // 启用持久化
  persist: true,
})
