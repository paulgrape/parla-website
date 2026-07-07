import {isSoundEnabled} from '@/hooks/useSoundEnabled'

export type SoundName = 'click' | 'correct' | 'wrong'

const SOUNDS: SoundName[] = ['click', 'correct', 'wrong']

let audioContext: AudioContext | null = null
const buffers = new Map<SoundName, AudioBuffer>()
let preloadPromise: Promise<void> | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

async function ensureContextRunning() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

export function preloadSounds(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  if (!preloadPromise) {
    preloadPromise = (async () => {
      const ctx = getAudioContext()
      await Promise.all(
        SOUNDS.map(async name => {
          const response = await fetch(`/sounds/${name}.ogg`)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = await ctx.decodeAudioData(arrayBuffer)
          buffers.set(name, buffer)
        })
      )
    })().catch(() => {})
  }

  return preloadPromise
}

async function playSoundAsync(name: SoundName) {
  try {
    await preloadSounds()
    await ensureContextRunning()

    const buffer = buffers.get(name)
    if (!buffer) return

    const source = getAudioContext().createBufferSource()
    source.buffer = buffer
    source.connect(getAudioContext().destination)
    source.start(0)
  } catch {}
}

export function playSound(name: SoundName) {
  if (typeof window === 'undefined' || !isSoundEnabled()) return
  void playSoundAsync(name)
}
