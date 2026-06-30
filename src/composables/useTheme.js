import { ref } from 'vue'

const themes = [
  { key: 'paper', label: '宣纸' },
  { key: 'ink', label: '水墨' },
  { key: 'dark', label: '古卷' },
]

const current = ref('paper')

function applyTheme(key) {
  if (key === 'paper') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', key)
  }
}

function setTheme(key) {
  current.value = key
  applyTheme(key)
  localStorage.setItem('theme', key)
}

function init() {
  const saved = localStorage.getItem('theme')
  if (saved && themes.some(t => t.key === saved)) {
    current.value = saved
    applyTheme(saved)
  }
}

export function useTheme() {
  init()
  return { current, themes, setTheme }
}
