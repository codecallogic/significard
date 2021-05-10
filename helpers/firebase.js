import firebase from 'firebase'

export function initializeFirebase () {
  if (!firebase.apps.length) {
    return firebase.initializeApp({
      apiKey: 'AIzaSyDuP7u909hVark60eNUWEBLEktmilJmgM0',
      authDomain: 'significard.firebaseapp.com'
    })
  }else {
    return firebase.app(); // if already initialized, use that one
  }
}