/**
 * 国际化支持
 */

export type Language = 'zh' | 'en'

export interface Translations {
  home: {
    title: string
    subtitle: string
    placeholder: string
    button: string
    buttonLoading: string
    footer: string
  }
  company: {
    checkin: string
    checkinLoading: string
    checkedIn: string
    generating: string
    retry: string
  }
  common: {
    loading: string
    error: string
    retry: string
  }
}

export const translations: Record<Language, Translations> = {
  zh: {
    home: {
      title: '每日5分钟读懂一家公司',
      subtitle: '输入公司名字或股票代码，生成深度公司故事',
      placeholder: '例如：Apple 或 AAPL',
      button: '开始学习',
      buttonLoading: '生成中...',
      footer: '通过每日打卡，系统性学习公司知识',
    },
    company: {
      checkin: '今日打卡',
      checkinLoading: '打卡中...',
      checkedIn: '今日已打卡 ✅',
      generating: '正在生成内容，请稍候...',
      retry: '重试',
    },
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
    },
  },
  en: {
    home: {
      title: 'Learn a Company in 5 Minutes',
      subtitle: 'Enter a company name or stock ticker to generate an in-depth company story',
      placeholder: 'e.g., Apple or AAPL',
      button: 'Start Your Learning Journey',
      buttonLoading: 'Generating...',
      footer: 'Build systematic company knowledge through daily check-ins',
    },
    company: {
      checkin: 'Check In Today',
      checkinLoading: 'Checking in...',
      checkedIn: 'Checked In Today ✅',
      generating: 'Generating content, please wait...',
      retry: 'Retry',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
    },
  },
}

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.zh
}



