// import React, {useRef, useState, useEffect} from 'react';
// import rewind from '@mapbox/geojson-rewind';
// import centroid from '@turf/centroid'
// import WorldMap from './WorldMap';

// export default function App() {
//   const [geoJson, setGeoJson] = React.useState(null);
//   const [error, setError] = React.useState(null);


//     fetch("http://localhost:8080/country/getCountryData?id=world")
//       .then(response => response.json())
//       .then(data => setGeoJson(rewind(data)))
//       .catch(() => { setError("500 Internal Server Error") });

//   function handleChange(event) {
//     // if (geoJson && geoJson.features.length > 0) {
//     //   console.log(centroid(geoJson.features[0]));
//     //   const center = centroid(geoJson.features[0]).geometry.coordinates;
//     //   mapRef.current.flyTo({
//     //     center: center,
//     //     zoom: 3,
//     //   });
//     // }
//   }



//   return (
//     <div>
//       {error ? <div className='error'><p>{error}</p></div> : null}
//       {geoJson ? <WorldMap
//         geoJson={geoJson}
//         handleChange={handleChange}
//       /> : null}
//     </div>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoia2luZzdzYWtzaGFtIiwiYSI6ImNsaTlqZ2hwdjBhZzMzZnBxbnpoNWFvOGwifQ.T509KpjVbALKdWH26tuhUQ';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-100.04);
  const [lat, setLat] = useState(38.907);
  const [zoom, setZoom] = useState(2);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    if (geoJson) {
      map.current.addSource('countries', {
        'type': 'geojson',
        'data': geoJson
      });

      map.current.addLayer({
        'id': 'country',
        'type': 'fill',
        'source': 'countries',
        'layout': {
          'visibility': 'none'
        },
      });

      console.log('data fetched');
      console.log(geoJson);
      geoJson.features.forEach(country => {
        console.log(`Layer added to ${country.id}`);
        if (!map.current.getSource(country.id)) {
        map.current.addSource(country.id, {
          'type': 'geojson',
          'data': country
        });

        map.current.addLayer({
          'id': country.id,
          'type': 'fill',
          'source': country.id,
          'paint': {
            'fill-color': 'rgb(253, 92, 99)',
            'fill-opacity': 0.001,
            'fill-outline-color': 'rgba(253, 92, 99, 1)'
          }
        });

        map.current.on('click', country.id, (e) => {
          const opacity = map.current.getPaintProperty(
            country.id,
            'fill-opacity'
          );
  
          map.current.setPaintProperty(country.id, 'fill-opacity', opacity === 0.001 ? 0.4 : 0.001);
        });

        map.current.on('contextmenu', country.id, (e) => {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.name)
            .addTo(map.current);
        });
  
        map.current.on('mouseenter', country.id, () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
  
        map.current.on('mouseleave', country.id, () => {
          map.current.getCanvas().style.cursor = '';
        });
  
      }
      });
    }
  }, [geoJson]);

  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', () => {
      fetch('http://localhost:8080/country/getCountryData?id=world')
        .then(response => response.json())
        .then(data => setGeoJson(data))

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.addControl(new mapboxgl.NavigationControl());
    });
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}