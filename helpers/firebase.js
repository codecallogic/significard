import firebase from 'firebase'
import {FIREBASE_DOMAIN, FIREBASE_KEY} from '../config'

const key = FIREBASE_KEY
const domain = FIREBASE_DOMAIN

export function initializeFirebase () {
  if (!firebase.apps.length) {
    return firebase.initializeApp({
      apiKey: key,
      authDomain: domain
    })
  }else {
    return firebase.app(); // if already initialized, use that one
  }
}