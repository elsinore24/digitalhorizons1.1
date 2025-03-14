import { createContext, useState, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import dialogueData from '../data/dialogue.json'

export const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const audioRef = useRef(null)
  const narrationQueue = useRef([])
  const soundsCache = useRef({})

  const playNarration = useCallback(async (dialogueId, onComplete = null) => {
    // Stop current narration if playing
    if (audioRef.current) {
      audioRef.current.stop()
    }

    // Get dialogue data
    const dialogue = dialogueData[dialogueId]
    if (!dialogue) {
      console.error(`Dialogue ID "${dialogueId}" not found`)
      if (onComplete) onComplete()
      return
    }

    // Set current dialogue for UI display
    setCurrentDialogue(dialogue)

    // Create new audio element
    const audio = new Audio(`/audio/${dialogueId}.mp3`)
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentDialogue(null)
      if (onComplete) onComplete()
      playNextInQueue()
    })

    try {
      await audio.play()
      audioRef.current = audio
      setCurrentTrack(dialogueId)
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to play audio:', err)
      setIsPlaying(false)
      setCurrentDialogue(null)
    }
  }, [])

  const queueNarration = useCallback((dialogueId) => {
    narrationQueue.current.push(dialogueId)
    
    if (!isPlaying) {
      playNextInQueue()
    }
  }, [isPlaying])

  const playNextInQueue = useCallback(() => {
    if (narrationQueue.current.length > 0) {
      const nextTrack = narrationQueue.current.shift()
      playNarration(nextTrack)
    }
  }, [playNarration])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setCurrentTrack(null)
      setCurrentDialogue(null)
    }
  }, [])

  const value = {
    playNarration,
    queueNarration,
    stopAudio,
    isPlaying,
    currentTrack,
    currentDialogue
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}
