import React, { useEffect, useRef, useState } from "react";
import loadGoogleMaps from "../utils/loadGoogleMaps";

const AddressAutoComplete = ({ onSelect, initialValue = "" }) => {
  const [address, setAddress] = useState(initialValue);
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps("AIzaSyBx37pWgADdyictttZhy08x1G_YrYxMJ7o")
      .then(() => {
        if (window.google && window.google.maps) {
          autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["address"],
              componentRestrictions: { country: "il" },
            }
          );
          autoCompleteRef.current.addListener(
            "place_changed",
            handlePlaceSelect
          );
        } else {
          console.error("Google Maps API is not available.");
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error.message);
      });
  }, []);

  useEffect(() => {
    setAddress(initialValue); // Update address when initialValue changes
  }, [initialValue]);

  const handlePlaceSelect = () => {
    const place = autoCompleteRef.current.getPlace();
    if (place.address_components) {
      const formattedAddress = place.formatted_address;
      setAddress(formattedAddress);
      onSelect(formattedAddress); // Send the formatted address to the parent component
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Street Address, City, Country."
      className="input profile-input"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  );
};

export default AddressAutoComplete;
