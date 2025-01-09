import React, { useEffect, useRef, useState } from "react";
import loadGoogleMaps from "../utils/loadGoogleMaps";

const PlacesAutoComplete = ({ onSelect, clearInput }) => {
  const [place, setPlace] = useState("");
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps("AIzaSyBx37pWgADdyictttZhy08x1G_YrYxMJ7o") // Replace with your API Key
      .then(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["establishment"],
            componentRestrictions: { country: "il" }, // Restrict to Israel
          }
        );
        autoCompleteRef.current.addListener("place_changed", handlePlaceSelect);
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error);
      });
  }, []);

  const handlePlaceSelect = () => {
    const place = autoCompleteRef.current.getPlace();
    if (place) {
      setPlace(place.name);
      onSelect(place);
    }
  };

  useEffect(() => {
    if (clearInput) {
      setPlace("");
    }
  }, [clearInput]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Event Place"
      className="input"
      value={place}
      onChange={(e) => setPlace(e.target.value)}
    />
  );
};

export default PlacesAutoComplete;
