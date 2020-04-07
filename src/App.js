import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import useSWR from 'swr' // React hook to fetch the data
import lookup from 'country-code-lookup' // npm module to get ISO Code for countries
import './App.scss'

// Mapbox css - neede to make tooltips work later in the article

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN
function App() {
  const mapboxElRef = useRef(null); // DOM element to render map
  const fetcher = url =>
    fetch(url)
      .then(r => r.json())
      .then(data =>
        data.map((point, index) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              point.coordinates.longitude,
              point.coordinates.latitude
            ]
          },
          properties: {
            id: index, // unique identifier in this case the index
            country: point.country,
            province: point.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths
          }
        }))
      )

  // Fetching our data with swr package
  const { data } = useSWR('https://corona.lmao.ninja/v2/jhucsse', fetcher) 

  useEffect(() => {
    if (data) {
      // You can store the map instance with useRef too
      const map = new mapboxgl.Map({
        container: mapboxElRef.current,
        style: 'mapbox://styles/notalemesa/ck8dqwdum09ju1ioj65e3ql3k',
        center: [16, 27], //initial geolocation
        zoom: 2 //initial zoom
      })
      // Add navigation controls to the top right of the canvas
      map.addControl(new mapboxgl.NavigationControl())

      // Call this method when the map is loaded
      map.once('load', () => {
        // Add our source
        // with id 'points'
        map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data
          }  
        })

        // Add our layer
        map.addLayer({
          id: "circles",
          source: "points", // this should be the id of the source
          type: "circle",
          // paint properties
          paint: {
            "circle-opacity": 0.75,
            "circle-stroke-width": 1,
            "circle-radius": 4,
            "circle-color": "#FFEB3B"
          }
        })
      })
    }
  }, [data])
  return (
    <div className='App'>
      <div className='mapContainer'>
        {/* Assigned mapbox container */}
        <div className='mapBox' ref={ mapboxElRef } />
      </div>
    </div>
  )
}

export default App
