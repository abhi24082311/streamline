'use client'
import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

interface Props {
  workspaceId: string
}

// Breadcrumb reads usePathname — per the Suspense skill, it needs wrapping in dynamic routes
const BreadcrumbInner = ({ workspaceId }: Props) => {
  const pathname = usePathname()

  const segments = pathname
    .replace(`/dashboard/${workspaceId}`, '')
    .split('/')
    .filter(Boolean)

  const crumbs = [
    { label: 'My Library', href: `/dashboard/${workspaceId}` },
    ...segments.map((seg, i) => {
      // Capitalise and prettify segment labels
      const label = seg.charAt(0).toUpperCase() + seg.slice(1)
      const href = `/dashboard/${workspaceId}/${segments.slice(0, i + 1).join('/')}`
      return { label, href }
    }),
  ]

  return (
    <nav className="flex items-center gap-1 text-sm text-neutral-400" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.href}>
          {i > 0 && <ChevronRight size={14} className="text-neutral-600" />}
          {i === crumbs.length - 1 ? (
            <span className="text-neutral-200 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-neutral-200 transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

const Header = ({ workspaceId }: Props) => {
  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 border-b border-[#1D1D1D] bg-[#0d0d0d]/80 backdrop-blur-sm">
      <Suspense fallback={<div className="h-4 w-48 bg-[#1D1D1D] rounded animate-pulse" />}>
        <BreadcrumbInner workspaceId={workspaceId} />
      </Suspense>

      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </header>
  )
}

export default Header
