# 千字文互动学习应用 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a progressive-disclosure learning app for 《千字文》 with ruby pinyin, three-layer interaction (hover → expand → allusion page), three switchable themes, and mobile responsiveness.

**Architecture:** Vite + Vue 3 SPA. Content data stored as JSON files, rendered through reusable Vue components. Vue Router handles allusion sub-pages with lazy loading. CSS custom properties drive theme switching. No backend.

**Tech Stack:** Vite 6, Vue 3 (Composition API), Vue Router 4, Vitest, @vue/test-utils, happy-dom

---

## File Map

```
thousand-words/
├── index.html                          # HTML entry, loads Google Fonts
├── vite.config.js                      # Vite + Vue plugin + test config
├── package.json
├── src/
│   ├── main.js                         # App bootstrap + router
│   ├── App.vue                         # Root layout (header + router-view)
│   ├── router/
│   │   └── index.js                    # Routes: / and /allusion/:id
│   ├── composables/
│   │   └── useTheme.js                 # Theme state + localStorage persistence
│   ├── components/
│   │   ├── CharGrid.vue                # CSS Grid of CharCells + inline CharDetail
│   │   ├── CharCell.vue                # One 4-char phrase: ruby pinyin + tooltip
│   │   ├── CharDetail.vue              # L2 expansion: char annotations + explanation
│   │   └── ThemeSwitch.vue             # Theme picker dropdown
│   ├── pages/
│   │   └── AllusionPage.vue            # L3 allusion detail (lazy-loaded)
│   ├── data/
│   │   ├── characters.json             # 250 entries: text, pinyin, meanings, annotations
│   │   └── allusions.json              # Allusion entries: source text, interpretation, images
│   ├── assets/
│   │   └── images/                     # Public domain artwork (added incrementally)
│   └── styles/
│       ├── themes.css                  # Three theme variable sets
│       └── main.css                    # Global typography, grid, responsive breakpoints
├── tests/
│   ├── composables/
│   │   └── useTheme.spec.js
│   ├── components/
│   │   ├── CharCell.spec.js
│   │   ├── CharDetail.spec.js
│   │   ├── CharGrid.spec.js
│   │   └── ThemeSwitch.spec.js
│   ├── pages/
│   │   └── AllusionPage.spec.js
│   └── data/
│       └── characters.spec.js
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue`

- [ ] **Step 1: Initialize Vite + Vue 3 project**

```bash
cd /home/jerry/playground/thousand-words
npm create vite@latest . -- --template vue
```

When prompted about existing files, choose to ignore/skip. This creates the scaffolding.

- [ ] **Step 2: Install dependencies**

```bash
npm install vue-router@4
npm install -D vitest @vue/test-utils happy-dom
```

- [ ] **Step 3: Configure Vite with test support**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.js'],
  },
})
```

- [ ] **Step 4: Set up index.html with Google Fonts**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>千字文</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Create minimal App.vue**

```vue
<template>
  <div class="app">
    <router-view />
  </div>
</template>
```

- [ ] **Step 6: Create router stub**

Create `src/router/index.js`:

```js
import { createRouter, createWebHistory } from 'vue-router'
import CharGrid from '../components/CharGrid.vue'

