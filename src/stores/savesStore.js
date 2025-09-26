import { defineStore } from 'pinia'

// 计数器，保证 ID 唯一
let saveCounter = 0

export const useSavesStore = defineStore('saves', {
  state: () => ({
    // 存储格式: { [saveId]: saveData }
    saves: {},
    // 当前存档 ID
    currentSaveId: null,
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
        const defaultId = this.createDefaultSave()
        // 设置默认存档为当前选中的存档
        this.currentSaveId = defaultId
      }
    },

    // 创建默认存档
    createDefaultSave() {
      // 用时间戳当存档 ID
      const saveId = (Date.now() + saveCounter++).toString()
      const defaultName = '默认存档'

      this.saves[saveId] = {
        id: saveId,
        name: defaultName,
        ...this.getDefaultData(),
      }

      return saveId
    },

    // 检查存档名称是否已存在，可以指定排除 ID
    isNameDuplicate(name, excludeId = null) {
      return Object.values(this.saves).some((save) => {
        if (excludeId && save.id === excludeId) return false
        return save.name === name
      })
    },

    // 存档是否存在
    isSaveExisted(saveId) {
      return !!this.saves[saveId]
    },

    // 创建普通存档
    createSave() {
      const saveId = (Date.now() + saveCounter++).toString()

      this.saves[saveId] = {
        id: saveId,
        name: `存档-${saveId}`,
        ...this.getDefaultData(),
      }

      return saveId
    },

    // 获取指定存档
    getSave(saveId) {
      return this.saves[saveId]
    },

    // 更新存档名称
    updateSaveName(saveId, newName) {
      newName = newName.trim() // 去除前后空白符号
      if (!this.isSaveExisted(saveId)) return false
      if (newName === '') return false
      if (this.isNameDuplicate(newName, saveId)) return false

      this.saves[saveId].name = newName
      return true
    },

    // 更新基础数据
    updateBaseData(saveId, baseData) {
      if (!this.isSaveExisted(saveId)) return false

      this.saves[saveId].baseData = {
        ...this.saves[saveId].baseData,
        ...baseData,
      }

      return true
    },

    // 更新基础数据
    updateSkillsData(saveId, skillsData) {
      if (!this.isSaveExisted(saveId)) return false
      if (!Array.isArray(skillsData)) return false // 确保是数组

      this.saves[saveId].skillsData = [...skillsData]
      return true
    },

    // 删除存档
    deleteSave(saveId) {
      // 确保至少保留一个存档
      if (Object.keys(this.saves).length <= 1) return false

      // 如果删除的是当前存档，需要切换到其他存档
      if (this.currentSaveId === saveId) {
        const remainingIds = Object.keys(this.saves).filter((id) => id !== saveId)
        this.currentSaveId = remainingIds[0]
      }

      // 删除存档
      delete this.saves[saveId]
      return true
    },

    // 切换当前存档
    setCurrentSave(saveId) {
      if (this.isSaveExisted(saveId)) {
        this.currentSaveId = saveId
        return true
      }
      return false
    },
  },
  // 启用持久化
  persist: true,
})

/**
 * // 存档数据结构详细说明
 * {
 *   id: string,    // 存档 ID，唯一标识
 *   name: string,  // 存档名称
 *   baseData: {
 *     // 存档人物基本数据
 *     // 暂时没有
 *   },
 *   skillsData: [  // 技能数据列表
 *     {
 *       id: number,    // 武学 ID
 *       currentLevel: number,    // 当前等级
 *       targetedLevel: number,   // 目标等级
 *       insightLevel: number,    // 领悟等级
 *     },
 *   ]
 * }
 */
