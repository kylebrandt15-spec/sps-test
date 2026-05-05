import { motion } from 'framer-motion'

export default function ProgressBar({ found, total }) {
  const pct = (found / total) * 100
  const complete = found === total

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: complete ? '#1D9E75' : '#0C447C',
            transition: 'color 0.3s ease',
          }}
        >
          {complete
            ? 'All 12 problems found — see your total cost below ↓'
            : `Problems found: ${found} / ${total}`}
        </span>
        {!complete && (
          <span style={{ fontSize: '12px', color: '#888' }}>
            {total - found} remaining
          </span>
        )}
      </div>

      <div
        style={{ background: '#e5e5e5', borderRadius: '99px', height: '8px', overflow: 'hidden' }}
        role="progressbar"
        aria-valuenow={found}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${found} of ${total} problems found`}
      >
        <motion.div
          style={{
            height: '100%',
            borderRadius: '99px',
            background: complete ? '#1D9E75' : '#0C447C',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
