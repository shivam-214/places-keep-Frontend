import React, { useEffect, useRef } from "react";

import "./Map.css";

//<--------------MapBox map api--------------------------------------->>
window.mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_APIKEY;

const Map = (props) => {
  const mapRef = useRef();
  const {
    center,
    zoom,
    coordinates,
    getCoordinates,
    createplace,
    title,
    description,
  } = props;

  useEffect(() => {
    let coords = {
      lng: center.lng,
      lat: center.lat,
    };

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/shivam-214/cl050aizd000k14o59evhkjjt",
      center: [coords.lng, coords.lat],
      zoom: zoom ? zoom : 8.5,
      pitch: 50,
    });

    //<------------Full screen----------------->
    map.addControl(new window.mapboxgl.FullscreenControl());

    if (createplace) {
      map.on("dblclick", (e) => {
        e.preventDefault();

        const { lng, lat } = e.lngLat;
        coords = {
          lng: lng,
          lat: lat,
        };
        getCoordinates(coords);
      });
    }

    const markerContent = document.createElement("div");
    markerContent.className = "marker";

    if ((createplace && coordinates) || !createplace) {
      new window.mapboxgl.Marker(markerContent, { offset: [0, -15] })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(
          new window.mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h3>${title ? title : ""}</h3><p>${
                description ? description : ""
              }</p>`
            )
        )
        .addTo(map);
    }
    //<------------Current Location---------------------->
    const currentLocation = new window.mapboxgl.GeolocateControl({
      positionOption: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(currentLocation);

    //<------------Zoom in, Zoom out and Compass---------------------->
    map.addControl(new window.mapboxgl.NavigationControl());
  }, [
    center,
    zoom,
    getCoordinates,
    coordinates,
    createplace,
    title,
    description,
  ]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};
export default Map;
