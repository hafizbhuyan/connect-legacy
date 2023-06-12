'use client'
import { useEffect, useReducer, useState, createRef, useRef } from 'react'
import { Header, BottomNavbar, Loading } from '../../common'
import '../../../styles/profile.css'
import Modal from 'react-modal'
import QRCode from 'react-qr-code'
import { QrReader } from 'react-qr-reader'
import { doc, updateDoc, getDoc, arrayUnion, increment } from 'firebase/firestore'
import { firebaseFirestore, firebaseStorage } from '../../context'
import { useAuth } from '../../layout'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import { ref, getDownloadURL, uploadString } from 'firebase/storage'
import {
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    EmailIcon,
    EmailShareButton,
    TwitterIcon,
    TwitterShareButton,
    FacebookIcon,
    FacebookShareButton
} from 'react-share'

export default function Connect({ params }) {
    // state variables
    const [readModal, setReadModal] = useState(false)
    const [shareModal, setShareModal] = useState(false)
    const [items, setItems] = useState([])
    const [meetingLocation, setMeetingLocation] = useState('')
    const [qrCodeUrl, setQrCodeUrl] = useState('')

    // global variables
    const firstName = params.userName.substring(0, params.userName.indexOf('-'))
    const lastName = params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length)
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const mainUserDocument = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
    const { authUser, loading } = useAuth()
    const router = useRouter()
    const qrRef = useRef(null)
    const visitorUrl = `https://www.drivense.com/${firstName}-${lastName}/?visitor=true`

    useEffect(() => {
        if (authUser === 'signedOutState' || authUser === 'unknownState') {
            router.push('/log-in')
            alert("Please log into your account")
        }
        LoadItems()
        navigator.geolocation.getCurrentPosition(HandleGeo)
    }, [])

    async function HandleGeo(position) {
        const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.f7c7f8ccf820834447bc6e65c32dd638&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
        const geo = await res.json()
        const city = geo.address.city
        const state = geo.address.state
        setMeetingLocation(`${city}, ${state}`)
    }

    async function LoadItems() {
        const docSnap = await getDoc(mainUserDocument)
        setItems(docSnap.data().items)
    }

    async function ReadQRCode(data) {
        setReadModal(false)

        const dataFirstName = data.substring(data.indexOf('m/') + 2, data.indexOf('-'))
        const dataLastName = data.substring(data.indexOf('-') + 1, data.indexOf('&'))

        // check if this person has an account
        const scannerUserDocument = doc(firebaseFirestore, `users/${dataLastName.toLowerCase()}-${dataFirstName.toLowerCase()}`)
        const scannerUserRef = await getDoc(scannerUserDocument)
        const mainUserRef = await getDoc(mainUserDocument)

        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        const dayOfWeek = weekday[new Date().getDay()]

        // if they don't ???
        if (!scannerUserRef.exists()) {

            const newConnection = {
                name: `${firstName} ${lastName}`,
                email: '',
                meetingLocation: meetingLocation,
                connectedOn: `${dayOfWeek} ${month}/${day}/${year}`
            }

            await updateDoc(mainUserDocument, {
                connections: arrayUnion(newConnection),
                totalConnections: increment(1)
            })
        }

        // if they do, add current user and data user to each others accounts and increase total connections by 1
        await updateDoc(scannerUserDocument, {
            connections: [scannerUserRef.data().connections, {
                name: `${firstName} ${lastName}`,
                email: mainUserRef.data().email,
                company: mainUserRef.data().compay,
                position: mainUserRef.data().position,
                meetingLocation: meetingLocation,
                connectedOn: `${dayOfWeek} ${month}/${day}/${year}`
            }],
            totalConnections: increment(1)
        })
        await updateDoc(mainUserDocument, {
            connections: [mainUserRef.data().connections, {
                name: `${dataFirstName} ${dataLastName}`,
                email: scannerUserRef.data().email,
                company: scannerUserRef.data().company,
                position: scannerUserRef.data().position,
                meetingLocation: meetingLocation,
                connectedOn: `${dayOfWeek} ${month}/${day}/${year}`
            }],
            totalConnections: increment(1)
        })

        alert(`Successfully connected with ${dataFirstName} ${dataLastName}`)
    }

    async function ShareQRCode() {
        html2canvas(document.querySelector('#qr-container')).then(async canvas => {
            const screenshotURL = canvas.toDataURL('png')
            const reference = ref(firebaseStorage, `user-qr-codes/${lastName.toLowerCase()}-${firstName.toLowerCase()}-qr-code`)
            await uploadString(reference, screenshotURL, 'data_url').then(async snapshot => {
                const downloadUrl = await getDownloadURL(snapshot.ref)
                setQrCodeUrl(downloadUrl)
            })
        })
    }

    async function ShareToLinkedIn() {
        const linkedinUrl = 'https://api.linkedin.com/v2/ugcPosts'
        const requestBody = {
            "author": "urn:li:person:8675309",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": "Hello World! This is my first Share on LinkedIn!"
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        await fetch(linkedinUrl, {
            headers: {
                'Content-Type': 'X-Restli-Protocol-Version'
            },
            method: 'POST',
            body: requestBody
        })
            .then(response => console.log(`Response: ${response.status}`))
            .catch(e => console.log(`Error: ${e}`))
    }

    if (loading || authUser === 'signedOutState' || authUser === 'unknownState') {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Header pageTitle={`Connect with ${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)} | Drivense`} />

            <div class='container'>
                <h4>
                    Here&apos;s where you can virtually connect with others.
                    Send your QR code to others, or scan someone else&apos;s QR code.
                </h4>
                <div class='qr-container' id='qr-container' ref={qrRef}>
                    <h4>Connect with {firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}</h4>
                    <QRCode
                        value={`https://www.drivense.com/${firstName}-${lastName}/?visitor=true`}
                    />
                    <p style={{ fontSize: 10 }}>Created by Drivense</p>
                </div>

                <div class="button-container">
                    <button onClick={() => {
                        setShareModal(true)
                    }}>
                        Send
                    </button>
                    <button id='qr_reader' onClick={() => setReadModal(true)}>
                        Read
                    </button>
                </div>

                <Modal
                    isOpen={readModal}
                    style={{
                        content: {
                            width: '50%',
                            height: '50%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '2rem'
                        },
                        overlay: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }}
                >
                    <QrReader
                        onResult={(result, error) => result && !error ? ReadQRCode(result.getText()) : null}
                        constraints={{
                            facingMode: 'environment',
                        }}
                        containerStyle={{
                            width: '50%',
                            height: '50%'
                        }}
                        id='qr_reader'
                    />
                    <button
                        onClick={() => setReadModal(false)}
                        style={{
                            width: '25%',
                            padding: '1rem',
                            borderRadius: '1rem',
                            backgroundColor: '#000428',
                            color: '#FBFEF9',
                            position: 'absolute',
                        }}
                    >
                        Close
                    </button>
                </Modal>

                <Modal
                    isOpen={shareModal}
                    style={{
                        content: {
                            width: '50%',
                            height: '50%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '2rem'
                        },
                        overlay: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }}
                >
                    <div class='share-container'>
                        {
                            items.length > 0 ? items.map((item, index) => {
                                if (item.name === 'Email') {
                                    return (
                                        <EmailShareButton
                                            id='email_share'
                                            key={index}
                                            url={qrCodeUrl}
                                        >
                                            <EmailIcon class='share-item' />
                                        </EmailShareButton>
                                    )
                                }
                                if (item.name === 'LinkedIn') {
                                    return (
                                        <LinkedinShareButton
                                            id='linkedin_share'
                                            key={index}
                                            url={qrCodeUrl}
                                        >
                                            <LinkedinIcon class='share-item' />
                                        </LinkedinShareButton>
                                    )
                                }
                                if (item.name === 'Facebook') {
                                    return (
                                        <FacebookShareButton
                                            id='facebook_share'
                                            key={index}
                                            url={qrCodeUrl}
                                        >
                                            <FacebookIcon class='share-item' />
                                        </FacebookShareButton>
                                    )
                                }
                                if (item.name === 'Twitter') {
                                    return (
                                        <TwitterShareButton
                                            id='twitter_share'
                                            key={index}
                                            url={"http://twitter.com/home?status=Isn'teting fun?"}                                            
                                        >
                                            <TwitterIcon class='share-item' />
                                        </TwitterShareButton>
                                    )
                                }
                                if (item.name === 'Reddit') {
                                    return (
                                        <RedditShareButton
                                            id='reddit_share'
                                            key={index}
                                            url={qrCodeUrl}
                                        >
                                            <RedditIcon class='share-item' />
                                        </RedditShareButton>
                                    )
                                }
                            })
                            : <></>
                        }
                    </div>
                    <button
                        onClick={() => setShareModal(false)}
                        style={{
                            width: '25%',
                            padding: '1rem',
                            borderRadius: '1rem',
                            backgroundColor: '#000428',
                            color: '#FBFEF9'
                        }}
                    >
                        Close
                    </button>
                </Modal>
            </div>

            <BottomNavbar firstName={firstName} lastName={lastName} />


        </>
    )
}