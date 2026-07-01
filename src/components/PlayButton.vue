<template>
  <button
    class="play-btn"
    :class="[playing && 'is-playing', size && `play-btn--${size}`]"
    @click.stop="$emit('play', src)"
    :title="playing ? '停止' : '播放'"
  >
    <svg v-if="!playing" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5L11.5 7L3 12.5V1.5Z" fill="currentColor"/>
    </svg>
    <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1.5" width="3.5" height="11" rx="1" fill="currentColor"/>
      <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" fill="currentColor"/>
    </svg>
  </button>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  playing: { type: Boolean, default: false },
  size: { type: String, default: null },
})

defineEmits(['play'])
</script>

<style scoped>
.play-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--subtle);
  color: var(--accent);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.play-btn:hover {
  background: var(--border);
}

.play-btn.is-playing {
  color: var(--text);
  background: var(--border);
}

.play-btn--small {
  width: 18px;
  height: 18px;
}

.play-btn--small svg {
  width: 10px;
  height: 10px;
}
</style>
