import { useState, useRef, useEffect, useCallback } from 'react'
import { Map, Marker, NavigationControl } from 'react-map-gl/mapbox'
import { Settings, MapPin, ExternalLink, Loader2, Search, Check, Upload } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownChevron } from './components/Dropdown'
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
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  return null
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [gmapsLink, setGmapsLink] = useState('')
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<MapRef>(null)
  const spinRef = useRef<number>(0)
  const isSpinning = useRef(true)

  const selected = countries.find((c) => c.id === selectedId)

  const spinGlobe = useCallback(() => {
    if (!mapRef.current || !isSpinning.current) return
    const map = mapRef.current.getMap()
    const center = map.getCenter()
    map.easeTo({ center: [center.lng + 0.3, 20], duration: 100, easing: (n: number) => n })
    spinRef.current = requestAnimationFrame(spinGlobe)
  }, [])

  useEffect(() => {
    if (!selectedId && mapLoaded) {
      isSpinning.current = true
      spinRef.current = requestAnimationFrame(spinGlobe)
    }
    return () => { if (spinRef.current) cancelAnimationFrame(spinRef.current) }
  }, [selectedId, spinGlobe, mapLoaded])

  // Hero globe = label-free; once a country is picked, flip Standard's label
  // config props back on for the close-up view.
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current.getMap()
    const show = !!selectedId
    try { map.setConfigProperty('basemap', 'showPlaceLabels', show) } catch { /* */ }
    try { map.setConfigProperty('basemap', 'showRoadLabels', show) } catch { /* */ }
    try { map.setConfigProperty('basemap', 'showPointOfInterestLabels', false) } catch { /* */ }
    try { map.setConfigProperty('basemap', 'showTransitLabels', false) } catch { /* */ }
    try { map.setConfigProperty('basemap', 'show3dObjects', show) } catch { /* */ }
  }, [selectedId, mapLoaded])

  // Clear search filter when dropdown closes
  useEffect(() => {
    if (!open) setFilterQuery('')
  }, [open])

  const flyTo = (lat: number, lng: number, zoom: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 2500, essential: true })
    setMarkerPos({ lat, lng })
  }

  const handleSelectCountry = (id: string) => {
    const country = countries.find((c) => c.id === id)
    if (!country) return
    setSelectedId(id)
    setOpen(false)
    isSpinning.current = false
    if (spinRef.current) cancelAnimationFrame(spinRef.current)
    setTimeout(() => flyTo(country.lat, country.lng, country.zoom), 100)
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
    } catch (e) { console.error('Geocoding failed', e) }
    setLoading(false)
  }

  const handleGmapsLink = () => {
    const coords = parseGoogleMapsUrl(gmapsLink)
    if (coords) flyTo(coords.lat, coords.lng, 15)
  }

  const googleMapsUrl = selected
    ? `https://www.google.com/maps/search/?api=1&query=${markerPos?.lat ?? selected.lat},${markerPos?.lng ?? selected.lng}`
    : '#'

  const dropdownTrigger = (
    <>
      {selected ? <selected.Flag size={24} /> : <GlobeIcon />}
      <span className={`flex-grow text-[17px] font-bold ${selected ? 'text-dark-charcoal' : 'text-light-gray'}`}>
        {selected ? selected.name : 'Select your country'}
      </span>
      <DropdownChevron open={open} />
    </>
  )

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const dropdownItems = filtered.map((country, index) => {
    const Flag = country.Flag
    const isActive = country.id === selectedId
    return (
      <DropdownItem
        key={country.id}
        active={isActive}
        onClick={() => handleSelectCountry(country.id)}
        style={{ '--delay': `${index * 12}ms` } as React.CSSProperties}
      >
        <Flag size={24} />
        <span className="text-[15px] font-bold">{country.name}</span>
        {isActive && <Check size={20} strokeWidth={3} className="ml-auto" />}
      </DropdownItem>
    )
  })

  return (
    <div className="min-h-dvh bg-white text-dark-charcoal font-sans antialiased">
      {/* Nav */}
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

      <main className="max-w-[1400px] mx-auto px-5 md:px-8 pt-6 md:pt-10 pb-8">

        {/* ── HERO: centered heading + picker, collapses on pick ── */}
        <div
          style={{
            maxHeight: selectedId ? 0 : 260,
            opacity: selectedId ? 0 : 1,
            marginBottom: selectedId ? 0 : 24,
            // Only clip overflow when collapsing — keeping it visible lets the dropdown list extend below
            overflow: selectedId ? 'hidden' : 'visible',
            pointerEvents: selectedId ? 'none' : 'auto',
            position: 'relative',
            zIndex: 20,
            transition: 'max-height 0.45s ease-out, opacity 0.3s ease-out, margin-bottom 0.45s ease-out',
          }}
        >
          <div className="text-center mb-5">
            <h1 className="text-[32px] md:text-[42px] font-extrabold text-dark-charcoal tracking-tight mb-2">
              Where is your plot?
            </h1>
            <p className="text-[16px] font-medium text-medium-gray">
              Blueprint maps what's around your land — roads, schools, and more.
            </p>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <Dropdown open={open} onOpenChange={setOpen} trigger={dropdownTrigger} className="flex-1 min-w-0">
              <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-border-gray/30">
                <div className="flex items-center gap-2 h-9 px-3 bg-surface-dim rounded-lg">
                  <Search size={14} className="text-medium-gray flex-shrink-0" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="flex-1 bg-transparent text-sm font-semibold text-dark-charcoal placeholder:text-light-gray focus:outline-none min-w-0"
                    autoFocus={open}
                  />
                </div>
              </div>
              {dropdownItems}
            </Dropdown>
            <div className="flex-1 min-w-0 flex items-center gap-3 pl-4 pr-4 h-[52px] rounded-xl border border-border-gray bg-white focus-within:ring-2 focus-within:ring-brand-green/30 focus-within:border-brand-green transition-all">
              <MapPin size={18} className="text-medium-gray flex-shrink-0" />
              <input
                type="text"
                value={gmapsLink}
                onChange={(e) => setGmapsLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGmapsLink()}
                placeholder="Paste Google Maps link..."
                className="flex-1 min-w-0 bg-transparent text-[15px] font-bold text-dark-charcoal placeholder:text-light-gray focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── CONTENT ROW: left panel slides in, map always present ── */}
        <div className="flex flex-col md:flex-row gap-6 md:items-stretch">

          {/* Left panel — slides in from 0 → 400px */}
          <div
            className="flex-shrink-0 overflow-hidden order-2 md:order-1"
            style={{
              maxWidth: selectedId ? 400 : 0,
              opacity: selectedId ? 1 : 0,
              pointerEvents: selectedId ? 'auto' : 'none',
              transition: 'max-width 0.5s ease-out, opacity 0.4s ease-out',
            }}
          >
            {/* Inner div holds content at full width; outer clips it */}
            <div className="w-[400px] flex flex-col gap-3">

              <div className="relative z-20">
                <h1 className="text-[24px] font-extrabold text-dark-charcoal tracking-tight mb-1 leading-tight">Where is your plot?</h1>
                <p className="text-[14px] font-medium text-medium-gray mb-4">Blueprint maps what's around your land.</p>
                <Dropdown open={open} onOpenChange={setOpen} trigger={dropdownTrigger}>
                  <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-border-gray/30">
                    <div className="flex items-center gap-2 h-9 px-3 bg-surface-dim rounded-lg">
                      <Search size={14} className="text-medium-gray flex-shrink-0" />
                      <input
                        type="text"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="Search countries..."
                        className="flex-1 bg-transparent text-sm font-semibold text-dark-charcoal placeholder:text-light-gray focus:outline-none min-w-0"
                        autoFocus={open}
                      />
                    </div>
                  </div>
                  {dropdownItems}
                </Dropdown>
              </div>

              {selected && (
                <>
                  <div className="bg-white rounded-2xl p-5 shadow-soft border border-border-gray/30">
                    <label className="text-[13px] font-bold text-medium-gray uppercase tracking-wider mb-3 block">Upload your file</label>
                    <label
                      className="flex flex-col items-center justify-center gap-2 h-[160px] rounded-xl border-2 border-dashed border-border-gray bg-surface-dim/30 cursor-pointer hover:bg-surface-dim/60 hover:border-brand-green/40 transition-all"
                    >
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          setUploadedFile(file)
                        }}
                      />
                      {uploadedFile ? (
                        <>
                          <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                            <Check size={20} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-bold text-dark-charcoal px-4 text-center truncate max-w-full">{uploadedFile.name}</span>
                          <span className="text-xs font-semibold text-medium-gray">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-medium-gray shadow-sm">
                            <Upload size={20} />
                          </div>
                          <span className="text-sm font-bold text-dark-charcoal">Drop a file here, or click to browse</span>
                          <span className="text-xs font-semibold text-medium-gray">PDF, JPG, PNG up to 10MB</span>
                        </>
                      )}
                    </label>
                  </div>

                  <button
                    className="flex items-center justify-center gap-2 w-full h-[56px] bg-brand-green text-white font-bold text-[17px] rounded-2xl shadow-duo hover:-translate-y-0.5 hover:shadow-duo-hover active:translate-y-1 active:shadow-duo-active transition-all"
                  >
                    <Search size={20} />
                    Analyze
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Map — hero: tall canvas; selected: stretches to match left-panel height
              In hero mode the map sheds its rounded card; the page bleeds the same
              atmosphere blue so the globe's glow has nowhere to butt against an edge. */}
          <div
            className={`flex-grow order-1 md:order-2 self-stretch overflow-hidden transition-all duration-500 ${
              selectedId ? 'rounded-[2rem] map-card' : 'map-bleed'
            }`}
            style={{
              height: selectedId ? 'auto' : 'calc(100dvh - 72px - 14rem)',
              minHeight: selectedId ? 580 : 400,
              transition: 'min-height 0.5s ease-out, border-radius 0.5s ease-out',
            }}
          >
            <Map
              ref={mapRef}
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{ latitude: 20, longitude: 0, zoom: 1.5 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/standard"
              projection={{ name: 'globe' }}
              attributionControl={false}
              dragPan={!!selectedId}
              scrollZoom={!!selectedId}
              doubleClickZoom={!!selectedId}
              touchZoomRotate={!!selectedId}
              onLoad={(e) => {
                const map = e.target
                // Mapbox Standard is configured via root-style config properties,
                // not paint overrides. Hero = label/POI-free; selected mode flips
                // these on through the effect below.
                try { map.setConfigProperty('basemap', 'lightPreset', 'day') } catch { /* */ }
                try { map.setConfigProperty('basemap', 'theme', 'default') } catch { /* */ }
                try { map.setConfigProperty('basemap', 'showPointOfInterestLabels', false) } catch { /* */ }
                try { map.setConfigProperty('basemap', 'showTransitLabels', false) } catch { /* */ }
                try { map.setConfigProperty('basemap', 'showPlaceLabels', false) } catch { /* */ }
                try { map.setConfigProperty('basemap', 'showRoadLabels', false) } catch { /* */ }
                try { map.setConfigProperty('basemap', 'show3dObjects', false) } catch { /* */ }
                // Apple-style atmosphere with a long, diffuse horizon so the
                // blue glow fades into the page instead of stopping at the
                // map's rectangle edge.
                // Tight fog: short horizon-blend confines the blue to a thin
                // halo right against the planet's edge; space outside is pure
                // white so the rectangle seam disappears against the page.
                map.setFog({
                  'color': '#BCD9F0',
                  'high-color': '#A8CFE8',
                  'space-color': '#FFFFFF',
                  'horizon-blend': 0.01,
                  'star-intensity': 0,
                })
                setMapLoaded(true)
              }}
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
