<template>
  <div class="char-detail">
    <div class="detail-header">
      <div class="detail-title">
        <ruby v-for="(ch, i) in char.text" :key="i">
          {{ ch }}<rt>{{ displayPinyin[i] }}</rt>
        </ruby>
      </div>
      <PlayButton
        :src="audio.buildPhraseUrl(currentLang, char.id)"
        :playing="audio.playing.value && audio.currentSrc.value === audio.buildPhraseUrl(currentLang, char.id)"
        @play="audio.toggle($event)"
      />
    </div>

    <div class="annotation-grid">
      <div v-for="(a, i) in char.charAnnotations" :key="a.char" class="annotation-card">
        <div class="anno-top">
          <div class="anno-char">{{ a.char }}</div>
          <PlayButton
            size="small"
            :src="audio.buildCharUrl(currentLang, a.char)"
            :playing="audio.playing.value && audio.currentSrc.value === audio.buildCharUrl(currentLang, a.char)"
            @play="audio.toggle($event)"
          />
        </div>
        <div class="anno-pinyin">{{ displayPinyin[i] }}</div>
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
import { computed } from 'vue'
import { usePronunciation } from '../composables/usePronunciation.js'
import { useAudio } from '../composables/useAudio.js'
import PlayButton from './PlayButton.vue'

const props = defineProps({
  char: { type: Object, required: true },
})

const { current: currentLang, pinyinField } = usePronunciation()
const audio = useAudio()

const displayPinyin = computed(() => {
  const field = pinyinField.value
  const arr = props.char[field]
  if (arr && arr.every(p => p !== '')) return arr
  return props.char.pinyin
})
</script>

<style scoped>
.char-detail {
  background: var(--subtle);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border);
}

.detail-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-title {
  display: flex;
  justify-content: center;
  gap: 16px;
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

.anno-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.anno-char {
  font-size: 24px;
  color: var(--text);
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
}

.anno-pinyin {
  font-size: 11px;
  color: var(--accent);
  margin-top: 2px;
  opacity: 0.7;
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
