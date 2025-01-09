import React from "react";
import "../assets/styles/Gallery.css";
import babyborn from "../assets/imgs/babyborn.jpg";
import babyboyborn from "../assets/imgs/babyboyborn.jpg";
import babygirlborn from "../assets/imgs/babygirlborn.jpg";
import barmitzva from "../assets/imgs/barmitzva.jpg";
import batmitzva from "../assets/imgs/batmitzva.jpg";
import henna from "../assets/imgs/henna.jpg";
import savethedate from "../assets/imgs/savethedate.jpg";
import wedding from "../assets/imgs/wedding.jpg";
import wedding2 from "../assets/imgs/wedding2.jpg";

const Gallery = () => {
  const images = [
    { src: babyborn, alt: "Baby born" },
    { src: babyboyborn, alt: "Baby boy born" },
    { src: babygirlborn, alt: "Baby girl born" },
    { src: barmitzva, alt: "Bar Mitzvah" },
    { src: batmitzva, alt: "Bat Mitzvah" },
    { src: henna, alt: "Henna ceremony" },
    { src: savethedate, alt: "Save the date" },
    { src: wedding, alt: "Wedding" },
    { src: wedding2, alt: "Wedding 2" },
  ];

  return (
    <div className="gallery-container">
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <img src={image.src} alt={image.alt} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
