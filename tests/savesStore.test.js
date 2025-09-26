import { test, expect, beforeEach, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSavesStore } from '../src/stores/savesStore'

// 分组测试，提高可读性
describe('存档存储 (savesStore) 测试', () => {
  // 每个测试前重置 Pinia 状态，确保测试独立性
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('初始状态测试', () => {
    test('初始状态应该包含空存档对象和 null 的当前存档 ID', () => {
      const store = useSavesStore()

      expect(store.saves).toEqual({})
      expect(store.currentSaveId).toBeNull()
    })
  })

  describe('存档初始化测试', () => {
    test('初始化时应该创建默认存档并设置为当前存档', () => {
      const store = useSavesStore()
      store.initDefaults()

      // 验证存档数量
      expect(Object.keys(store.saves).length).toBe(1)

      // 验证当前存档ID已设置
      expect(store.currentSaveId).not.toBeNull()

      // 验证默认存档属性
      const defaultSave = store.getSave(store.currentSaveId)
      expect(defaultSave).toBeDefined()
      expect(defaultSave.name).toBe('默认存档')
      expect(defaultSave.baseData).toEqual({})
      expect(defaultSave.skillsData).toEqual([])
    })

    test('已存在存档时，初始化不应创建新存档', () => {
      const store = useSavesStore()
      // 先创建一个存档
      const existingId = store.createSave()
      // 执行初始化
      store.initDefaults()

      // 验证存档数量没有增加
      expect(Object.keys(store.saves).length).toBe(1)
    })
  })

  describe('存档创建测试', () => {
    test('创建新存档应该成功返回有效ID并正确初始化属性', () => {
      const store = useSavesStore()
      const saveId = store.createSave()

      // 验证存档已创建
      expect(store.saves[saveId]).toBeDefined()

      // 验证存档属性
      const newSave = store.getSave(saveId)
      expect(newSave.id).toBe(saveId)
      expect(newSave.name).toContain('存档-')
      expect(newSave.baseData).toEqual({})
      expect(newSave.skillsData).toEqual([])
    })

    test('连续创建多个存档应生成唯一ID', () => {
      const store = useSavesStore()
      const ids = [store.createSave(), store.createSave(), store.createSave()]

      // 验证所有ID都是唯一的
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })
  })

  describe('存档名称管理测试', () => {
    test('检查存档名称重复应该正确工作', () => {
      const store = useSavesStore()
      store.initDefaults()
      const firstSaveId = store.currentSaveId

      // 创建第二个存档
      const secondSaveId = store.createSave()
      expect(secondSaveId).toBeDefined()

      // 尝试将第二个存档名称改为与第一个相同（应该失败）
      const updateResult = store.updateSaveName(secondSaveId, '默认存档')
      expect(updateResult).toBe(false)

      // 验证第二个存档名称未被修改
      expect(store.getSave(secondSaveId).name).not.toBe('默认存档')
    })

    test('更新存档名称应该成功或失败', () => {
      const store = useSavesStore()
      store.initDefaults()
      const saveId = store.currentSaveId
      const originalName = store.getSave(saveId).name

      // 测试成功情况 - 正常名称更新
      expect(store.updateSaveName(saveId, '新名称')).toBe(true)
      expect(store.saves[saveId].name).toBe('新名称')

      // 测试成功情况 - 名称包含空格
      expect(store.updateSaveName(saveId, ' 带空格的名称 ')).toBe(true)
      expect(store.saves[saveId].name).toBe('带空格的名称') // 验证自动trim

      // 测试失败情况 - 空名称
      expect(store.updateSaveName(saveId, '')).toBe(false)
      expect(store.saves[saveId].name).toBe('带空格的名称') // 确保名称未变

      // 测试失败情况 - 仅包含空白字符
      expect(store.updateSaveName(saveId, '   ')).toBe(false)

      // 测试失败情况 - 不存在的存档ID
      expect(store.updateSaveName('invalid-id', '新名称')).toBe(false)
    })
  })

  describe('存档删除测试', () => {
    test('删除存档应该成功并正确处理当前存档切换', () => {
      const store = useSavesStore()
      store.initDefaults()
      const firstSaveId = store.currentSaveId

      // 创建第二个存档
      const secondSaveId = store.createSave()
      expect(Object.keys(store.saves).length).toBe(2)

      // 删除当前存档
      expect(store.deleteSave(firstSaveId)).toBe(true)

      // 验证存档已删除
      expect(store.isSaveExisted(firstSaveId)).toBe(false)
      expect(Object.keys(store.saves).length).toBe(1)

      // 验证当前存档已切换
      expect(store.currentSaveId).toBe(secondSaveId)
    })

    test('尝试删除最后一个存档应该失败', () => {
      const store = useSavesStore()
      store.initDefaults()
      const onlySaveId = store.currentSaveId

      // 尝试删除唯一存档
      expect(store.deleteSave(onlySaveId)).toBe(false)

      // 验证存档仍然存在
      expect(store.isSaveExisted(onlySaveId)).toBe(true)
      expect(Object.keys(store.saves).length).toBe(1)
    })

    test('删除不存在的存档应该失败', () => {
      const store = useSavesStore()
      store.initDefaults()

      // 尝试删除不存在的存档
      expect(store.deleteSave('invalid-id')).toBe(false)
    })
  })

  describe('当前存档切换测试', () => {
    test('切换到存在的存档应该成功', () => {
      const store = useSavesStore()
      store.initDefaults()
      const firstSaveId = store.currentSaveId

      // 创建第二个存档
      const secondSaveId = store.createSave()

      // 切换到第二个存档
      expect(store.setCurrentSave(secondSaveId)).toBe(true)
      expect(store.currentSaveId).toBe(secondSaveId)

      // 切换回第一个存档
      expect(store.setCurrentSave(firstSaveId)).toBe(true)
      expect(store.currentSaveId).toBe(firstSaveId)
    })

    test('切换到不存在的存档应该失败', () => {
      const store = useSavesStore()
      store.initDefaults()
      const originalId = store.currentSaveId

      // 尝试切换到不存在的存档
      expect(store.setCurrentSave('invalid-id')).toBe(false)
      // 验证当前存档ID未变
      expect(store.currentSaveId).toBe(originalId)
    })
  })

  describe('技能数据更新测试', () => {
    test('更新技能数据应该正确工作', () => {
      const store = useSavesStore()
      store.initDefaults()
      const saveId = store.currentSaveId

      // 测试正常更新
      const testSkills = [
        {
          id: 1,
          currentLevel: 1,
          targetedLevel: 5,
          insightLevel: 0,
        },
      ]
      expect(store.updateSkillsData(saveId, testSkills)).toBe(true)
      expect(store.saves[saveId].skillsData).toEqual(testSkills)

      // 测试追加更新
      const additionalSkills = [
        ...testSkills,
        { id: 2, currentLevel: 3, targetedLevel: 7, insightLevel: 2 },
      ]
      expect(store.updateSkillsData(saveId, additionalSkills)).toBe(true)
      expect(store.saves[saveId].skillsData).toEqual(additionalSkills)
    })

    test('更新技能数据传入非数组应该失败', () => {
      const store = useSavesStore()
      store.initDefaults()
      const saveId = store.currentSaveId
      const originalSkills = [...store.saves[saveId].skillsData]

      // 测试传入字符串
      expect(store.updateSkillsData(saveId, 'not-array')).toBe(false)
      expect(store.saves[saveId].skillsData).toEqual(originalSkills)

      // 测试传入对象
      expect(store.updateSkillsData(saveId, { not: 'array' })).toBe(false)
      expect(store.saves[saveId].skillsData).toEqual(originalSkills)
    })

    test('更新不存在的存档的技能数据应该失败', () => {
      const store = useSavesStore()
      const testSkills = [{ id: 1, currentLevel: 1, targetedLevel: 5, insightLevel: 0 }]

      expect(store.updateSkillsData('invalid-id', testSkills)).toBe(false)
    })
  })
})
