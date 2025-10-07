import * as React from 'react'
import Map, { Source, Layer } from 'react-map-gl'
// Use MapLibre instead of Mapbox GL
// @ts-ignore - types provided by maplibre-gl
import maplibregl from 'maplibre-gl'

const INDIA_GEOJSON = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson'

export default function MapChoropleth(){
  const [geo, setGeo] = React.useState<any>()
  React.useEffect(() => {
    fetch(INDIA_GEOJSON).then(r => r.json()).then(setGeo).catch(()=>{})
  }, [])

  const paint: any = {
    'fill-color': [
      'interpolate', ['linear'], ['get', 'risk'],
      0, '#3fb950',
      0.5, '#f59e0b',
      1, '#ef4444'
    ],
    'fill-opacity': 0.5
  } as const

  // Attach random risk to demonstrate choropleth
  const featureCollection = geo ? {
    ...geo,
    features: geo.features.map((f: any) => ({
      ...f,
      properties: { ...(f.properties||{}), risk: Math.random() }
    }))
  } : undefined

  return (
    <div className="h-full">
      <Map
        // MapLibre integration (type cast for react-map-gl v7)
        mapLib={maplibregl as any}
        initialViewState={{ longitude: 78.9629, latitude: 22.5937, zoom: 3.5 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {featureCollection && (
          <Source id="states" type="geojson" data={featureCollection}>
            <Layer id="fill" type="fill" paint={paint} />
            <Layer id="outline" type="line" paint={{ 'line-color': '#94a3b8', 'line-width': 0.5 }} />
          </Source>
        )}
      </Map>
    </div>
  )
}
