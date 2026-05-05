import { useState, useCallback } from 'react'
import { problems } from '../data/problems'
import { analytics } from '../utils/analytics'

// phases: PLAYING | COMPLETE | SUBMITTED
export function useGameState() {
  const [phase, setPhase] = useState('PLAYING')
  const [foundIds, setFoundIds] = useState(new Set())
  const [supplierCount, setSupplierCount] = useState(100)
  const [gameStarted, setGameStarted] = useState(false)

  const revealProblem = useCallback((id) => {
    if (phase !== 'PLAYING') return
    if (foundIds.has(id)) return

    if (!gameStarted) {
      analytics.track('game_started')
      setGameStarted(true)
    }

    const problem = problems.find((p) => p.id === id)
    analytics.track('problem_found', { problemId: id, problemLabel: problem?.label })

    setFoundIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      if (next.size === problems.length) {
        // defer phase change so the card animation runs first
        setTimeout(() => {
          setPhase('COMPLETE')
        }, 400)
      }
      return next
    })
  }, [phase, foundIds, gameStarted])

  const submitEmail = useCallback(() => {
    setPhase('SUBMITTED')
  }, [])

  return {
    phase,
    foundIds,
    supplierCount,
    setSupplierCount,
    revealProblem,
    submitEmail,
    foundCount: foundIds.size,
    totalProblems: problems.length,
  }
}
