import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { captureAttributionFromSearch } from '~/lib/attribution'

export function AttributionCapture() {
  const search = useRouterState({ select: s => s.location.search })

  useEffect(() => {
    if (search) captureAttributionFromSearch(search)
  }, [search])

  return null
}