const routes = [
  { path: '/', component: CharGrid },
  {
    path: '/allusion/:id',
    component: () => import('../pages/AllusionPage.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

- [ ] **Step 7: Create main.js entry**

Replace `src/main.js`:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/themes.css'
import './styles/main.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 8: Create placeholder files so the app compiles**

Create `src/components/CharGrid.vue`:

```vue
<template>
  <div class="char-grid">
    <p>千字文</p>
  </div>
</template>
```

Create `src/pages/AllusionPage.vue`:

```vue
<template>
  <div class="allusion-page">
    <p>典故页面</p>
  </div>
</template>
```

Create `src/styles/themes.css` (empty file for now).

Create `src/styles/main.css` (empty file for now).

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts, browser shows "千字文" text.

- [ ] **Step 10: Verify test runner works**

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

Create `tests/smoke.spec.js`:

```js
import { describe, it, expect } from 'vitest'

describe('smoke test', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

```bash
npm test
```

Expected: 1 test passes.

- [ ] **Step 11: Commit**

```bash
git init
echo 'node_modules\ndist\n.superpowers' > .gitignore
git add .
git commit -m "feat: scaffold Vite + Vue 3 project with router and test setup"
```

---

## Task 2: Theme System

**Files:**
- Create: `src/styles/themes.css`, `src/composables/useTheme.js`, `src/components/ThemeSwitch.vue`
- Test: `tests/composables/useTheme.spec.js`, `tests/components/ThemeSwitch.spec.js`

- [ ] **Step 1: Write themes.css with three theme variable sets**

Write `src/styles/themes.css`:

```css
:root {
  --bg: #faf6f0;
  --text: #2c1810;
  --accent: #8b5a2b;
  --subtle: rgba(139, 90, 43, 0.06);
  --border: rgba(139, 90, 43, 0.12);
  --tooltip-bg: #2c1810;
  --tooltip-text: #faf6f0;
}

[data-theme="ink"] {
  --bg: #f5f5f0;
  --text: #1a1a1a;
  --accent: #666666;
  --subtle: rgba(0, 0, 0, 0.03);
  --border: rgba(0, 0, 0, 0.08);
  --tooltip-bg: #1a1a1a;
  --tooltip-text: #f5f5f0;
}

[data-theme="dark"] {
  --bg: #1a1a2e;
  --text: #e8d5b7;
  --accent: #c4a36e;
  --subtle: rgba(200, 170, 120, 0.08);
  --border: rgba(200, 170, 120, 0.15);
  --tooltip-bg: #e8d5b7;
  --tooltip-text: #1a1a2e;
}
```

- [ ] **Step 2: Write failing test for useTheme composable**

Create `tests/composables/useTheme.spec.js`:

```js
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
```

Run: `npx vitest run tests/composables/useTheme.spec.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement useTheme composable**

Create `src/composables/useTheme.js`:

```js
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
```

Run: `npx vitest run tests/composables/useTheme.spec.js`
Expected: All 6 tests pass.

- [ ] **Step 4: Write failing test for ThemeSwitch component**

Create `tests/components/ThemeSwitch.spec.js`:

```js
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
```

Run: `npx vitest run tests/components/ThemeSwitch.spec.js`
Expected: FAIL — component does not exist or render correctly.

- [ ] **Step 5: Implement ThemeSwitch component**

Create `src/components/ThemeSwitch.vue`:

```vue
<template>
  <div class="theme-switch">
    <button class="theme-toggle" @click="open = !open" :aria-label="'当前主题：' + currentLabel">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" :stroke="'var(--accent)'" stroke-width="2" />
        <path d="M10 2a8 8 0 0 1 0 16z" :fill="'var(--accent)'" />
      </svg>
    </button>
    <div v-if="open" class="theme-dropdown">
      <button
        v-for="t in themes"
        :key="t.key"
        class="theme-option"
        :class="{ active: current === t.key }"
        @click="select(t.key)"
      >
        {{ t.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { current, themes, setTheme } = useTheme()
const open = ref(false)

const currentLabel = computed(() => {
  const t = themes.find(t => t.key === current.value)
  return t ? t.label : ''
})

function select(key) {
  setTheme(key)
  open.value = false
}
</script>

<style scoped>
.theme-switch {
  position: relative;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: var(--border);
}

.theme-dropdown {
  position: absolute;
  top: 44px;
  right: 0;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.theme-option {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
  white-space: nowrap;
}

.theme-option:hover {
  background: var(--subtle);
}

.theme-option.active {
  color: var(--accent);
  font-weight: bold;
}
</style>
```

Run: `npx vitest run tests/components/ThemeSwitch.spec.js`
Expected: All 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/styles/themes.css src/composables/useTheme.js src/components/ThemeSwitch.vue tests/composables/useTheme.spec.js tests/components/ThemeSwitch.spec.js
git commit -m "feat: add theme system with three themes and localStorage persistence"
```

---

## Task 3: Data Layer

**Files:**
- Create: `src/data/characters.json`, `src/data/allusions.json`
- Test: `tests/data/characters.spec.js`

- [ ] **Step 1: Write data validation test**

Create `tests/data/characters.spec.js`:

```js
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

  it('ids are sequential 1-250', () => {
    for (let i = 0; i < 250; i++) {
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
```

Run: `npx vitest run tests/data/characters.spec.js`
Expected: FAIL — JSON files don't exist.

- [ ] **Step 2: Create characters.json with all 250 entries**

Create `src/data/characters.json` containing all 250 four-character phrases from `千字文.md`.

Each entry follows this structure (first 8 shown, all 250 must be populated):

```json
[
  {
    "id": 1,
    "text": "天地玄黄",
    "pinyin": ["tiān", "dì", "xuán", "huáng"],
    "briefMeaning": "天是青黑色的，地是黄色的",
    "charAnnotations": [
      { "char": "天", "meaning": "天空" },
      { "char": "地", "meaning": "大地" },
      { "char": "玄", "meaning": "青黑色，深远" },
      { "char": "黄", "meaning": "黄色" }
    ],
    "fullExplanation": "天的颜色是青黑的，地的颜色是黄的。开篇以天地的色彩起笔，引出宇宙万物的宏大叙事。",
    "allusionId": "tianxuandihuang"
  },
  {
    "id": 2,
    "text": "宇宙洪荒",
    "pinyin": ["yǔ", "zhòu", "hóng", "huāng"],
    "briefMeaning": "宇宙广阔无边，混沌蒙昧",
    "charAnnotations": [
      { "char": "宇", "meaning": "上下四方的空间" },
      { "char": "宙", "meaning": "古往今来的时间" },
      { "char": "洪", "meaning": "大，广大" },
      { "char": "荒", "meaning": "荒远，蒙昧" }
    ],
    "fullExplanation": "宇宙广袤无边，远古时代混沌蒙昧。「宇」指空间，「宙」指时间，合称涵盖一切时空。",
    "allusionId": null
  },
  {
    "id": 3,
    "text": "日月盈昃",
    "pinyin": ["rì", "yuè", "yíng", "zè"],
    "briefMeaning": "太阳到了正午就偏西，月亮圆了就会亏缺",
    "charAnnotations": [
      { "char": "日", "meaning": "太阳" },
      { "char": "月", "meaning": "月亮" },
      { "char": "盈", "meaning": "满，盈满" },
      { "char": "昃", "meaning": "太阳偏西" }
    ],
    "fullExplanation": "太阳到了正午就会偏西，月亮盈满之后就会亏缺。说明自然事物盛极必衰的规律。",
    "allusionId": "riyueyingze"
  },
  {
    "id": 4,
    "text": "辰宿列张",
    "pinyin": ["chén", "xiù", "liè", "zhāng"],
    "briefMeaning": "星辰布满天空",
    "charAnnotations": [
      { "char": "辰", "meaning": "星辰，日月星的总称" },
      { "char": "宿", "meaning": "星宿，二十八宿" },
      { "char": "列", "meaning": "排列，陈列" },
      { "char": "张", "meaning": "展开，布满" }
    ],
    "fullExplanation": "星辰在天空中排列展布。古人将天空星星分为二十八宿，各有分布。",
    "allusionId": null
  },
  {
    "id": 5,
    "text": "寒来暑往",
    "pinyin": ["hán", "lái", "shǔ", "wǎng"],
    "briefMeaning": "寒冬到来，暑夏过去",
    "charAnnotations": [
      { "char": "寒", "meaning": "寒冷" },
      { "char": "来", "meaning": "到来" },
      { "char": "暑", "meaning": "炎热" },
      { "char": "往", "meaning": "过去" }
    ],
    "fullExplanation": "寒冬来临，暑夏过去，四季交替循环不息。语出《易经·系辞》。",
    "allusionId": "hanlaishuwang"
  },
  {
    "id": 6,
    "text": "秋收冬藏",
    "pinyin": ["qiū", "shōu", "dōng", "cáng"],
    "briefMeaning": "秋天收获，冬天储藏",
    "charAnnotations": [
      { "char": "秋", "meaning": "秋季" },
      { "char": "收", "meaning": "收获" },
      { "char": "冬", "meaning": "冬季" },
      { "char": "藏", "meaning": "储藏" }
    ],
    "fullExplanation": "秋天收获庄稼，冬天储藏粮食。与春生夏长合称「春生夏长，秋收冬藏」，是古代农业社会的基本规律。",
    "allusionId": null
  },
  {
    "id": 7,
    "text": "闰余成岁",
    "pinyin": ["rùn", "yú", "chéng", "suì"],
    "briefMeaning": "积累闰月凑成一年",
    "charAnnotations": [
      { "char": "闰", "meaning": "闰月" },
      { "char": "余", "meaning": "多余的" },
      { "char": "成", "meaning": "凑成" },
      { "char": "岁", "meaning": "一年" }
    ],
    "fullExplanation": "农历与太阳年有差异，积累多余的天数设置闰月来调整，使历法与天时吻合。",
    "allusionId": null
  },
  {
    "id": 8,
    "text": "律吕调阳",
    "pinyin": ["lǜ", "lǚ", "tiáo", "yáng"],
    "briefMeaning": "用音律来调和阴阳",
    "charAnnotations": [
      { "char": "律", "meaning": "六律，阳律" },
      { "char": "吕", "meaning": "六吕，阴律" },
      { "char": "调", "meaning": "调和" },
      { "char": "阳", "meaning": "阴阳" }
    ],
    "fullExplanation": "古人用六律六吕十二音律来调和阴阳，认为音乐与天地之气相通。",
    "allusionId": "lvlvtiaoyang"
  }
]
```

**Note:** All 250 entries must be populated following the same pattern. The source text in `千字文.md` provides all 250 phrases. Each entry needs accurate pinyin, brief meaning, per-character annotations, full explanation, and an `allusionId` (set to `null` if no notable allusion).

- [ ] **Step 3: Create allusions.json with initial entries**

Create `src/data/allusions.json`:

```json
[
  {
    "id": "tianxuandihuang",
    "title": "天玄地黄",
    "source": "《易经·坤卦》文言",
    "sourceText": "夫玄黄者，天地之杂也，天玄而地黄。",
    "interpretation": "语出《易经》坤卦文言。古人观察天空呈青黑色，大地呈黄色，以此描述天地最基本的色彩特征，引申为宇宙初始的面貌。千字文以此开篇，总领全文。",
    "image": null,
    "imageSource": null
  },
  {
    "id": "riyueyingze",
    "title": "日月盈昃",
    "source": "《易经·丰卦》",
    "sourceText": "日中则昃，月盈则食。",
    "interpretation": "太阳到了正午就开始偏西，月亮盈满之后就开始亏缺。这是古人对自然规律的观察，也蕴含盛极必衰的哲理。",
    "image": null,
    "imageSource": null
  },
  {
    "id": "hanlaishuwang",
    "title": "寒来暑往",
    "source": "《易经·系辞下》",
    "sourceText": "寒往则暑来，暑往则寒来，寒暑相推而岁成焉。",
    "interpretation": "寒暑交替循环，推动岁月更迭。古人由此认识到时间与自然变化的规律性。",
    "image": null,
    "imageSource": null
  },
  {
    "id": "lvlvtiaoyang",
    "title": "律吕调阳",
    "source": "《史记·律书》",
    "sourceText": "六律六吕，十二律也......律者，所以通气制度也。",
    "interpretation": "古代将音律分为六律（阳）六吕（阴），合称十二律。古人认为音律与天地阴阳之气相通，可以用来调和天时。",
    "image": null,
    "imageSource": null
  }
]
```

**Note:** More allusion entries should be added as the full dataset is populated. Not every phrase has a notable allusion — only those with clear literary sources need entries.

- [ ] **Step 4: Run data validation tests**

```bash
npx vitest run tests/data/characters.spec.js
```

Expected: All tests pass (once all 250 entries are populated). During initial development with a subset, temporarily adjust the "has 250 entries" assertion to match the current count, then restore to 250 before final commit.

- [ ] **Step 5: Commit**

```bash
git add src/data/characters.json src/data/allusions.json tests/data/characters.spec.js
git commit -m "feat: add character and allusion data with validation tests"
```

---

## Task 4: CharCell Component

**Files:**
- Create: `src/components/CharCell.vue`
- Test: `tests/components/CharCell.spec.js`

- [ ] **Step 1: Write failing test for CharCell**

Create `tests/components/CharCell.spec.js`:

```js
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
```

Run: `npx vitest run tests/components/CharCell.spec.js`
Expected: FAIL.

- [ ] **Step 2: Implement CharCell component**

Write `src/components/CharCell.vue`:

```vue
<template>
  <div
    class="char-cell"
    :class="{ active: hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('select', char.id)"
  >
    <div class="char-chars">
      <ruby v-for="(ch, i) in char.text" :key="i">
        {{ ch }}<rt>{{ char.pinyin[i] }}</rt>
      </ruby>
    </div>
    <div v-if="hovered" class="tooltip">{{ char.briefMeaning }}</div>
    <div v-if="showMeaning" class="brief-meaning">{{ char.briefMeaning }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  char: { type: Object, required: true },
  showMeaning: { type: Boolean, default: false },
})

defineEmits(['select'])

const hovered = ref(false)
</script>

<style scoped>
.char-cell {
  text-align: center;
  padding: 10px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.char-cell:hover,
.char-cell.active {
  background: var(--subtle);
}

.char-chars {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.char-chars ruby {
  font-size: 26px;
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}

.char-chars rt {
  font-size: 11px;
  color: var(--accent);
  font-family: system-ui, sans-serif;
  ruby-align: center;
}

.tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tooltip-bg);
  color: var(--tooltip-text);
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid var(--tooltip-bg);
}

.brief-meaning {
  font-size: 11px;
  color: var(--accent);
  margin-top: 4px;
  opacity: 0.7;
}
</style>
```

Run: `npx vitest run tests/components/CharCell.spec.js`
Expected: All 5 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharCell.vue tests/components/CharCell.spec.js
git commit -m "feat: add CharCell component with ruby pinyin and hover tooltip"
```

---

## Task 5: CharDetail Component

**Files:**
- Create: `src/components/CharDetail.vue`
- Test: `tests/components/CharDetail.spec.js`

- [ ] **Step 1: Write failing test for CharDetail**

Create `tests/components/CharDetail.spec.js`:

```js
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
```

Run: `npx vitest run tests/components/CharDetail.spec.js`
Expected: FAIL.

- [ ] **Step 2: Implement CharDetail component**

Write `src/components/CharDetail.vue`:

```vue
<template>
  <div class="char-detail">
    <div class="detail-title">
      <ruby v-for="(ch, i) in char.text" :key="i">
        {{ ch }}<rt>{{ char.pinyin[i] }}</rt>
      </ruby>
    </div>

    <div class="annotation-grid">
      <div v-for="a in char.charAnnotations" :key="a.char" class="annotation-card">
        <div class="anno-char">{{ a.char }}</div>
        <div class="anno-meaning">{{ a.meaning }}</div>
      </div>
    </div>

    <div class="full-explanation">{{ char.fullExplanation }}</div>

    <router-link
      v-if="char.allusionId"
      :to="'/allusion/' + char.allusionId"
      class="allusion-link"
    >
      典故出处 →
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  char: { type: Object, required: true },
})
</script>

<style scoped>
.char-detail {
  background: var(--subtle);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border);
}

.detail-title {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-title ruby {
  font-size: 32px;
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}

.detail-title rt {
  font-size: 12px;
  color: var(--accent);
}

.annotation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.annotation-card {
  text-align: center;
  padding: 8px;
  background: color-mix(in srgb, var(--bg) 60%, transparent);
  border-radius: 6px;
}

.anno-char {
  font-size: 24px;
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}

.anno-meaning {
  font-size: 12px;
  color: var(--accent);
  margin-top: 4px;
}

.full-explanation {
  font-size: 14px;
  color: var(--text);
  line-height: 1.8;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  opacity: 0.85;
}

.allusion-link {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 14px;
  background: var(--accent);
  color: var(--bg);
  border-radius: 6px;
  font-size: 13px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.allusion-link:hover {
  opacity: 0.85;
}

@media (max-width: 519px) {
  .annotation-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
```

Run: `npx vitest run tests/components/CharDetail.spec.js`
Expected: All 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharDetail.vue tests/components/CharDetail.spec.js
git commit -m "feat: add CharDetail component with annotations and allusion link"
```

---

## Task 6: CharGrid Component

**Files:**
- Create: `src/components/CharGrid.vue`
- Modify: `src/App.vue`
- Test: `tests/components/CharGrid.spec.js`

- [ ] **Step 1: Write failing test for CharGrid**

Create `tests/components/CharGrid.spec.js`:

```js
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

// Stub CharCell and CharDetail to isolate CharGrid logic
const stubs = {
  CharCell: {
    template: '<div class="char-cell-stub" @click="$emit(\'select\', char.id)">{{ char.text }}</div>',
    props: ['char', 'showMeaning'],
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
}

describe('CharGrid', () => {
  it('renders a CharCell for each character entry', () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs, provide: {} },
    })
    const cells = wrapper.findAll('.char-cell-stub')
    expect(cells).toHaveLength(2)
    expect(cells[0].text()).toBe('天地玄黄')
    expect(cells[1].text()).toBe('宇宙洪荒')
  })

  it('shows CharDetail when a cell is selected', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs, provide: {} },
    })
    expect(wrapper.find('.char-detail-stub').exists()).toBe(false)
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(true)
    expect(wrapper.find('.char-detail-stub').text()).toBe('天地玄黄')
  })

  it('collapses when the same cell is clicked again', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs, provide: {} },
    })
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(true)
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').exists()).toBe(false)
  })

  it('switches detail when a different cell is clicked', async () => {
    const wrapper = mount(CharGrid, {
      props: { characters: mockChars },
      global: { stubs, provide: {} },
    })
    await wrapper.findAll('.char-cell-stub')[0].trigger('click')
    expect(wrapper.find('.char-detail-stub').text()).toBe('天地玄黄')
    await wrapper.findAll('.char-cell-stub')[1].trigger('click')
    expect(wrapper.find('.char-detail-stub').text()).toBe('宇宙洪荒')
  })
})
```

Run: `npx vitest run tests/components/CharGrid.spec.js`
Expected: FAIL.

- [ ] **Step 2: Implement CharGrid component**

Write `src/components/CharGrid.vue`:

```vue
<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">千字文</h1>
      <ThemeSwitch />
    </header>

    <div class="grid">
      <template v-for="char in characters" :key="char.id">
        <CharCell
          :char="char"
          :show-meaning="isMobile"
          @select="toggleDetail"
        />
        <div
          v-if="selectedId === char.id && isRowEnd(char.id)"
          class="detail-row"
        >
          <CharDetail :char="selectedChar" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CharCell from './CharCell.vue'
