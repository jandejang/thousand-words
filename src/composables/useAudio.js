import { ref } from 'vue'

const BASE = import.meta.env.BASE_URL

export function useAudio() {
  const playing = ref(false)
  const currentSrc = ref(null)
  let audio = null

  function stop() {
    if (audio) {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio = null
    }
    playing.value = false
    currentSrc.value = null
  }

  function onEnded() {
    stop()
  }

  function onError() {
    stop()
  }

  function toggle(src) {
    if (playing.value && currentSrc.value === src) {
      stop()
      return Promise.resolve()
    }

    stop()
    currentSrc.value = src

    return new Promise((resolve) => {
      audio = new Audio(src)
      audio.addEventListener('ended', () => { onEnded(); resolve() })
      audio.addEventListener('error', () => { onError(); resolve() })
      playing.value = true
      audio.play().catch(() => { onError(); resolve() })
    })
  }

  function buildCharUrl(lang, char) {
    return `${BASE}audio/${lang}/char/${char}.mp3`
  }

  function buildPhraseUrl(lang, phraseId) {
    return `${BASE}audio/${lang}/phrase/${phraseId}.mp3`
  }

  return { playing, currentSrc, toggle, stop, buildCharUrl, buildPhraseUrl }
}
