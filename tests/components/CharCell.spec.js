import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharCell from '../../src/components/CharCell.vue'

const sampleChar = {
  id: 1,
  text: '天地玄黄',
  pinyin: ['tiān', 'dì', 'xuán', 'huáng'],
  briefMeaning: '天是青黑色的，地是黄色的',
  charAnnotations: [],
  fullExplanation: '',
  allusionId: null,
}

describe('CharCell', () => {
  it('renders four ruby characters with pinyin', () => {
    const wrapper = mount(CharCell, { props: { char: sampleChar } })
    const rubies = wrapper.findAll('ruby')
    expect(rubies).toHaveLength(4)
    expect(rubies[0].text()).toContain('天')
    expect(rubies[0].find('rt').text()).toBe('tiān')
    expect(rubies[3].text()).toContain('黄')
    expect(rubies[3].find('rt').text()).toBe('huáng')
  })

  it('shows tooltip on hover with brief meaning', async () => {
    const wrapper = mount(CharCell, { props: { char: sampleChar } })
    expect(wrapper.find('.tooltip').exists()).toBe(false)
    await wrapper.find('.char-cell').trigger('mouseenter')
    expect(wrapper.find('.tooltip').exists()).toBe(true)
    expect(wrapper.find('.tooltip').text()).toBe('天是青黑色的，地是黄色的')
  })

  it('hides tooltip on mouse leave', async () => {
    const wrapper = mount(CharCell, { props: { char: sampleChar } })
    await wrapper.find('.char-cell').trigger('mouseenter')
    expect(wrapper.find('.tooltip').exists()).toBe(true)
    await wrapper.find('.char-cell').trigger('mouseleave')
    expect(wrapper.find('.tooltip').exists()).toBe(false)
  })

  it('emits "select" with char id on click', async () => {
    const wrapper = mount(CharCell, { props: { char: sampleChar } })
    await wrapper.find('.char-cell').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([1])
  })

  it('shows brief meaning text on mobile (showMeaning prop)', () => {
    const wrapper = mount(CharCell, {
      props: { char: sampleChar, showMeaning: true },
    })
    expect(wrapper.find('.brief-meaning').exists()).toBe(true)
    expect(wrapper.find('.brief-meaning').text()).toBe('天是青黑色的，地是黄色的')
  })
})
