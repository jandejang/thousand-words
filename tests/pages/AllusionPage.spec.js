import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AllusionPage from '../../src/pages/AllusionPage.vue'

const stubs = {
  RouterLink: {
    template: '<a :href="to" class="back-link"><slot/></a>',
    props: ['to'],
  },
}

describe('AllusionPage', () => {
  it('renders allusion title', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.allusion-title').text()).toBe('天玄地黄')
  })

  it('renders source label', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.allusion-source').text()).toContain('《易经·坤卦》文言')
  })

  it('renders source text in a blockquote', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.source-quote').text()).toContain('天玄而地黄')
  })

  it('renders interpretation', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.allusion-interpretation').text()).toContain('语出《易经》')
  })

  it('shows image section when image exists', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.allusion-image').exists()).toBe(true)
  })

  it('hides image section when image is null', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'hanlaishuwang' },
      global: { stubs },
    })
    expect(wrapper.find('.allusion-image').exists()).toBe(false)
  })

  it('has a back link to home', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
      global: { stubs },
    })
    expect(wrapper.find('.back-link').exists()).toBe(true)
    expect(wrapper.find('.back-link').attributes('href')).toBe('/')
  })

  it('shows not-found message for invalid id', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'nonexistent' },
      global: { stubs },
    })
    expect(wrapper.find('.not-found').exists()).toBe(true)
  })
})
