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
        <span class="theme-swatch" :style="{ background: t.bg, color: t.text, borderColor: t.accent }">
          文
        </span>
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
  display: flex;
  align-items: center;
  gap: 10px;
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

.theme-swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1.5px solid;
  font-size: 14px;
  font-family: "Noto Serif SC", serif;
  flex-shrink: 0;
}

.theme-option:hover {
  background: var(--subtle);
}

.theme-option.active {
  color: var(--accent);
  font-weight: bold;
}
</style>
