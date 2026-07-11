import { useCallback, useState } from 'react'
import { audioEngine } from './audioEngine'

/** Ensures the Tone.js AudioContext is started (must happen from a user gesture) before any sound plays. */
export function useAudioEngine() {
  const [ready, setReady] = useState(audioEngine.isReady)

  const ensureStarted = useCallback(async () => {
    if (!audioEngine.isReady) {
      await audioEngine.start()
      setReady(true)
    }
  }, [])

  return { engine: audioEngine, ready, ensureStarted }
}
