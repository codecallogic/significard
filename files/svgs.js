import React from "react";

const SVGs = ({svg}) => {

  const selectSVG = (svg) => {
    switch (svg) {
      case 'partying-face':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <title>pacman</title>
        <g transform="translate(0.000000,45.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
        <path d="M10 429 c0 -6 7 -35 16 -65 l16 -55 29 41 c16 23 36 43 44 47 8 3 12
        9 9 15 -3 5 -16 3 -30 -6 -28 -19 -43 -21 -26 -4 20 20 14 31 -14 24 -17 -5
        -23 -3 -19 4 3 5 -1 10 -9 10 -9 0 -16 -5 -16 -11z"/>
        <path d="M376 421 c-4 -5 -2 -12 3 -15 5 -4 12 -2 15 3 4 5 2 12 -3 15 -5 4
        -12 2 -15 -3z"/>
        <path d="M265 390 c3 -5 10 -10 16 -10 5 0 9 5 9 10 0 6 -7 10 -16 10 -8 0
        -12 -4 -9 -10z"/>
        <path d="M111 309 c-33 -13 -24 -17 28 -11 29 3 39 7 30 13 -17 11 -27 10 -58
        -2z"/>
        <path d="M280 310 c-12 -7 -8 -10 17 -10 17 0 40 -3 50 -6 12 -5 15 -4 8 4
        -15 16 -58 23 -75 12z"/>
        <path d="M125 229 c-4 -6 -5 -12 -4 -13 8 -7 69 7 69 15 0 13 -57 11 -65 -2z"/>
        <path d="M250 231 c0 -8 71 -22 79 -15 1 1 0 7 -4 13 -8 13 -75 15 -75 2z"/>
        <path d="M395 175 c-3 -8 -7 -22 -10 -31 -4 -14 -14 -15 -52 -10 -26 3 -51 13
        -56 21 -4 8 -13 15 -18 15 -6 0 -7 -5 -4 -11 4 -6 -1 -16 -11 -24 -18 -13 -18
        -14 -1 -20 22 -9 22 -22 0 -28 -13 -4 -12 -5 5 -6 12 0 25 6 29 15 4 11 13 13
        37 8 17 -3 36 -10 42 -15 7 -6 16 -3 25 7 7 9 24 20 36 25 29 11 39 35 23 54
        -16 19 -39 19 -45 0z m38 -19 c4 -10 1 -13 -8 -9 -8 3 -12 9 -9 14 7 12 11 11
        17 -5z"/>
        <path d="M25 141 c-3 -6 -5 -11 -3 -12 27 -6 38 -5 35 4 -5 15 -24 20 -32 8z"/>
        <path d="M295 45 l-30 -14 26 -1 c15 0 29 7 33 15 3 8 4 15 3 14 -1 0 -15 -7
        -32 -14z"/>
        <path d="M35 40 c4 -6 11 -8 16 -5 14 9 11 15 -7 15 -8 0 -12 -5 -9 -10z"/>
        </g>
        </svg>
        break;

      case 'checkmark':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>Checkmark</title>
        <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>
        </svg>
        break;

      default:
        break;
    }
  }
  
  return (
    <>
      {selectSVG(svg)}
    </>
  )
}

export default SVGs
