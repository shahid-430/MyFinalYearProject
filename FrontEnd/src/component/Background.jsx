import React from 'react'
import my4 from "../assets/image5.png"
import my1 from "../assets/image2.png"
import my2 from "../assets/image3.png"
import my3 from "../assets/image4.png"

function Background({ heroCount }) {

  const images = [my4, my1, my2, my3];

  return (
    <img
      src={images[heroCount]}
      alt=""
      className="mx-auto block rounded-lg w-full sm:w-[90%] md:w-[85%] lg:w-[90%] max-w-[650px] h-[240px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[560px] object-cover border-l-4 border-white"
    />
  );
}

export default Background;