import { cn } from '@/lib/utils'

type LogoProps = Readonly<{
  className?: string
}>

export function Logo({ className = 'h-8' }: LogoProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3 text-primary', className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0"
        aria-hidden
      >
        <rect
          x="15"
          y="45"
          width="70"
          height="40"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <g transform="rotate(-12 15 45)">
          <rect
            x="15"
            y="30"
            width="70"
            height="15"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <line
            x1="28"
            y1="30"
            x2="38"
            y2="45"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="43"
            y1="30"
            x2="53"
            y2="45"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="58"
            y1="30"
            x2="68"
            y2="45"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="73"
            y1="30"
            x2="83"
            y2="45"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        <circle cx="15" cy="45" r="2.5" fill="currentColor" />
      </svg>
      <span className="font-display truncate text-2xl font-normal tracking-wider uppercase">
        CineDash
      </span>
    </div>
  )
}
