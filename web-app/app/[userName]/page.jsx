import { initializeApp } from 'firebase/app';
import { ref, getDownloadURL, uploadString, getStorage } from 'firebase/storage'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import Visitor from './visitor';
import '../../styles/profile.css'

const firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXXXXX",
    projectId: "XXXXXXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXXXXXX",
    measurementId: "XXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const storage = getStorage(app)

export async function generateMetadata({ params }) {
    // read route params
    const userName = params.userName;
    const firstName = userName.substring(0, userName.indexOf('-'))
    const lastName = userName.substring(userName.indexOf('-') + 1, userName.length)
    const reference = ref(storage, `user-qr-codes/${lastName}-${firstName}-qr-code`)
    const qrCodeUrl = await getDownloadURL(reference)
      
    return {
        title: `${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}'s Connect Profile`,
        description: `${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}'s Connect Profile`,
        openGraph: {
            title: `Connect with ${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}`,
            description: `${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}'s Connect Profile`,
            url: `https://www.drivense.com/${firstName}-${lastName}/?visitor=true`,
            siteName: 'Drivense',
            images: {
                url: qrCodeUrl,
                width: 100,
                height: 200
            },
            local: 'en-US',
            type: 'website',
        },
    };
}

export default async function VisitorView({ params }) {
    const firstName = params.userName.substring(0, params.userName.indexOf('-'))
    const lastName = params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length)
    const docRef = doc(firestore, 'users', `${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
    const docSnap = await getDoc(docRef)

    return (
        <Visitor userData={docSnap.data()} />
    )
}
