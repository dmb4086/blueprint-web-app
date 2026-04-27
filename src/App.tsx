import { useState, useRef, useEffect, useCallback } from 'react'
import { Map, Marker, NavigationControl } from 'react-map-gl/mapbox'
import { Settings, Search, MapPin, ExternalLink, Loader2 } from 'lucide-react'
import type { MapRef } from 'react-map-gl/mapbox'
import {
  IndiaFlag, USFlag, UKFlag, SpainFlag, FranceFlag,
  GermanyFlag, ItalyFlag, BrazilFlag, JapanFlag,
  KoreaFlag, ChinaFlag, RussiaFlag
} from './Flags'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface Country {
  id: string
  name: string
  lat: number
  lng: number
  zoom: number
  Flag: React.FC<{ size?: number; className?: string }>
}

const countries: Country[] = [
  { id: 'in', name: 'India', lat: 20.5937, lng: 78.9629, zoom: 5, Flag: IndiaFlag },
  { id: 'us', name: 'United States', lat: 37.0902, lng: -95.7129, zoom: 4, Flag: USFlag },
  { id: 'gb', name: 'United Kingdom', lat: 55.3781, lng: -3.4360, zoom: 6, Flag: UKFlag },
  { id: 'es', name: 'Spain', lat: 40.4637, lng: -3.7492, zoom: 6, Flag: SpainFlag },
  { id: 'fr', name: 'France', lat: 46.2276, lng: 2.2137, zoom: 6, Flag: FranceFlag },
  { id: 'de', name: 'Germany', lat: 51.1657, lng: 10.4515, zoom: 6, Flag: GermanyFlag },
  { id: 'it', name: 'Italy', lat: 41.8719, lng: 12.5674, zoom: 6, Flag: ItalyFlag },
  { id: 'br', name: 'Brazil', lat: -14.2350, lng: -51.9253, zoom: 4, Flag: BrazilFlag },
  { id: 'jp', name: 'Japan', lat: 36.2048, lng: 138.2529, zoom: 6, Flag: JapanFlag },
  { id: 'kr', name: 'Korea', lat: 35.9078, lng: 127.7669, zoom: 7, Flag: KoreaFlag },
  { id: 'cn', name: 'China', lat: 35.8617, lng: 104.1954, zoom: 4, Flag: ChinaFlag },
  { id: 'ru', name: 'Russia', lat: 61.5240, lng: 105.3188, zoom: 3, Flag: RussiaFlag },
]

