import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Dropdown({ open, onOpenChange, trigger, children, className = '' }: DropdownProps) {
  const [mounted, setMounted] = useState(false)
  const [enter, setEnter] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnter(true))
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setEnter(false)
      const t = setTimeout(() => setMounted(false), 260)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => onOpenChange(!open)}
        className="w-full flex items-center gap-3 pl-5 pr-5 h-[52px] bg-white rounded-2xl border border-border-gray/50 shadow-soft text-left hover:shadow-glass transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      >
        {trigger}
      </button>

      {mounted && (
        <>
          {/* subtle backdrop to focus attention */}
          <div
            className={`fixed inset-0 z-40 bg-black/[0.03] transition-opacity duration-200 ${enter ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => onOpenChange(false)}
          />
          <div
            className={`
              absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-glass overflow-hidden z-50 border border-border-gray/50
              transition-all duration-[220ms] will-change-transform
              ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className={`max-h-[320px] overflow-y-auto scrollbar-hide dropdown-items ${enter ? 'dropdown-items-open' : ''}`}>
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface DropdownItemProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export function DropdownItem({ children, active = false, onClick, className = '', style }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`w-full flex items-center gap-3 px-5 h-[52px] transition-colors cursor-pointer ${
        active
          ? 'bg-brand-green/10 text-brand-green'
          : 'text-dark-charcoal hover:bg-surface-dim'
      } ${className}`}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */

interface DropdownChevronProps {
  open: boolean
  className?: string
}

export function DropdownChevron({ open, className = '' }: DropdownChevronProps) {
  return (
    <ChevronDown
      size={20}
      strokeWidth={2.5}
      className={`text-medium-gray ml-auto flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${className}`}
    />
  )
}
