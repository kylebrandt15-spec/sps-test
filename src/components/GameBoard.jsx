import { problems } from '../data/problems'
import ProblemCard from './ProblemCard'
import ProgressBar from './ProgressBar'

export default function GameBoard({ foundIds, onReveal, phase, supplierCount }) {
  const locked = phase !== 'PLAYING'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
      }}
    >
      {/* Section header */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#666',
          marginBottom: '1rem',
        }}
      >
        Your Current State — Manual Supplier Operations
      </p>

      {/* Context bar */}
      <div
        style={{
          borderLeft: '3px solid #0C447C',
          background: '#EBF3FF',
          borderRadius: '0 8px 8px 0',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
        }}
      >
        <p style={{ fontSize: '13px', color: '#185FA5', lineHeight: 1.6, marginBottom: '4px' }}>
          The reality: 2–3 hrs per supplier just to identify the right contact. 5+ hrs of onboarding
          conversations per supplier to go live. 70% will have questions that need answers quickly.
          25% have never done EDI before.
        </p>
        <p style={{ fontSize: '11px', color: '#888' }}>
          Source: SPS Commerce supplier enablement data, 2026
        </p>
      </div>

      <ProgressBar found={foundIds.size} total={problems.length} />

      {/* Instructions — only shown during play */}
      {phase === 'PLAYING' && (
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '1rem', fontStyle: 'italic' }}>
          Click each card to reveal the hidden cost.
        </p>
      )}

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
        }}
      >
        {problems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            found={foundIds.has(problem.id)}
            onReveal={onReveal}
            locked={locked}
            supplierCount={supplierCount}
          />
        ))}
      </div>
    </div>
  )
}
