import { Suspense } from "react"
import RecipePage from "../pages/RecipePage"

export default function Recipe() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RecipePage />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#d1b2a1]"></div>
      </div>
    </div>
  )
}
