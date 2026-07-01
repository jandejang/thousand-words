<template>
  <div class="pron-switch">
    <button class="pron-toggle" @click="open = !open">
      {{ currentLabel }} ▾
    </button>
    <div v-if="open" class="pron-dropdown">
      <button
        v-for="l in languages"
        :key="l.key"
        class="pron-option"
        :class="{ active: current === l.key }"
        @click="select(l.key)"
      >
        {{ l.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePronunciation } from '../composables/usePronunciation.js'

const { current, languages, setLanguage } = usePronunciation()
const open = ref(false)

const currentLabel = computed(() => {
  const l = languages.find(l => l.key === current.value)
  return l ? l.label : ''
})

function select(key) {
  setLanguage(key)
  open.value = false
}
</script>

<style scoped>
.pron-switch {
  position: relative;
}

.pron-toggle {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: none;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.pron-toggle:hover {
  background: var(--subtle);
}

.pron-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.pron-option {
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

.pron-option:hover {
  background: var(--subtle);
}

.pron-option.active {
  color: var(--accent);
  font-weight: bold;
}
</style>
