import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharDetail from '../../src/components/CharDetail.vue'

const sampleChar = {
  id: 1,
  text: '天地玄黄',
  pinyin: ['tiān', 'dì', 'xuán', 'huáng'],
  briefMeaning: '天是青黑色的，地是黄色的',
  charAnnotations: [
    { char: '天', meaning: '天空' },
    { char: '地', meaning: '大地' },
    { char: '玄', meaning: '青黑色，深远' },
    { char: '黄', meaning: '黄色' },
  ],
  fullExplanation: '天的颜色是青黑的，地的颜色是黄的。',
  allusionId: 'tianxuandihuang',
}

const charWithoutAllusion = {
  ...sampleChar,
  id: 2,
  allusionId: null,
}

describe('CharDetail', () => {
  it('renders enlarged characters with pinyin', () => {
    const wrapper = mount(CharDetail, { props: { char: sampleChar } })
    const rubies = wrapper.findAll('.detail-title ruby')
    expect(rubies).toHaveLength(4)
    expect(rubies[0].text()).toContain('天')
  })

  it('renders all 4 character annotation cards', () => {
    const wrapper = mount(CharDetail, { props: { char: sampleChar } })
    const cards = wrapper.findAll('.annotation-card')
    expect(cards).toHaveLength(4)
    expect(cards[0].find('.anno-char').text()).toBe('天')
    expect(cards[0].find('.anno-meaning').text()).toBe('天空')
    expect(cards[2].find('.anno-char').text()).toBe('玄')
    expect(cards[2].find('.anno-meaning').text()).toBe('青黑色，深远')
  })

  it('renders full explanation', () => {
    const wrapper = mount(CharDetail, { props: { char: sampleChar } })
    expect(wrapper.find('.full-explanation').text()).toContain('天的颜色是青黑的')
  })

  it('shows allusion button when allusionId exists', () => {
    const wrapper = mount(CharDetail, { props: { char: sampleChar } })
    expect(wrapper.find('.allusion-link').exists()).toBe(true)
  })

  it('hides allusion button when allusionId is null', () => {
    const wrapper = mount(CharDetail, { props: { char: charWithoutAllusion } })
    expect(wrapper.find('.allusion-link').exists()).toBe(false)
  })

  it('allusion button links to /allusion/:id', () => {
    const wrapper = mount(CharDetail, {
      props: { char: sampleChar },
      global: { stubs: { RouterLink: { template: '<a :href="to"><slot/></a>', props: ['to'] } } },
    })
    const link = wrapper.find('.allusion-link')
    expect(link.attributes('href')).toBe('/allusion/tianxuandihuang')
  })
})
