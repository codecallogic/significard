import '../styles/app.css'
import Head from 'next/head'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './../reducers/rootReducer'
import {GOOGLE_MAPS, GOOGLE_ANALYTICS} from '../config'
import {useEffect, useState} from 'react'
import ReactGA from 'react-ga'
import { useRouter } from "next/router";

const UA = GOOGLE_ANALYTICS

ReactGA.initialize(UA)
// store
const store = createStore(rootReducer, composeWithDevTools())

const googleSource = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS}&libraries=places`

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // useEffect(() => {
  //   router.events.on("routeChangeError", (e) => setLoading(false));
  //   router.events.on("routeChangeStart", (e) => setLoading(false));
  //   router.events.on("routeChangeComplete", (e) => setLoading(true));

  //   return () => {
  //     router.events.off("routeChangeError", (e) => setLoading(false));
  //     router.events.off("routeChangeStart", (e) => setLoading(false));
  //     router.events.off("routeChangeComplete", (e) => setLoading(true));
  //   };
  // }, [router.events]);
  
  return <>
    <>
    <Head>
      <title>Significard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      <meta name="description" content="A Netflix of eco-friendly greeting cards - Significard is a personalized subscription service that picks, schedules, and mails cards that are actually relatable."></meta>
      <meta name="keywords" content="birthday cards, birthday gift, greeting card, birthday gift ideas"></meta>
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
  </>
}

export default MyApp
