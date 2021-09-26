import React from "react";

const SVGs = ({svg, classprop}) => {

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

      case 'envelope':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <title>Envelope</title>
        <path d="M26 23.5v-12c-0.328 0.375-0.688 0.719-1.078 1.031-2.234 1.719-4.484 3.469-6.656 5.281-1.172 0.984-2.625 2.188-4.25 2.188h-0.031c-1.625 0-3.078-1.203-4.25-2.188-2.172-1.813-4.422-3.563-6.656-5.281-0.391-0.313-0.75-0.656-1.078-1.031v12c0 0.266 0.234 0.5 0.5 0.5h23c0.266 0 0.5-0.234 0.5-0.5zM26 7.078c0-0.391 0.094-1.078-0.5-1.078h-23c-0.266 0-0.5 0.234-0.5 0.5 0 1.781 0.891 3.328 2.297 4.438 2.094 1.641 4.188 3.297 6.266 4.953 0.828 0.672 2.328 2.109 3.422 2.109h0.031c1.094 0 2.594-1.437 3.422-2.109 2.078-1.656 4.172-3.313 6.266-4.953 1.016-0.797 2.297-2.531 2.297-3.859zM28 6.5v17c0 1.375-1.125 2.5-2.5 2.5h-23c-1.375 0-2.5-1.125-2.5-2.5v-17c0-1.375 1.125-2.5 2.5-2.5h23c1.375 0 2.5 1.125 2.5 2.5z"></path>
        </svg>
        break;

      case 'arrow-right':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>Envelope</title>
        <path d="M8.578 16.594l4.594-4.594-4.594-4.594 1.406-1.406 6 6-6 6z"></path>
        </svg>
        break;

      case 'user':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>User</title>
        <path d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
        </svg>
        break;

      case 'users':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32">
        <title>Users</title>
        <path d="M24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
        <path d="M10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146z"></path>
        </svg>
        break;

      case 'calendar':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>Users</title>
        <path d="M12.048 16.961c-0.178 0.257-0.395 0.901-0.652 1.059-0.257 0.157-0.547 0.267-0.869 0.328-0.323 0.062-0.657 0.089-1.002 0.079v1.527h2.467v6.046h1.991v-9.996h-1.584c-0.056 0.381-0.173 0.7-0.351 0.957zM23 8h2c0.553 0 1-0.448 1-1v-6c0-0.552-0.447-1-1-1h-2c-0.553 0-1 0.448-1 1v6c0 0.552 0.447 1 1 1zM7 8h2c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1zM30 4h-2v5c0 0.552-0.447 1-1 1h-6c-0.553 0-1-0.448-1-1v-5h-8v5c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-5h-2c-1.104 0-2 0.896-2 2v24c0 1.104 0.896 2 2 2h28c1.104 0 2-0.896 2-2v-24c0-1.104-0.896-2-2-2zM30 29c0 0.553-0.447 1-1 1h-26c-0.552 0-1-0.447-1-1v-16c0-0.552 0.448-1 1-1h26c0.553 0 1 0.448 1 1v16zM15.985 17.982h4.968c-0.936 1.152-1.689 2.325-2.265 3.705-0.575 1.381-0.638 2.818-0.749 4.312h2.131c0.009-0.666-0.195-1.385-0.051-2.156 0.146-0.771 0.352-1.532 0.617-2.285 0.267-0.752 0.598-1.461 0.996-2.127 0.396-0.667 0.853-1.229 1.367-1.686v-1.742h-7.015v1.979z"></path>
        </svg>
        break;

      case 'plus':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>Users</title>
        <path d="M18 10h-4v-4c0-1.104-0.896-2-2-2s-2 0.896-2 2l0.071 4h-4.071c-1.104 0-2 0.896-2 2s0.896 2 2 2l4.071-0.071-0.071 4.071c0 1.104 0.896 2 2 2s2-0.896 2-2v-4.071l4 0.071c1.104 0 2-0.896 2-2s-0.896-2-2-2z"></path>
        </svg>
        break;

      case 'close':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>Close</title>
        <path d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path>
        </svg>
        break;

      case 'question':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
        <title>Question</title>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18 33.8313C26.7434 33.8313 33.8313 26.7434 33.8313 18C33.8313 9.2566 26.7434 2.16867 18 2.16867C9.2566 2.16867 2.16867 9.2566 2.16867 18C2.16867 26.7434 9.2566 33.8313 18 33.8313ZM18 36C27.9411 36 36 27.9411 36 18C36 8.05888 27.9411 0 18 0C8.05888 0 0 8.05888 0 18C0 27.9411 8.05888 36 18 36Z" fill="#011722"/>
        <path d="M16.1438 22.5343C16.1612 21.501 16.2784 20.6848 16.4955 20.0856C16.7126 19.4865 17.1554 18.8222 17.824 18.0929L19.5302 16.3345C20.2596 15.5096 20.6243 14.6239 20.6243 13.6775C20.6243 12.7657 20.3855 12.0537 19.908 11.5414C19.4304 11.0204 18.7357 10.7599 17.824 10.7599C16.9383 10.7599 16.2263 10.9944 15.6879 11.4632C15.1496 11.9321 14.8804 12.5617 14.8804 13.3518H12.4708C12.4882 11.9452 12.9875 10.812 13.9687 9.95238C14.9586 9.08406 16.2437 8.6499 17.824 8.6499C19.4651 8.6499 20.7415 9.09274 21.6533 9.97843C22.5737 10.8554 23.0339 12.0624 23.0339 13.5993C23.0339 15.1189 22.3306 16.6167 20.9239 18.0929L19.5042 19.4995C18.8703 20.2029 18.5534 21.2144 18.5534 22.5343H16.1438ZM16.0396 26.6631C16.0396 26.2724 16.1568 25.9468 16.3913 25.6863C16.6344 25.4171 16.9904 25.2825 17.4593 25.2825C17.9282 25.2825 18.2842 25.4171 18.5273 25.6863C18.7705 25.9468 18.892 26.2724 18.892 26.6631C18.892 27.0539 18.7705 27.3795 18.5273 27.64C18.2842 27.8918 17.9282 28.0177 17.4593 28.0177C16.9904 28.0177 16.6344 27.8918 16.3913 27.64C16.1568 27.3795 16.0396 27.0539 16.0396 26.6631Z" fill="#011722"/>
        </svg>
        break;
      
      case 'person-user':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>Person User</title>
        <path d="M12 12.984q1.5 0 3.281 0.422t3.258 1.406 1.477 2.203v3h-16.031v-3q0-1.219 1.477-2.203t3.258-1.406 3.281-0.422zM12 3.984q1.641 0 2.813 1.195t1.172 2.836-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813 1.172-2.836 2.813-1.195zM12 14.906q-2.063 0-4.078 0.773t-2.016 1.336v1.078h12.188v-1.078q0-0.563-2.016-1.336t-4.078-0.773zM12 5.906q-0.891 0-1.5 0.609t-0.609 1.5 0.609 1.477 1.5 0.586 1.5-0.586 0.609-1.477-0.609-1.5-1.5-0.609z" fill="#024060"></path>
        </svg>
        break;

      case 'information':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>Information</title>
        <path d="M17 22v-7h-3v1h2v6h-2v1h5v-1h-2zM16.5 29v0 0c-6.904 0-12.5-5.596-12.5-12.5s5.596-12.5 12.5-12.5c6.904 0 12.5 5.596 12.5 12.5s-5.596 12.5-12.5 12.5zM16.5 28c6.351 0 11.5-5.149 11.5-11.5s-5.149-11.5-11.5-11.5c-6.351 0-11.5 5.149-11.5 11.5s5.149 11.5 11.5 11.5v0 0zM16.5 13c0.828 0 1.5-0.672 1.5-1.5s-0.672-1.5-1.5-1.5c-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5v0 0z"></path>
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
