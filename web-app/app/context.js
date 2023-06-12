import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBrwt3QbVyLrAK9dEkDbp60pm2yetzFCoU",
    authDomain: "drivense-connect.firebaseapp.com",
    projectId: "drivense-connect",
    storageBucket: "drivense-connect.appspot.com",
    messagingSenderId: "421311264180",
    appId: "1:421311264180:web:5107083022f710e8c7eee1",
    measurementId: "G-GHVX87GKQT"
};

const signedOutState = 'signedOutState'
const unknownState = 'unknownState'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)
export const firebaseFirestore = getFirestore(app)
export const firebaseStorage = getStorage(app)

const formatAuthUser = (user) => ({
    uid: user.uid,
    email: user.email
})

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const authStateChanged = async (authState) => {
        setAuthUser(unknownState)
        setLoading(true)
        if (!authState) {
            setAuthUser(signedOutState)
            setLoading(false)
            return
        } else if (authState) {
            setLoading(true)
            const formattedUser = formatAuthUser(authState)
            setAuthUser(formattedUser)
            setLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, authStateChanged)
        return () => unsubscribe()
    }, [])

    return {
        authUser,
        loading
    }
}