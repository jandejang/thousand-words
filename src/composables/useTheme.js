import { ref } from 'vue'

const themes = [
  { key: 'paper', label: '宣纸', bg: '#faf6f0', text: '#2c1810', accent: '#8b5a2b' },
  { key: 'ink', label: '水墨', bg: '#f5f5f0', text: '#1a1a1a', accent: '#666666' },
  { key: 'dark', label: '古卷', bg: '#1a1a2e', text: '#e8d5b7', accent: '#c4a36e' },
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
