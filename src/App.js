import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import useSWR from 'swr' // React hook to fetch the data
import lookup from 'country-code-lookup' // npm module to get ISO Code for countries
import './App.scss'

// Mapbox css - neede to make tooltips work later in the article

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN
function App() {
  // DOM element to render map
  const mapboxElRef = useRef(null) 

  // Initialize our map
  useEffect(() => {
    // You can store the map indtance with useRef too
    const map = new mapboxgl.Map({
      container: mapboxElRef.current,
      style: 'mapbox://styles/notalemesa/ck8dqwdum09ju1ioj65e3ql3k',
      center: [16, 27], //initial geolocation
      zoom: 2 //initial zoom
    })

    // Add navigation controls to the top right of the canvas
    map.addControl(new mapboxgl.NavigationControl())
  }, [])
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
