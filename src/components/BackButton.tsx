'use client'

import { usePathname, useRouter } from 'next/navigation'

export function BackButton() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/') {
    return null
  }

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#333333] shadow hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  )
}
