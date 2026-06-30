<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">千字文</h1>
      <ThemeSwitch />
    </header>

    <div class="grid" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)` }">
      <template v-for="(char, index) in characters" :key="char.id">
        <CharCell
          :char="char"
          :show-meaning="isMobile"
          @select="toggleDetail"
        />
        <Transition name="expand">
          <div
            v-if="isRowEnd(index)"
            class="detail-row"
          >
            <CharDetail :char="selectedChar" />
          </div>
        </Transition>
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

function isRowEnd(index) {
  if (selectedId.value === null) return false
  const selectedIndex = props.characters.findIndex(c => c.id === selectedId.value)
  const selectedRow = Math.floor(selectedIndex / columns.value)
  const currentRow = Math.floor(index / columns.value)
  const isLastInRow = (index % columns.value === columns.value - 1) || index === props.characters.length - 1

  return currentRow === selectedRow && isLastInRow
}
</script>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px 16px calc(20px + env(safe-area-inset-bottom, 0px));
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
  gap: 12px;
}

.detail-row {
  grid-column: 1 / -1;
}

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
</style>
