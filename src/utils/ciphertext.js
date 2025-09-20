/**
 * 获取日常暗号问题
 * @returns {Promise<string>} 返回暗号问题或者获取失败
 */
export const getCiphertext = async () => {
  try {
    const response = await fetch(
      'https://manageplatform.maple-game.com:9009/defend/web/rampageHero/ciphertext',
    )

    // 如果获取响应失败，抛出异常
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`)
    }

    // 获取页面
    const html = await response.text()

    // 使用正则表达式返回暗号问题
    const ciphertext = html.match(/<div>([^<]+)<\/div>/)?.[1]

    return ciphertext || '获取暗号问题失败'
  } catch (error) {
    console.error('获取暗号问题失败：', error)
    return '获取暗号问题失败'
  }
}
