/**
 * 主题配置
 * 文艺复兴背景图片 URL（来自 Wikimedia Commons 公共领域）
 */
export const THEME_CONFIG = {
  // 可替换的背景图片 URL
  backgroundImages: [
    // 选项1: 达芬奇的维特鲁威人（简化版）
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Vitruvian_Man_by_Leonardo_da_Vinci.jpg',
    // 选项2: 文艺复兴雕塑
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Michelangelo%27s_David_2015.jpg/800px-Michelangelo%27s_David_2015.jpg',
    // 选项3: 文艺复兴绘画
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  ],
  // 当前使用的背景（索引）
  currentBackgroundIndex: 0,
  // 背景透明度（0-1）
  backgroundOpacity: 0.08,
  // 背景模糊度（px）
  backgroundBlur: 2,
} as const;

/**
 * 获取当前背景图片 URL
 */
export function getCurrentBackgroundImage(): string {
  return THEME_CONFIG.backgroundImages[THEME_CONFIG.currentBackgroundIndex];
}

