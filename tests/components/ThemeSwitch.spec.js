import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeSwitch from '../../src/components/ThemeSwitch.vue'

describe('ThemeSwitch', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders a toggle button', () => {
    const wrapper = mount(ThemeSwitch)
    expect(wrapper.find('.theme-toggle').exists()).toBe(true)
  })

  it('shows dropdown with three options on click', async () => {
    const wrapper = mount(ThemeSwitch)
    await wrapper.find('.theme-toggle').trigger('click')
    const options = wrapper.findAll('.theme-option')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toContain('宣纸')
    expect(options[1].text()).toContain('水墨')
    expect(options[2].text()).toContain('古卷')
  })

  it('applies theme when option is clicked', async () => {
    const wrapper = mount(ThemeSwitch)
    await wrapper.find('.theme-toggle').trigger('click')
    await wrapper.findAll('.theme-option')[1].trigger('click')
    expect(document.documentElement.getAttribute('data-theme')).toBe('ink')
  })
})
