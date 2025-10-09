import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { createProject, extractDocument, checkAnomaly, spatialRisk } from '@/lib/api'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ProjectFormData {
  code: string
  name: string
  location_lat: number | null
  location_lng: number | null
  budget_cr: number | null
  status: string
  risk: string
  delay_months: number | null
}

const initialFormData: ProjectFormData = {
  code: '',
  name: '',
  location_lat: null,
  location_lng: null,
  budget_cr: null,
  status: '',
  risk: '',
  delay_months: null,
}

export default function AddProject() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
  const [activeCard, setActiveCard] = useState<string>('info')
  const [isUploading, setIsUploading] = useState(false)
  const [extractionResult, setExtractionResult] = useState<any>(null)
  const [isAIFilling, setIsAIFilling] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.1458, 81.7887]) // India center
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ML states (non-blocking alerts)
  const [anomaly, setAnomaly] = useState<{ is_anomaly: boolean; message?: string | null } | null>(null)
  const [geoRisk, setGeoRisk] = useState<{ risk: number; cluster?: string } | null>(null)

  const cards = [
    { id: 'info', title: 'Project Info', icon: '🧾' },
    { id: 'location', title: 'Location', icon: '📍' },
    { id: 'budget', title: 'Budget', icon: '💰' },
    { id: 'timeline', title: 'Timeline', icon: '🕒' },
  ]

  const getCardStatus = (cardId: string) => {
    const fields = {
      info: ['code', 'name'],
      location: ['location_lat', 'location_lng'],
      budget: ['budget_cr'],
      timeline: ['status', 'delay_months'],
    }
    const cardFields = fields[cardId as keyof typeof fields] || []
    const completed = cardFields.every(field => formData[field as keyof ProjectFormData] != null && formData[field as keyof ProjectFormData] !== '')
    const inProgress = cardFields.some(field => formData[field as keyof ProjectFormData] != null && formData[field as keyof ProjectFormData] !== '')
    return completed ? 'completed' : inProgress ? 'progress' : 'missing'
  }

  // Progress only from required sections: Info (name+code), Location, Budget.
  const getProgress = () => {
    const infoComplete = Boolean(formData.name?.trim()) && Boolean(formData.code?.trim())
    const locationComplete = Boolean(selectedLocation) || (
      formData.location_lat !== null && formData.location_lng !== null
    )
    const budgetComplete = formData.budget_cr !== null && !Number.isNaN(formData.budget_cr)

    const completedSections = [infoComplete, locationComplete, budgetComplete].filter(Boolean).length
    const percent = Math.round((completedSections / 3) * 100)
    return Math.min(100, percent)
  }

  const handleAIAssist = async (field: string) => {
    setIsAIFilling(field)

    // Mock AI prefill logic
    const aiSuggestions: Record<string, any> = {
      name: {
        value: 'Raipur Smart Grid Enhancement',
        confidence: 92,
      },
      code: {
        value: 'RPR-SGE-2024',
        confidence: 88,
      },
    }

    setTimeout(() => {
      if (aiSuggestions[field]) {
        setFormData(prev => ({
          ...prev,
          [field]: aiSuggestions[field].value
        }))
      }
      setIsAIFilling(null)
    }, 1500)
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const result = await extractDocument(file)
      setExtractionResult(result)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleSubmit = async () => {
    try {
      await createProject({
        ...formData,
        location_lat: selectedLocation?.[0] || null,
        location_lng: selectedLocation?.[1] || null,
      })
      navigate('/projects')
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: (e: L.LeafletMouseEvent) => {
        setSelectedLocation([e.latlng.lat, e.latlng.lng])
        setFormData(prev => ({
          ...prev,
          location_lat: e.latlng.lat,
          location_lng: e.latlng.lng,
        }))
      },
    })
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Projects
            </button>
            <div className="h-px w-8 bg-slate-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Create New Project
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-400">AI Assistant Online</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-4 mb-8">
          {cards.map((card, index) => (
            <div key={card.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                activeCard === card.id ? 'bg-cyan-500 text-white' :
                getCardStatus(card.id) === 'completed' ? 'bg-green-500 text-white' :
                getCardStatus(card.id) === 'progress' ? 'bg-yellow-500 text-white' :
                'bg-slate-600 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <span className={`text-sm ${activeCard === card.id ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {card.title}
              </span>
              {index < cards.length - 1 && <div className="w-8 h-0.5 bg-slate-700" />}
            </div>
          ))}
          <div className="ml-auto text-slate-400 text-sm">
            {getProgress()}% Complete
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Upload */}
            <div
              className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center transition-all hover:border-cyan-400 hover:bg-white/5 cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <div className="text-cyan-400 font-medium">AI Scanning Document...</div>
                  <div className="flex gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-4">📄</div>
                  <div className="text-lg font-medium text-white mb-2">Upload Project Document</div>
                  <div className="text-slate-400 mb-4">AI will extract details automatically from PDF, Excel, or Word files</div>
                  <div className="text-cyan-400 font-medium">Drop file here or click to choose</div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </div>

            {/* Form Cards */}
            {cards.map((card) => (
              <div
                key={card.id}
                className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 transition-all cursor-pointer ${
                  activeCard === card.id ? 'ring-2 ring-cyan-400 bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveCard(card.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{card.icon}</span>
                    <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    getCardStatus(card.id) === 'completed' ? 'bg-green-400' :
                    getCardStatus(card.id) === 'progress' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                </div>

                {activeCard === card.id && (
                  <div className="space-y-4 animate-in slide-in-from-top duration-300">
                    {card.id === 'info' && (
                      <>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            placeholder="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                          {isAIFilling === 'name' ? (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : formData.name && (
                            <button
                              onClick={() => handleAIAssist('name')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm"
                              title="AI Suggestions available — click to auto-fill details"
                            >
                              ✨
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            placeholder="Project Code"
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                          />
                          {isAIFilling === 'code' ? (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : formData.code && (
                            <button
                              onClick={() => handleAIAssist('code')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm"
                              title="AI Suggestions available — click to auto-fill details"
                            >
                              ✨
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    {card.id === 'location' && (
                      <div className="space-y-4">
                        <div className="relative h-64 rounded-lg overflow-hidden border border-slate-600">
                          <MapContainer
                            center={mapCenter}
                            zoom={5}
                            className="h-full w-full"
                            style={{ background: '#0f172a' }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <MapClickHandler />
                            {selectedLocation && (
                              <Marker position={selectedLocation}>
                                <Popup>
                                  📍 {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                                </Popup>
                              </Marker>
                            )}
                          </MapContainer>
                          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-white">
                            {selectedLocation ? `📍 ${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}` : 'Click to select location'}
                          </div>
                        </div>
                        <button className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">
                          🧠 Smart Locate
                        </button>
                      </div>
                    )}

                    {card.id === 'budget' && (
                      <input
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        placeholder="Budget (Cr)"
                        type="number"
                        value={formData.budget_cr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget_cr: Number(e.target.value) }))}
                      />
                    )}

                    {card.id === 'timeline' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Status"
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        />
                        <input
                          className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Expected Delay (months)"
                          type="number"
                          value={formData.delay_months || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, delay_months: Number(e.target.value) }))}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Project Summary</h3>
              <div className="space-y-4">
                {formData.name && (
                  <div>
                    <div className="text-slate-400 text-sm">Project Name</div>
                    <div className="text-white font-medium">{formData.name}</div>
                  </div>
                )}
                {selectedLocation && (
                  <div>
                    <div className="text-slate-400 text-sm">Location</div>
                    <div className="text-white font-medium">📍 {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}</div>
                  </div>
                )}
                {formData.budget_cr && (
                  <div>
                    <div className="text-slate-400 text-sm">Budget</div>
                    <div className="text-white font-medium">₹{formData.budget_cr} Cr</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-cyan-400">{getProgress()}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={getProgress() < 100}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {getProgress() === 100 ? '🚀 Create Project' : `Complete ${100 - getProgress()}% more`}
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Orb */}
      <div className="fixed bottom-6 right-6">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-cyan-500/25 animate-pulse">
          🤖
        </div>
      </div>
    </div>
  )
}
