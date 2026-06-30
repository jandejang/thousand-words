import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '../../src/composables/useTheme.js'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to "paper" theme', () => {
    const { current } = useTheme()
    expect(current.value).toBe('paper')
  })

  it('sets data-theme attribute on <html> when switching', () => {
    const { setTheme } = useTheme()
    setTheme('ink')
    expect(document.documentElement.getAttribute('data-theme')).toBe('ink')
  })

  it('does not set data-theme for the default "paper" theme', () => {
    const { setTheme } = useTheme()
    setTheme('dark')
    setTheme('paper')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('persists choice to localStorage', () => {
    const { setTheme } = useTheme()
    setTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('restores from localStorage on init', () => {
    localStorage.setItem('theme', 'ink')
    const { current } = useTheme()
    expect(current.value).toBe('ink')
    expect(document.documentElement.getAttribute('data-theme')).toBe('ink')
  })

  it('exposes all three theme options', () => {
    const { themes } = useTheme()
    expect(themes).toEqual([
      { key: 'paper', label: '宣纸' },
      { key: 'ink', label: '水墨' },
      { key: 'dark', label: '古卷' },
    ])
  })
})
