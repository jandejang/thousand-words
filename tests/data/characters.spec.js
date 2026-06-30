import { describe, it, expect } from 'vitest'
import characters from '../../src/data/characters.json'
import allusions from '../../src/data/allusions.json'

describe('characters.json', () => {
  it('has 250 entries', () => {
    expect(characters).toHaveLength(250)
  })

  it('each entry has required fields', () => {
    for (const c of characters) {
      expect(c).toHaveProperty('id')
      expect(c).toHaveProperty('text')
      expect(c).toHaveProperty('pinyin')
      expect(c).toHaveProperty('briefMeaning')
      expect(c).toHaveProperty('charAnnotations')
      expect(c).toHaveProperty('fullExplanation')
      expect(c).toHaveProperty('allusionId')
    }
  })

  it('each text is exactly 4 characters', () => {
    for (const c of characters) {
      expect(c.text).toHaveLength(4)
    }
  })

  it('each pinyin array has exactly 4 elements', () => {
    for (const c of characters) {
      expect(c.pinyin).toHaveLength(4)
    }
  })

  it('each charAnnotations has exactly 4 entries matching text', () => {
    for (const c of characters) {
      expect(c.charAnnotations).toHaveLength(4)
      for (let i = 0; i < 4; i++) {
        expect(c.charAnnotations[i].char).toBe(c.text[i])
      }
    }
  })

  it('ids are sequential starting from 1', () => {
    for (let i = 0; i < characters.length; i++) {
      expect(characters[i].id).toBe(i + 1)
    }
  })
})

describe('allusions.json', () => {
  it('is an array', () => {
    expect(Array.isArray(allusions)).toBe(true)
  })

  it('each entry has required fields', () => {
    for (const a of allusions) {
      expect(a).toHaveProperty('id')
      expect(a).toHaveProperty('title')
      expect(a).toHaveProperty('source')
      expect(a).toHaveProperty('sourceText')
      expect(a).toHaveProperty('interpretation')
    }
  })

  it('every allusionId in characters references a valid allusion', () => {
    const allusionIds = new Set(allusions.map(a => a.id))
    for (const c of characters) {
      if (c.allusionId !== null) {
        expect(allusionIds.has(c.allusionId)).toBe(true)
      }
    }
  })
})
