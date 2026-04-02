import React from 'react';

const SVGFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="filter_tornpaper">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="20"
          result="turbulence"
        />
        <feDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale="7"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

export default SVGFilter;
