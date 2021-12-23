import '../styles/app.css'
import Head from 'next/head'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './../reducers/rootReducer'
import {GOOGLE_MAPS, GOOGLE_ANALYTICS} from '../config'
import {useEffect} from 'react'
import ReactGA from 'react-ga'

const UA = GOOGLE_ANALYTICS

ReactGA.initialize(UA)
// store
const store = createStore(rootReducer, composeWithDevTools())

const googleSource = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS}&libraries=places`

function MyApp({ Component, pageProps }) {
  
  return <>
    <Head>
      <title>Significard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/significard.png"/>
      <link rel="mask-icon" sizes="32x32" href="/significard.png" color="#003e5f" />
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link href="https://fonts.googleapis.com/css2?family=Sanchez&display=swap" rel="stylesheet"></link>
      <script type="text/javascript" src="DragDropTouch.js"></script>
      <script src={googleSource}></script>
    </Head>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>
}

export default MyApp
