import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { computeTotal } from '../data/costs'
import { analytics } from '../utils/analytics'

const schema = z.object({
  email: z.string().email('Please enter a valid work email'),
  company: z.string().min(2, 'Please enter your company name'),
  supplierCount: z.coerce.number().min(1).max(5000),
})

export default function EmailGate({ supplierCount, onSubmit }) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      company: '',
      supplierCount,
    },
  })

  async function onValid(data) {
    setLoading(true)
    const totalHiddenCost = computeTotal(data.supplierCount)
    const payload = {
      email: data.email,
      company: data.company,
      supplierCount: data.supplierCount,
      totalHiddenCost,
      timestamp: new Date().toISOString(),
      source: 'find-hidden-cost-game',
      campaign: 'Campaign03-BestDataBestAI',
    }

    analytics.track('email_submitted', {
      supplierCount: data.supplierCount,
      totalCost: totalHiddenCost,
    })

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        analytics.track('email_confirmed')
      } else {
        console.log('[lead payload — API error, still advancing]', payload)
      }
    } catch {
      console.log('[lead payload — network error, advancing anyway]', payload)
    }

    setLoading(false)
    onSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        marginTop: '1.5rem',
        maxWidth: '520px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>
        See how you compare to peers
      </h2>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        Get your personalized infrastructure cost analysis and benchmark report. We&apos;ll send it to your inbox within 24 hours.
      </p>

      {/* Included list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          'Your full cost breakdown as a shareable PDF',
          'Where you rank vs. industry averages (31.7% ASN compliance baseline)',
          'The 3-step infrastructure roadmap to close the gap',
          'Forrester TEI ROI model — 360% ROI over 3 years',
        ].map((item) => (
          <li
            key={item}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#333' }}
          >
            <span style={{ color: '#1D9E75', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onValid)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Field label="Work email" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="your.email@company.com"
            autoComplete="email"
            style={inputStyle(!!errors.email)}
          />
        </Field>

        <Field label="Company name" error={errors.company?.message}>
          <input
            {...register('company')}
            type="text"
            placeholder="Company name"
            autoComplete="organization"
            style={inputStyle(!!errors.company)}
          />
        </Field>

        <Field label="Active suppliers (we'll use this to personalize your report)" error={errors.supplierCount?.message}>
          <input
            {...register('supplierCount')}
            type="number"
            min={1}
            max={5000}
            style={inputStyle(!!errors.supplierCount)}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '4px',
            width: '100%',
            background: loading ? '#6b9fd4' : '#0C447C',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.15s ease',
          }}
        >
          {loading ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            'Send my report →'
          )}
        </button>
      </form>
    </motion.div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#A32D2D', margin: 0 }}>{error}</p>}
    </div>
  )
}

function inputStyle(hasError) {
  return {
    width: '100%',
    border: `1px solid ${hasError ? '#A32D2D' : '#ddd'}`,
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    color: '#1a1a1a',
    background: '#fff',
    fontFamily: 'inherit',
  }
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: 'spin 0.75s linear infinite' }}
      aria-hidden="true"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  )
}
