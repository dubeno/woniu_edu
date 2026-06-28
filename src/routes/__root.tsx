import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { Suspense } from "react"
import { Header } from "~/components/header"
import { AttributionCapture } from "~/components/AttributionCapture"
import { WechatFab } from "~/components/WechatFab"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RouteFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-24" aria-busy="true">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        <span className="text-xs uppercase tracking-wider">Loading…</span>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0e1a] text-slate-100 overflow-hidden">
      <AttributionCapture />
      <Header />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <WechatFab />
    </div>
  )
}