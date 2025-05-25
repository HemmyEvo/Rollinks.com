"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button' // Assuming you're using shadcn/ui or similar

const ErrorPage = () => {
  const router = useRouter()

  const handleRefresh = () => {
    router.refresh()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <TriangleAlertIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We're sorry, but we encountered an unexpected error. Please try again or return home.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// Simple icons (you can replace with actual icon components from your library)
function TriangleAlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function RefreshCwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export default ErrorPage