import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const FILL_COLOR = 'rgb(253, 92, 99)';
const FILL_OPACITY_SELECTED = 0.4;
const FILL_OPACITY_UNSELECTED = 0.001;
const ANIMATION_DURATION = 300;

mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(76);
  const [lat, setLat] = useState(25);
  const [zoom, setZoom] = useState(2);
  const [countryData, setCountryData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const populationProps = useSpring({ val: selectedCountry?.population || 0, from: { val: 0 }, config: { duration: ANIMATION_DURATION } });
  const areaProps = useSpring({ val: selectedCountry?.area || 0, from: { val: 0.0 }, config: { duration: ANIMATION_DURATION } });
  const activePopup = useRef(null);

  useEffect(() => {
    if (!countryData) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/country/getCountryData?id=world`)
        .then(response => response.json())
        .then(data => setCountryData(data))
        .catch(error => {
          alert("Unable to connect to the server.");
        });
    }
  }, [countryData]);

  useEffect(() => {
    if (!map.current) return;

    const handleMove = () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    };

    map.current.on('load', () => {
      map.current.on('move', handleMove);

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country',
        marker: false,
        mapboxgl: mapboxgl
      });

      geocoder.on('result', (result) => {
        const coordinates = result.result.center;
        map.current.once('moveend', function () {
          const point = map.current.project(coordinates);
          map.current.fire('click', { lngLat: coordinates, point, originalEvent: {} }).fire('contextmenu', { lngLat: coordinates, point, originalEvent: {} });
        });
      });

      map.current.addControl(geocoder);
      map.current.addControl(new mapboxgl.NavigationControl());
    });

    return () => {
      map.current.off('move', handleMove);
    };
  }, []);

  useEffect(() => {
    if (countryData) {
      countryData.features.forEach(country => {
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
              'fill-color': FILL_COLOR,
              'fill-opacity': FILL_OPACITY_UNSELECTED,
              'fill-outline-color': FILL_COLOR
            }
          });

          map.current.on('click', id, () => {
            const opacity = map.current.getPaintProperty(id, 'fill-opacity');
            const { population, area } = country.properties;

            if (opacity === FILL_OPACITY_UNSELECTED) {
              map.current.setPaintProperty(id, 'fill-opacity', FILL_OPACITY_SELECTED);
              setSelectedCountry(prevCountry => ({
                ...prevCountry,
                population: (prevCountry?.population || 0) + population,
                area: (prevCountry?.area || 0) + Math.floor(area)
              }));
            } else {
              map.current.setPaintProperty(id, 'fill-opacity', FILL_OPACITY_UNSELECTED);
              setSelectedCountry(prevCountry => ({
                ...prevCountry,
                population: (prevCountry?.population || 0) - population,
                area: (prevCountry?.area || 0) - Math.floor(area)
              }));
            }
          });

          map.current.on('contextmenu', id, (e) => {
            const properties = e.features[0].properties;
            console.log(properties)
            if (activePopup.current) {
              activePopup.current.remove();
            }

            activePopup.current = new mapboxgl.Popup({ closeButton: false })
              .setLngLat(e.lngLat)
              .setHTML(`
                  <img src="${properties.flag}" alt="${properties.name}" onerror="this.src='unknown_flag.png'">
                  <p>#${properties.rank_pop} in Population</p>
                  <p>#${properties.rank_area} in Area</p>
                  <p>Name: ${properties.name}</p>
                  <p>Capital: ${!properties.capital || properties.capital === "null" ? "N/A" : properties.capital}</p>
                  <p>Currency: ${properties.currency || "N/A"}</p>
                  <p>Population: ${properties.population || "N/A"}</p>
                  <p>Area: ${Math.floor(properties.area)} sqkm</p>
              `)
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
  }, [countryData]);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        projection: 'globe',
        center: [lng, lat],
        zoom: zoom
      });
    }
  }, [lat, lng, zoom]);


  const handleSelectAll = () => {
    if (countryData) {
      countryData.features.forEach(country => {
        const id = country.properties.name;
        const opacity = map.current.getPaintProperty(id, 'fill-opacity');
        const { population, area } = country.properties;
        if (opacity === FILL_OPACITY_UNSELECTED) {
          map.current.setPaintProperty(id, 'fill-opacity', FILL_OPACITY_SELECTED);
          setSelectedCountry(prevCountry => ({
            ...prevCountry,
            population: (prevCountry?.population || 0) + population,
            area: (prevCountry?.area || 0) + Math.floor(area)
          }));
        }
      })
    }
  };

  function handleClearAll() {
    if (countryData) {
      countryData.features.forEach(country => {
        const id = country.properties.name;
        const opacity = map.current.getPaintProperty(id, 'fill-opacity');
        const { population, area } = country.properties;
        if (opacity === FILL_OPACITY_SELECTED) {
          map.current.setPaintProperty(id, 'fill-opacity', FILL_OPACITY_UNSELECTED);
          setSelectedCountry(prevCountry => ({
            ...prevCountry,
            population: (prevCountry?.population || 0) - population,
            area: (prevCountry?.area || 0) - Math.floor(area)
          }));
        }
      })
    }
  }

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="total-counter">
        <div className="counter">Total Population <animated.div>{populationProps.val.to(val => Math.floor(val))}</animated.div></div>
        <div className="counter">Total Area <animated.div>{areaProps.val.to(val => `${Math.floor(val)} sqkm`)}</animated.div></div>
      </div>
      <div className="all-buttons">
        <button className="side-button" onClick={handleSelectAll}>Select All</button>
        <button className="side-button" onClick={handleClearAll}>Clear All</button>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;