<template>
  <div
    class="char-cell"
    :class="{ active: hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('select', char.id)"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
  >
    <span v-if="char.allusionId" class="allusion-badge" title="有典故">典</span>
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

let pressTimer = null

function onTouchStart() {
  pressTimer = setTimeout(() => {
    hovered.value = true
  }, 500)
}

function onTouchEnd() {
  clearTimeout(pressTimer)
  setTimeout(() => {
    hovered.value = false
  }, 2000)
}
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

.allusion-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--accent);
  color: var(--bg);
  font-size: 10px;
  font-family: "Noto Serif SC", serif;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  pointer-events: none;
}

.char-cell:hover .allusion-badge {
  opacity: 0.8;
}

.brief-meaning {
  font-size: 11px;
  color: var(--accent);
  margin-top: 4px;
  opacity: 0.7;
}
</style>