import CharDetail from './CharDetail.vue'
import ThemeSwitch from './ThemeSwitch.vue'

import charactersData from '../data/characters.json'

const props = defineProps({
  characters: { type: Array, default: () => charactersData },
})

const selectedId = ref(null)
const columns = ref(4)
const isMobile = ref(false)

function updateLayout() {
  const w = window.innerWidth
  if (w < 360) {
    columns.value = 1
  } else if (w < 520) {
    columns.value = 2
  } else {
    columns.value = 4
  }
  isMobile.value = w < 520
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
})

const selectedChar = computed(() => {
  if (!selectedId.value) return null
  return props.characters.find(c => c.id === selectedId.value) || null
})

function toggleDetail(id) {
  selectedId.value = selectedId.value === id ? null : id
}

function isRowEnd(id) {
  const index = props.characters.findIndex(c => c.id === id)
  const posInRow = index % columns.value
  const isLast = posInRow === columns.value - 1 || index === props.characters.length - 1

  if (selectedId.value === null) return false
  const selectedIndex = props.characters.findIndex(c => c.id === selectedId.value)
  const selectedRow = Math.floor(selectedIndex / columns.value)
  const currentRow = Math.floor(index / columns.value)

  return currentRow === selectedRow && isLast
}
</script>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 24px;
  color: var(--text);
  letter-spacing: 6px;
  margin: 0;
  font-weight: 400;
}

.grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: 12px;
}

.detail-row {
  grid-column: 1 / -1;
}
</style>
```

Run: `npx vitest run tests/components/CharGrid.spec.js`
Expected: All 4 tests pass.

- [ ] **Step 3: Wire up App.vue with data loading**

Replace `src/App.vue`:

```vue
<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
.app {
  min-height: 100vh;
  background: var(--bg);
  transition: background 0.3s;
}
</style>
```

Update `src/router/index.js` to pass characters as props:

```js
import { createRouter, createWebHistory } from 'vue-router'
import CharGrid from '../components/CharGrid.vue'

const routes = [
  { path: '/', component: CharGrid },
  {
    path: '/allusion/:id',
    component: () => import('../pages/AllusionPage.vue'),
    props: true,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

- [ ] **Step 4: Write main.css global styles**

Write `src/styles/main.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  transition: background 0.3s, color 0.3s;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Open browser → should see the grid with all populated characters, ruby pinyin, hover tooltips, theme switching.

- [ ] **Step 6: Commit**

```bash
git add src/components/CharGrid.vue src/App.vue src/router/index.js src/styles/main.css tests/components/CharGrid.spec.js
git commit -m "feat: add CharGrid with responsive layout and wire up App"
```

---

## Task 7: AllusionPage Component

**Files:**
- Create: `src/pages/AllusionPage.vue`
- Test: `tests/pages/AllusionPage.spec.js`

- [ ] **Step 1: Write failing test for AllusionPage**

Create `tests/pages/AllusionPage.spec.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AllusionPage from '../../src/pages/AllusionPage.vue'

const stubs = {
  RouterLink: {
    template: '<a :href="to" class="back-link"><slot/></a>',
    props: ['to'],
  },
}

// Mock the allusions.json import
const mockAllusion = {
  id: 'tianxuandihuang',
  title: '天玄地黄',
  source: '《易经·坤卦》文言',
  sourceText: '夫玄黄者，天地之杂也，天玄而地黄。',
  interpretation: '语出《易经》坤卦文言。',
  image: null,
  imageSource: null,
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

  it('hides image section when image is null', () => {
    const wrapper = mount(AllusionPage, {
      props: { id: 'tianxuandihuang' },
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
```

Run: `npx vitest run tests/pages/AllusionPage.spec.js`
Expected: FAIL.

- [ ] **Step 2: Implement AllusionPage component**

Write `src/pages/AllusionPage.vue`:

```vue
<template>
  <div class="allusion-page">
    <div v-if="allusion" class="allusion-content">
      <router-link to="/" class="back-link">← 返回全文</router-link>

      <h2 class="allusion-title">{{ allusion.title }}</h2>
      <div class="allusion-source">出自 {{ allusion.source }}</div>

      <blockquote class="source-quote">
        "{{ allusion.sourceText }}"
      </blockquote>

      <div class="allusion-interpretation">
        {{ allusion.interpretation }}
      </div>

      <div v-if="allusion.image" class="allusion-image">
        <img
          :src="getImageUrl(allusion.image)"
          :alt="allusion.title"
          loading="lazy"
        />
        <div v-if="allusion.imageSource" class="image-source">
          图片来源：{{ allusion.imageSource }}
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>未找到该典故</p>
      <router-link to="/" class="back-link">← 返回全文</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import allusions from '../data/allusions.json'

const props = defineProps({
  id: { type: String, required: true },
})

const allusion = computed(() => {
  return allusions.find(a => a.id === props.id) || null
})

function getImageUrl(path) {
  return new URL(`../assets/${path}`, import.meta.url).href
}
</script>

<style scoped>
.allusion-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  background: var(--bg);
}

.back-link {
  display: inline-block;
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 20px;
}

.allusion-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 28px;
  color: var(--text);
  font-weight: 400;
  margin-bottom: 6px;
}

.allusion-source {
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 20px;
}

.source-quote {
  background: var(--subtle);
  border-left: 3px solid var(--accent);
  padding: 16px 20px;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 18px;
  color: var(--text);
  line-height: 1.8;
  margin-bottom: 20px;
  border-radius: 0 8px 8px 0;
}

.allusion-interpretation {
  font-size: 15px;
  color: var(--text);
  line-height: 1.8;
  opacity: 0.85;
  margin-bottom: 24px;
}

.allusion-image img {
  width: 100%;
  border-radius: 8px;
}

.image-source {
  font-size: 12px;
  color: var(--accent);
  text-align: center;
  margin-top: 8px;
  opacity: 0.7;
}

.not-found {
  text-align: center;
  padding-top: 80px;
  color: var(--accent);
}
</style>
```

Run: `npx vitest run tests/pages/AllusionPage.spec.js`
Expected: All 7 tests pass.

- [ ] **Step 3: Verify allusion page in browser**

```bash
npm run dev
```

Click a phrase that has an allusion → click "典故出处 →" → should navigate to allusion detail page with source quote, interpretation, and back link.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AllusionPage.vue tests/pages/AllusionPage.spec.js
git commit -m "feat: add AllusionPage with lazy loading and source display"
```

---

## Task 8: Global Styles & Mobile Polish

**Files:**
- Modify: `src/styles/main.css`, `src/components/CharCell.vue`, `src/components/CharGrid.vue`

- [ ] **Step 1: Add responsive grid and typography to main.css**

Append to `src/styles/main.css`:

```css
/* Smooth transitions for theme changes */
*,
*::before,
*::after {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

/* Ruby alignment fix for different browsers */
ruby {
  ruby-align: center;
}

rt {
  font-size: 0.45em;
}

/* Scrollbar styling for dark theme */
[data-theme="dark"] ::-webkit-scrollbar {
  width: 8px;
}

[data-theme="dark"] ::-webkit-scrollbar-track {
  background: #16213e;
}

[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: #c4a36e;
  border-radius: 4px;
}
```

- [ ] **Step 2: Add touch-friendly mobile handling to CharCell**

Add long-press support for mobile tooltip. Append to `CharCell.vue` `<script setup>`:

```js
import { ref, onMounted, onUnmounted } from 'vue'

// ... existing code ...

const cellRef = ref(null)
let pressTimer = null

function onTouchStart() {
  pressTimer = setTimeout(() => {
    hovered.value = true
  }, 500)
}

function onTouchEnd() {
  clearTimeout(pressTimer)
  // Keep tooltip visible briefly on mobile
  setTimeout(() => {
    hovered.value = false
  }, 2000)
}
```

Add `ref="cellRef"`, `@touchstart.passive="onTouchStart"`, `@touchend="onTouchEnd"` to the root div in the template.

- [ ] **Step 3: Add expand/collapse animation to CharGrid**

Wrap the detail row in CharGrid with a Transition. Add to `CharGrid.vue`:

In template, wrap the detail-row div:

```vue
<Transition name="expand">
  <div
    v-if="selectedId === char.id && isRowEnd(char.id)"
    class="detail-row"
  >
    <CharDetail :char="selectedChar" />
  </div>
</Transition>
```

Add transition styles to `CharGrid.vue` scoped CSS:

```css
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
}
```

- [ ] **Step 4: Verify responsive behavior in browser**

```bash
npm run dev
```

Test in browser DevTools:
- Desktop (>= 520px): 4 columns, hover tooltips
- Tablet (360-519px): 2 columns, brief meaning visible
- Phone (< 360px): 1 column
- Theme switching works across all sizes
- Expand/collapse animates smoothly
- Allusion page renders correctly on all sizes

- [ ] **Step 5: Commit**

```bash
git add src/styles/main.css src/components/CharCell.vue src/components/CharGrid.vue
git commit -m "feat: add mobile polish, touch handling, and expand animation"
```

---

## Task 9: Complete Data Population

**Files:**
- Modify: `src/data/characters.json`, `src/data/allusions.json`

This task populates the remaining entries in `characters.json` (all 250 phrases) and adds allusion entries for phrases with notable literary sources.

- [ ] **Step 1: Populate characters.json with all 250 entries**

The source text is in `千字文.md` — every line is one 4-character phrase (separated by Chinese comma into pairs). Parse each line and create entries following the schema from Task 3 Step 2.

Key requirements:
- All pinyin must use correct tone marks (not numbers)
- `briefMeaning` should be one sentence, plain Chinese
- `charAnnotations` must have exactly 4 entries matching each character
- `fullExplanation` should be 1-2 sentences explaining the phrase in context
- `allusionId` links to allusions.json; set to `null` if no notable allusion

- [ ] **Step 2: Add allusion entries for notable phrases**

Notable allusions to include (non-exhaustive, add as scholarly sources are identified):

- 推位让国 / 有虞陶唐 — 尧舜禅让
- 吊民伐罪 / 周发殷汤 — 商汤伐夏、武王伐商
- 墨悲丝染 — 墨子泣丝
- 诗赞羔羊 — 《诗经·召南·羔羊》
- 景行维贤 — 《诗经·小雅·车舝》
- 磻溪伊尹 — 姜太公渭水垂钓、伊尹辅商
- 桓公匡合 — 齐桓公九合诸侯
- 起翦颇牧 — 白起、王翦、廉颇、李牧
- 孟轲敦素 / 史鱼秉直 — 孟子、史鱼尸谏
- 毛施淑姿 — 毛嫱、西施
- 布射僚丸 — 吕布辕门射戟、宜僚弄丸

Each entry needs `source`, `sourceText`, and `interpretation`.

- [ ] **Step 3: Run data validation**

```bash
npx vitest run tests/data/characters.spec.js
```

Expected: All tests pass, including "has 250 entries".

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Final browser verification**

```bash
npm run dev
```

Scroll through all 250 phrases, spot-check:
- Pinyin alignment and accuracy
- Hover tooltips
- Expand detail panels
- Allusion links navigate correctly
- Theme switching
- Mobile responsiveness

- [ ] **Step 6: Commit**

```bash
git add src/data/characters.json src/data/allusions.json
git commit -m "feat: populate complete character and allusion dataset"
```

- [ ] **Step 7: Delete smoke test**

```bash
rm tests/smoke.spec.js
git add -u tests/smoke.spec.js
git commit -m "chore: remove smoke test scaffold"
```
