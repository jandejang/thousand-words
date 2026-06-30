import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharGrid from '../../src/components/CharGrid.vue'

const mockChars = [
  {
    id: 1,
    text: '天地玄黄',
    pinyin: ['tiān', 'dì', 'xuán', 'huáng'],
    briefMeaning: '天是青黑色的，地是黄色的',
    charAnnotations: [
      { char: '天', meaning: '天空' },
      { char: '地', meaning: '大地' },
      { char: '玄', meaning: '青黑色' },
      { char: '黄', meaning: '黄色' },
    ],
    fullExplanation: '天的颜色是青黑的。',
    allusionId: null,
  },
  {
    id: 2,
    text: '宇宙洪荒',
    pinyin: ['yǔ', 'zhòu', 'hóng', 'huāng'],
    briefMeaning: '宇宙广阔无边',
    charAnnotations: [
      { char: '宇', meaning: '空间' },
      { char: '宙', meaning: '时间' },
      { char: '洪', meaning: '广大' },
      { char: '荒', meaning: '荒远' },
    ],
    fullExplanation: '宇宙广袤无边。',
    allusionId: null,
  },
]

const stubs = {
  CharCell: {
    template: '<div class="char-cell-stub" @click="$emit(\'select\', char.id)">{{ char.text }}</div>',
    props: ['char', 'showMeaning', 'hasImage'],
    emits: ['select'],
  },
  CharDetail: {
    template: '<div class="char-detail-stub">{{ char.text }}</div>',
    props: ['char'],
  },
  RouterLink: {
    template: '<a><slot/></a>',
    props: ['to'],
  },
  ThemeSwitch: {
    template: '<div class="theme-switch-stub"></div>',
  },
}

describe('CharGrid', () => {
  it('renders a CharCell for each character entry', () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs },
    })
    const cells = wrapper.findAll('.char-cell-stub')
    expect(cells).toHaveLength(2)
    expect(cells[0].text()).toBe('天地玄黄')
    expect(cells[1].text()).toBe('宇宙洪荒')
  })

  it('shows CharDetail when a cell is selected', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs },
    })
    expect(wrapper.find('.char-detail-stub').exists()).toBe(false)
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(true)
    expect(wrapper.find('.char-detail-stub').text()).toBe('天地玄黄')
  })

  it('collapses when the same cell is clicked again', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs },
    })
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(true)
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(false)
  })

  it('switches detail when a different cell is clicked', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs },
    })
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').text()).toBe('天地玄黄')
    await wrapper.findAll('.char-cell-stub')[1].trigger('click')
    expect(wrapper.find('.char-detail-stub').text()).toBe('宇宙洪荒')
  })
})
