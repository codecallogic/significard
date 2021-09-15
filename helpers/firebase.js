import firebase from 'firebase'
import {FIREBASE} from '../config'

export function initializeFirebase () {
  if (!firebase.apps.length) {
    return firebase.initializeApp({
      apiKey: 'AIzaSyBIXLxwsNZqXveBVpiQzavFdvOrtY8tu5E',
      authDomain: 'significard-5f5b6.firebaseapp.com'
    })
  }else {
    return firebase.app(); // if already initialized, use that one
  }
}