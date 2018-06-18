import firebase from 'firebase/app';
import 'firebase/firestore';

import * as actions from '../constants';

firebase.initializeApp({
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
});

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

export const broadcast = async (uid, track) => {
  await db.collection('broadcasters').doc(uid).set({
    ...track,
    updated: firebase.firestore.FieldValue.serverTimestamp(),
    isBroadcasting: true,
  });
};

export const stopBroadcasting = async (uid) => {
  await db.collection('broadcasters').doc(uid).update({
    updated: firebase.firestore.FieldValue.serverTimestamp(),
    isBroadcasting: false,
  });
};

export const getBroadcasters = async (uid, dispatch) => {
  return db.collection('broadcasters')
    .where('isBroadcasting', '==', true)
    .onSnapshot((querySnapshot) => {
      const broadcasters = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (uid !== doc.id) {
          broadcasters.push({
            uid: doc.id,
            ...data,
          });
        }
      });

      dispatch({
        type: actions.BROADCASTERS_SET,
        payload: broadcasters,
      });
    });
};