import { Map as MapboxMap } from 'mapbox-gl';
import * as React from 'react';
import Map from 'react-map-gl';

const MapComponent = () => {
    const mapRef = React.useRef<MapboxMap>(null);

    return (
      <Map
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiYXNzYWZub2Foa29yZW4iLCJhIjoiY20zbW85eHNsMTJpczJscGV1MTZnNzNwMSJ9.OIwtJtT70TO4KwuDCgcsGQ"
      initialViewState={{
        longitude: 34.7818064,
        latitude: 32.0852997,
        zoom: 7
      }}
      locale={{

      }}
      style={{width: '100%', height: '100%'}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />

    );
};

export default MapComponent;
