import React from 'react'

interface FlagProps {
  size?: number
  className?: string
}

export const USFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#bd3d44" d="M0 0h640v480H0"/>
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
    <path fill="#192f5d" d="M0 0h364.8v258.5H0"/>
    <marker id="us-a" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="M14 0l9 27L0 10h28L5 27z"/>
    </marker>
    <path fill="none" markerMid="url(#us-a)" d="M0 0L14 0M28 0L42 0M56 0L70 0M84 0L98 0M112 0L126 0M140 0L154 0M168 0L182 0M196 0L210 0M224 0L238 0M252 0L266 0M280 0L294 0M308 0L322 0M336 0L350 0M0 23L14 23M28 23L42 23M56 23L70 23M84 23L98 23M112 23L126 23M140 23L154 23M168 23L182 23M196 23L210 23M224 23L238 23M252 23L266 23M280 23L294 23M308 23L322 23M336 23L350 23M0 46L14 46M28 46L42 46M56 46L70 46M84 46L98 46M112 46L126 46M140 46L154 46M168 46L182 46M196 46L210 46M224 46L238 46M252 46L266 46M280 46L294 46M308 46L322 46M336 46L350 46M0 69L14 69M28 69L42 69M56 69L70 69M84 69L98 69M112 69L126 69M140 69L154 69M168 69L182 69M196 69L210 69M224 69L238 69M252 69L266 69M280 69L294 69M308 69L322 69M336 69L350 69M0 92L14 92M28 92L42 92M56 92L70 92M84 92L98 92M112 92L126 92M140 92L154 92M168 92L182 92M196 92L210 92M224 92L238 92M252 92L266 92M280 92L294 92M308 92L322 92M336 92L350 92"/>
  </svg>
)

export const SpainFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#AA151B" d="M0 0h640v480H0z"/>
    <path fill="#F1BF00" d="M0 120h640v240H0z"/>
    <path fill="#AA151B" d="M160 180h80v120h-80z"/>
    <path fill="#F1BF00" d="M170 190h60v100h-60z"/>
    <circle cx="200" cy="240" r="15" fill="#AA151B"/>
  </svg>
)

export const FranceFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <path fill="#002395" d="M0 0h213.3v480H0z"/>
    <path fill="#ED2939" d="M426.7 0H640v480H426.7z"/>
  </svg>
)

export const GermanyFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#FFCE00" d="M0 0h640v480H0z"/>
    <path d="M0 0h640v160H0z"/>
    <path fill="#D00" d="M0 320h640v160H0z"/>
  </svg>
)

export const ItalyFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <path fill="#009246" d="M0 0h213.3v480H0z"/>
    <path fill="#CE2B37" d="M426.7 0H640v480H426.7z"/>
  </svg>
)

export const BrazilFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#009c3b" d="M0 0h640v480H0z"/>
    <path fill="#ffdf00" d="M320 60l260 180-260 180L60 240z"/>
    <circle cx="320" cy="240" r="80" fill="#002776"/>
    <path fill="#fff" d="M320 200c40 0 72 20 80 48-40-8-120-8-160 0 8-28 40-48 80-48z"/>
  </svg>
)

export const JapanFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <circle cx="320" cy="240" r="120" fill="#bc002d"/>
  </svg>
)

export const KoreaFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <circle cx="320" cy="240" r="100" fill="#c60c30"/>
    <path fill="#003478" d="M320 140a100 100 0 0 1 0 200 50 50 0 0 1 0-100 50 50 0 0 0 0-100z"/>
    <g transform="rotate(30 320 240)">
      <rect x="220" y="235" width="40" height="10" fill="#000"/>
      <rect x="280" y="235" width="40" height="10" fill="#000"/>
      <rect x="340" y="235" width="40" height="10" fill="#000"/>
      <rect x="400" y="235" width="40" height="10" fill="#000"/>
    </g>
    <g transform="rotate(-30 320 240)">
      <rect x="220" y="235" width="40" height="10" fill="#000"/>
      <rect x="280" y="235" width="40" height="10" fill="#000"/>
      <rect x="340" y="235" width="40" height="10" fill="#000"/>
      <rect x="400" y="235" width="40" height="10" fill="#000"/>
    </g>
  </svg>
)

export const ChinaFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#DE2910" d="M0 0h640v480H0z"/>
    <g fill="#FFDE00">
      <path d="M120 80l20 60h60l-50 40 20 60-50-40-50 40 20-60-50-40h60z"/>
      <path d="M220 40l5 15h15l-12 8 5 15-12-8-12 8 5-15-12-8h15z"/>
      <path d="M260 70l5 15h15l-12 8 5 15-12-8-12 8 5-15-12-8h15z"/>
      <path d="M260 120l5 15h15l-12 8 5 15-12-8-12 8 5-15-12-8h15z"/>
      <path d="M220 150l5 15h15l-12 8 5 15-12-8-12 8 5-15-12-8h15z"/>
    </g>
  </svg>
)

export const RussiaFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <path fill="#0039a6" d="M0 160h640v160H0z"/>
    <path fill="#d52b1e" d="M0 320h640v160H0z"/>
  </svg>
)

export const flagComponents: Record<string, React.FC<FlagProps>> = {
  en: USFlag,
  es: SpainFlag,
  fr: FranceFlag,
  de: GermanyFlag,
  it: ItalyFlag,
  pt: BrazilFlag,
  ja: JapanFlag,
  ko: KoreaFlag,
  zh: ChinaFlag,
  ru: RussiaFlag,
}

export const IndiaFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#f93" d="M0 0h640v160H0z"/>
    <path fill="#fff" d="M0 160h640v160H0z"/>
    <path fill="#128807" d="M0 320h640v160H0z"/>
    <circle cx="320" cy="240" r="60" fill="#008"/>
    <circle cx="320" cy="240" r="50" fill="#fff"/>
    <circle cx="320" cy="240" r="10" fill="#008"/>
  </svg>
)

export const UKFlag: React.FC<FlagProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`rounded-lg ${className}`}>
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#fff" d="M75 0l245 196V0H75zm490 0L320 196V0h245zM0 44l196 156h-56L0 102V44zm640 0v58L500 200h-56L640 44zM0 436l196-156h-56L0 378v58zm640 0V378L500 280h-56l196 156z"/>
    <path fill="#c8102e" d="M0 480l320-240v40L40 480H0zm320-240v40l280 200h40L320 240zM0 0l280 200h-40L0 40V0zm320 200L640 0v40L360 200h-40z"/>
    <path fill="#fff" d="M240 0h160v480H240z"/>
    <path fill="#fff" d="M0 160h640v160H0z"/>
    <path fill="#c8102e" d="M0 192h640v96H0z"/>
    <path fill="#c8102e" d="M272 0h96v480h-96z"/>
  </svg>
)
