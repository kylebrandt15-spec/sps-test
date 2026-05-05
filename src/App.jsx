import { useRef, useEffect, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Hero from './components/Hero'
import GameBoard from './components/GameBoard'
import SupplierSlider from './components/SupplierSlider'
import { useGameState } from './hooks/useGameState'
import { analytics } from './utils/analytics'
import { computeTotal } from './data/costs'

const CostBreakdown = lazy(() => import('./components/CostBreakdown'))
const EmailGate = lazy(() => import('./components/EmailGate'))
const ConfirmationView = lazy(() => import('./components/ConfirmationView'))

export default function App() {
  const { phase, foundIds, supplierCount, setSupplierCount, revealProblem, submitEmail } =
    useGameState()
  const resultsRef = useRef(null)

  // Scroll to results when game completes
  useEffect(() => {
    if (phase === 'COMPLETE') {
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Fire game_completed event once
  const completedFired = useRef(false)
  useEffect(() => {
    if (phase === 'COMPLETE' && !completedFired.current) {
      completedFired.current = true
      analytics.track('game_completed', {
        supplierCount,
        totalCost: computeTotal(supplierCount),
      })
    }
  }, [phase, supplierCount])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Hero />

      <main
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
        <GameBoard
          foundIds={foundIds}
          onReveal={revealProblem}
          phase={phase}
          supplierCount={supplierCount}
        />

        <SupplierSlider value={supplierCount} onChange={setSupplierCount} />

        {/* Results section — visible in COMPLETE and SUBMITTED phases */}
        {(phase === 'COMPLETE' || phase === 'SUBMITTED') && (
          <div ref={resultsRef}>
            <Suspense fallback={<LoadingPlaceholder />}>
              <CostBreakdown supplierCount={supplierCount} />
            </Suspense>

            <AnimatePresence mode="wait">
              {phase === 'COMPLETE' && (
                <motion.div key="email-gate" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <EmailGate supplierCount={supplierCount} onSubmit={submitEmail} />
                  </Suspense>
                </motion.div>
              )}

              {phase === 'SUBMITTED' && (
                <motion.div key="confirmation">
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <ConfirmationView />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e5e5',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '11px', color: '#bbb' }}>
            © {new Date().getFullYear()} SPS Commerce. Cost estimates are illustrative based on
            industry research and SPS network data.
          </p>
        </footer>
      </main>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        height: '120px',
        marginTop: '1.5rem',
        opacity: 0.5,
      }}
    />
  )
}
