<template>
  <div class="page">
    <header class="page-header">
      <h1 class="page-title">千字文</h1>
      <div class="header-controls">
        <PronunciationSwitch />
        <ThemeSwitch />
      </div>
    </header>

    <div class="grid-scroll">
      <div class="groups-container">
        <section v-for="group in groupedData" :key="group.id" class="group">
          <div class="group-header" @click="toggleGroup(group.id)">
            <div class="group-info">
              <h2 class="group-title">{{ group.title }}</h2>
              <span class="group-subtitle">{{ group.subtitle }}</span>
            </div>
            <span class="group-toggle" :class="{ collapsed: !expandedGroups.has(group.id) }">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <Transition
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave"
            @leave="onLeave"
          >
          <div v-if="expandedGroups.has(group.id)" class="grid" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)` }">
            <template v-for="(char, index) in group.chars" :key="char.id">
              <CharCell
                :char="char"
                :show-meaning="isMobile"
                :has-image="imageAllusionIds.has(char.allusionId)"
                @select="toggleDetail"
              />
              <Transition name="expand">
                <div
                  v-if="isRowEnd(group.chars, index)"
                  class="detail-row"
                >
                  <CharDetail :char="selectedChar" />
                </div>
              </Transition>
            </template>
          </div>
          </Transition>
        </section>
      </div>
      <div class="safe-area-spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CharCell from './CharCell.vue'
import CharDetail from './CharDetail.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import PronunciationSwitch from './PronunciationSwitch.vue'
import charactersData from '../data/characters.json'
import allusionsData from '../data/allusions.json'
import groupsData from '../data/groups.json'

const imageAllusionIds = new Set(
  allusionsData.filter(a => a.image).map(a => a.id)
)

const props = defineProps({
  characters: { type: Array, default: () => charactersData },
})

const selectedId = ref(null)
const columns = ref(4)
const isMobile = ref(false)
const expandedGroups = ref(new Set([groupsData[0].id]))

const groupedData = computed(() => {
  return groupsData.map(g => ({
    ...g,
    chars: props.characters.filter(c => c.id >= g.startId && c.id <= g.endId),
  }))
})

function toggleGroup(groupId) {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value = new Set()
  } else {
    expandedGroups.value = new Set([groupId])
  }
  selectedId.value = null
}

function updateLayout() {
  const w = window.innerWidth
  columns.value = w < 520 ? 2 : 4
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

function onBeforeEnter(el) {
  el.style.overflow = 'hidden'
  el.style.height = '0'
  el.style.opacity = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
}

function onEnter(el, done) {
  el.offsetHeight
  el.style.transition = 'all 0.3s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.paddingTop = ''
  el.style.paddingBottom = ''
  el.addEventListener('transitionend', done, { once: true })
}

function onAfterEnter(el) {
  el.style.height = ''
  el.style.overflow = ''
  el.style.transition = ''
}

function onBeforeLeave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.overflow = 'hidden'
  el.offsetHeight
}

function onLeave(el, done) {
  el.style.transition = 'all 0.3s ease'
  el.style.height = '0'
  el.style.opacity = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.addEventListener('transitionend', done, { once: true })
}

function isRowEnd(chars, index) {
  if (selectedId.value === null) return false
  const selectedIndex = chars.findIndex(c => c.id === selectedId.value)
  if (selectedIndex === -1) return false
  const selectedRow = Math.floor(selectedIndex / columns.value)
  const currentRow = Math.floor(index / columns.value)
  const isLastInRow = (index % columns.value === columns.value - 1) || index === chars.length - 1
  return currentRow === selectedRow && isLastInRow
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  padding: calc(20px + env(safe-area-inset-top, 0px)) 16px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 24px;
  color: var(--text);
  letter-spacing: 6px;
  margin: 0;
  font-weight: 400;
}

.grid-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.groups-container {
  max-width: 780px;
  margin: 0 auto;
  width: 100%;
  padding: 8px 16px 0;
}

.group {
  margin-bottom: 4px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  user-select: none;
}

.group-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.group-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  font-size: 16px;
  color: var(--text);
  font-weight: 400;
  margin: 0;
  letter-spacing: 2px;
}

.group-subtitle {
  font-size: 12px;
  color: var(--accent);
  opacity: 0.6;
}

.group-toggle {
  color: var(--accent);
  opacity: 0.5;
  transition: transform 0.2s;
  display: flex;
}

.group-toggle.collapsed {
  transform: rotate(-90deg);
}

.group-header:hover .group-toggle {
  opacity: 0.8;
}

.grid {
  display: grid;
  gap: 12px;
  padding: 12px 0;
}

@media (max-width: 519px) {
  .grid {
    gap: 4px;
  }
}

.safe-area-spacer {
  flex-shrink: 0;
  height: max(16px, env(safe-area-inset-bottom, 16px));
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
