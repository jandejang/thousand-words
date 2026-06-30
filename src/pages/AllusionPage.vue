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
  padding: 24px 16px calc(24px + env(safe-area-inset-bottom, 0px));
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