function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  // Match /@lat,lng,z/ or /@lat,lng/ or ?q=lat,lng
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }

  return null
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [gmapsLink, setGmapsLink] = useState('')
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const mapRef = useRef<MapRef>(null)
  const spinRef = useRef<number>(0)
  const isSpinning = useRef(true)

  const selected = countries.find((c) => c.id === selectedId)

  // Spin the globe
  const spinGlobe = useCallback(() => {
    if (!mapRef.current || !isSpinning.current) return
    const map = mapRef.current.getMap()
    const center = map.getCenter()
    map.easeTo({
      center: [center.lng + 0.3, 20],
      duration: 100,
      easing: (n: number) => n,
    })
    spinRef.current = requestAnimationFrame(spinGlobe)
  }, [])

  useEffect(() => {
    if (!selectedId && mapRef.current) {
      isSpinning.current = true
      spinRef.current = requestAnimationFrame(spinGlobe)
    }
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current)
    }
  }, [selectedId, spinGlobe])

  const flyTo = (lat: number, lng: number, zoom: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom,
      duration: 2500,
      essential: true,
    })
    setMarkerPos({ lat, lng })
  }

  const handleSelectCountry = (id: string) => {
    const country = countries.find((c) => c.id === id)
    if (!country) return

    setSelectedId(id)
    setOpen(false)
    isSpinning.current = false
    if (spinRef.current) cancelAnimationFrame(spinRef.current)

    setTimeout(() => {
      flyTo(country.lat, country.lng, country.zoom)
    }, 100)
  }

  const handleSearchAddress = async () => {
    if (!address.trim() && !state.trim()) return
    setLoading(true)
    const query = [address, state, selected?.name].filter(Boolean).join(', ')
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      )
      const data = await res.json()
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center
        flyTo(lat, lng, 12)
      }
    } catch (e) {
      console.error('Geocoding failed', e)
    }
    setLoading(false)
  }

  const handleGmapsLink = () => {
    const coords = parseGoogleMapsUrl(gmapsLink)
    if (coords) {
      flyTo(coords.lat, coords.lng, 15)
    }
  }

  const googleMapsUrl = selected
    ? `https://www.google.com/maps/search/?api=1&query=${markerPos?.lat ?? selected.lat},${markerPos?.lng ?? selected.lng}`
    : '#'

  return (
    <div className="min-h-dvh bg-surface text-dark-charcoal font-sans antialiased">
      {/* Nav Bar */}
      <header className="glass-panel flex justify-between items-center w-full px-6 py-3 h-[72px] border-b border-border-gray/50 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-sm">
            <MapPin size={22} />
          </div>
          <span className="text-xl font-extrabold text-dark-charcoal tracking-tight">Blueprint</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 bg-surface-dim/60 px-2 py-1.5 rounded-full border border-border-gray/50">
          <a href="#" className="px-5 py-2 text-sm font-semibold text-medium-gray hover:text-dark-charcoal transition-colors rounded-full">Explore</a>
          <a href="#" className="px-5 py-2 text-sm font-bold text-dark-charcoal bg-white rounded-full shadow-sm">Sites</a>
          <a href="#" className="px-5 py-2 text-sm font-semibold text-medium-gray hover:text-dark-charcoal transition-colors rounded-full">Map</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-dim transition-colors text-medium-gray">
            <Settings size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center border border-border-gray text-dark-charcoal font-bold hover:bg-white transition-colors cursor-pointer shadow-sm text-sm">JS</div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1400px] mx-auto px-5 md:px-8 py-6 md:py-10">
        {/* Dropdown */}
        <div className="max-w-md mb-6 relative z-20">
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-dark-charcoal tracking-tight mb-1">Select Location</h1>
          <p className="text-[15px] font-medium text-medium-gray mb-4">Choose a country to begin</p>

          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray z-10" />
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center gap-3 pl-12 pr-5 h-[52px] bg-white rounded-2xl border-none shadow-soft text-left hover:shadow-glass transition-all"
            >
              {selected ? <selected.Flag size={24} /> : <GlobeIcon />}
              <span className={`flex-grow text-[17px] font-bold ${selected ? 'text-dark-charcoal' : 'text-light-gray'}`}>
                {selected ? selected.name : 'Choose a country'}
              </span>
              <svg className={`w-5 h-5 text-medium-gray transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-glass overflow-hidden z-20 max-h-[320px] overflow-y-auto border border-border-gray/50">
                  {countries.map((country) => {
                    const Flag = country.Flag
                    const isActive = country.id === selectedId
                    return (
                      <button
                        key={country.id}
                        onClick={() => handleSelectCountry(country.id)}
                        className={`w-full flex items-center gap-3 px-5 h-[52px] transition-colors ${
                          isActive ? 'bg-brand-green/10 text-brand-green' : 'text-dark-charcoal hover:bg-surface'
                        }`}
                      >
                        <Flag size={24} />
                        <span className="text-[15px] font-bold">{country.name}</span>
                        {isActive && (
                          <svg className="w-5 h-5 text-brand-green ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Layout: inputs left, map right on desktop; stacked on mobile */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Inputs */}
          <div className="w-full md:w-[400px] flex flex-col gap-4 order-2 md:order-1">
            {selected && (
              <>
                <div className="bg-white rounded-2xl p-5 shadow-soft border border-border-gray/30">
                  <label className="text-[13px] font-bold text-medium-gray uppercase tracking-wider mb-2 block">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
                    placeholder="Street address..."
                    className="w-full h-[48px] px-4 rounded-xl border border-border-gray bg-white text-[15px] font-bold text-dark-charcoal placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all mb-3"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
                    placeholder="State / Province..."
                    className="w-full h-[48px] px-4 rounded-xl border border-border-gray bg-white text-[15px] font-bold text-dark-charcoal placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                  />
                  <button
                    onClick={handleSearchAddress}
                    disabled={loading}
                    className="mt-3 w-full h-[48px] bg-brand-green text-white font-bold text-[15px] rounded-xl shadow-duo hover:-translate-y-0.5 hover:shadow-duo-hover active:translate-y-1 active:shadow-duo-active transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    Search on Map
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-soft border border-border-gray/30">
                  <label className="text-[13px] font-bold text-medium-gray uppercase tracking-wider mb-2 block">Or paste a Google Maps link</label>
                  <input
                    type="text"
                    value={gmapsLink}
                    onChange={(e) => setGmapsLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGmapsLink()}
                    placeholder="https://maps.google.com/..."
                    className="w-full h-[48px] px-4 rounded-xl border border-border-gray bg-white text-[15px] font-bold text-dark-charcoal placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all mb-3"
                  />
                  <button
                    onClick={handleGmapsLink}
                    className="w-full h-[48px] bg-surface-dim text-dark-charcoal font-bold text-[15px] rounded-xl border border-border-gray hover:bg-white hover:shadow-soft transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin size={18} />
                    Go to Location
                  </button>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-[56px] bg-brand-green text-white font-bold text-[17px] rounded-2xl shadow-duo hover:-translate-y-0.5 hover:shadow-duo-hover active:translate-y-1 active:shadow-duo-active transition-all"
                >
                  <ExternalLink size={20} />
                  Open in Google Maps
                </a>
              </>
            )}
          </div>

          {/* Right: Map */}
          <div className="flex-grow order-1 md:order-2 rounded-[2rem] overflow-hidden shadow-glass border border-border-gray/50 bg-[#F2F2F7]" style={{ height: '60vh', minHeight: '400px' }}>
            <Map
              ref={mapRef}
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{
                latitude: 20,
                longitude: 0,
                zoom: 1.5,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              projection={{ name: 'globe' }}
              attributionControl={false}
              dragPan={!!selectedId}
              scrollZoom={!!selectedId}
              doubleClickZoom={!!selectedId}
              touchZoomRotate={!!selectedId}
            >
              {selectedId && (
                <>
                  <NavigationControl position="top-right" showCompass={false} />
                  {(markerPos || selected) && (
                    <Marker
                      latitude={markerPos?.lat ?? selected!.lat}
                      longitude={markerPos?.lng ?? selected!.lng}
                      anchor="bottom"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white shadow-lg border-[3px] border-white">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                        <div className="w-3 h-1.5 bg-black/20 rounded-full mt-1 blur-[2px]" />
                      </div>
                    </Marker>
                  )}
                </>
              )}
            </Map>
          </div>
        </div>
      </main>
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-gray">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default App
