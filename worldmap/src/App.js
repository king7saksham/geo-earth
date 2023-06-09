import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2luZzdzYWtzaGFtIiwiYSI6ImNsaTlqZ2hwdjBhZzMzZnBxbnpoNWFvOGwifQ.T509KpjVbALKdWH26tuhUQ';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(2);
  const [geoJson, setGeoJson] = useState(null);
  const [population, setPopulation] = useState(0);
  const [selectedOpacity, unselectedOpacity] = [0.4, 0.001];
  const props = useSpring({ val: population, from: { val: 0 }, config: { duration: "300" } });

  useEffect(() => {
    if (geoJson) {
      geoJson.features.forEach(country => {
        const id = country.properties.name;
        if (!map.current.getSource(id)) {
          map.current.addSource(id, {
            'type': 'geojson',
            'data': country
          });

          map.current.addLayer({
            'id': id,
            'type': 'fill',
            'source': id,
            'paint': {
              'fill-color': 'rgb(253, 92, 99)',
              'fill-opacity': unselectedOpacity,
              'fill-outline-color': 'rgba(253, 92, 99, 1)'
            }
          });

          map.current.on('click', id, () => {
            const opacity = map.current.getPaintProperty(
              id,
              'fill-opacity'
            );

            if (opacity === unselectedOpacity) {
              map.current.setPaintProperty(id, 'fill-opacity', selectedOpacity);
              setPopulation(prevPopulation => (prevPopulation + Number(country.properties.population)));
            } else {
              map.current.setPaintProperty(id, 'fill-opacity', unselectedOpacity);
              setPopulation(prevPopulation => (prevPopulation - Number(country.properties.population)));
            }
          });

          map.current.on('contextmenu', id, (e) => {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(e.features[0].properties.name)
              .addTo(map.current);
          });

          map.current.on('mouseenter', id, () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', id, () => {
            map.current.getCanvas().style.cursor = '';
          });

        }
      });
    }
  }, [geoJson, selectedOpacity, unselectedOpacity]);

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
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe',
      center: [lng, lat],
      zoom: zoom
    });
  });

  function handleButtonClick(e) {
    console.log(e);
  }

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="population">
        Total Population
        <animated.div>
          {props.val.to(val => Math.floor(val))}
        </animated.div>
      </div>
      <div onClick={handleButtonClick} className='map-layer'>
        <div className='layer-switch'>
          <button id="streets" className="side-button active">Streets</button>
          <button className="side-button">Satellite Streets</button>
          <button className="side-button">Outdoors</button>
          <button className="side-button">Light</button>
          <button className="side-button">Dark</button>
          <button className="side-button">OSM</button>
        </div>
        <div className='projection-switch'>
          <button className="side-button active">Globe</button>
          <button className="side-button">Mercator</button>
        </div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
