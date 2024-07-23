import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCTlCFAbuH-NyFm47NDFJoGNTds8H_swFM',
  authDomain: 'whack-a-trump-62089.firebaseapp.com',
  projectId: 'whack-a-trump-62089',
  storageBucket: 'whack-a-trump-62089.appspot.com',
  messagingSenderId: '11581681361',
  appId: '1:11581681361:web:83282e6fa2bf0bdbbb5ff0',
  measurementId: 'G-RFPS1FF2HD'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
