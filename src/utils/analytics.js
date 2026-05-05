const isDev = import.meta.env.DEV

export const analytics = {
  track(event, props = {}) {
    if (isDev) {
      console.log('[analytics]', event, props)
    }
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event, ...props })
    }
  },
}
