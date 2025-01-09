let isGoogleMapsLoaded = false;

const loadGoogleMaps = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("googleMapsScript");
    if (existingScript) {
      existingScript.onload = () => {
        isGoogleMapsLoaded = true;
        resolve();
      };
      existingScript.onerror = () => {
        reject(new Error("Google Maps API failed to load."));
      };
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGoogleMapsLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Google Maps API failed to load."));
    };

    document.head.appendChild(script);
  });
};

export default loadGoogleMaps;
