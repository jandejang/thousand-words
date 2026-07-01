import { ref, computed } from 'vue'

const languages = [
  { key: 'mandarin', label: '普通话', pinyinField: 'pinyin' },
  { key: 'cantonese', label: '粤语', pinyinField: 'jyutping' },
  { key: 'teochew', label: '潮州话', pinyinField: 'teochew' },
]

const current = ref('mandarin')

function setLanguage(key) {
  if (languages.some(l => l.key === key)) {
    current.value = key
    localStorage.setItem('pronunciation', key)
  }
}

function init() {
  const saved = localStorage.getItem('pronunciation')
  if (saved && languages.some(l => l.key === saved)) {
    current.value = saved
  } else {
    current.value = 'mandarin'
  }
}

export function usePronunciation() {
  init()

  const pinyinField = computed(() => {
    const lang = languages.find(l => l.key === current.value)
    return lang ? lang.pinyinField : 'pinyin'
  })

  return { current, languages, setLanguage, pinyinField }
}
