import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { Header } from "~/components/header"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
