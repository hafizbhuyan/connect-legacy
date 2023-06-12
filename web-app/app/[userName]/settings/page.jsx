'use client'
import { Header, BottomNavbar, Loading } from '../../common'
import { useEffect, useState } from 'react'
import '../../../styles/profile.css'
import {
    FaEnvelope,
    FaCcStripe,
    FaPowerOff,
    FaUserAlt
} from 'react-icons/fa'
import { firebaseAuth } from '../../context'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../layout'
import Modal from 'react-modal'

export default function Settings({ params }) {
    const firstName = params.userName.substring(0, params.userName.indexOf('-'))
    const lastName = params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length)
    const [accountDetailModal, setAccountDetailModal] = useState(false)
    const router = useRouter()
    const { authUser, loading } = useAuth()

    useEffect(() => {
        if (authUser === 'signedOutState' || authUser === 'unknownState') {
            router.push('/log-in')
            alert("Please log into your account")
        }
    }, [])

    if (loading || authUser === 'signedOutState' || authUser === 'unknownState') {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Header pageTitle={'Settings | Drivense'} />

            <div class='container'>
                <h2>
                    Here you can see your account details
                </h2>
                {/* <button class='setting'>
                    <FaEnvelope class='setting-icon' color={'#000428'} size={50} />
                    <h4>Update Email</h4>
                </button>

                <button class='setting'>
                    <FaCcStripe class='setting-icon' color={'#000428'} size={50} />
                    <h4>Payment Settings</h4>
                </button> */}
                <button class='setting' onClick={() => setAccountDetailModal(true)}>
                    <FaUserAlt class='setting-icon' color={'#000428'} size={50} />
                    <h4>Account Details</h4>
                </button>

                <button class='setting' onClick={() => firebaseAuth.signOut().then(() => {
                    router.push('/log-in')
                    alert("You've been successfully signed out.")
                })}>
                    <FaPowerOff class='setting-icon' color={'#000428'} size={50} />
                    <h4>Sign Out</h4>
                </button>
            </div>

            <Modal
                isOpen={accountDetailModal}
                style={{
                    content: {
                        width: '35%',
                        height: '35%',
                        backgroundColor: '#FBFEF9',
                        color: '#000428',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
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
                <h4>User ID: {authUser.uid}</h4>
                <h4>Email: {authUser.email}</h4>

                <button
                    class='button'
                    onClick={() => setAccountDetailModal(false)}
                    style={{
                        width: '25%',
                        padding: '1rem',
                        backgroundColor: '#000428',
                        color: '#FBFEF9',
                        borderRadius: '2rem',
                        marginTop: '2rem'
                    }}
                >
                    Close
                </button>
            </Modal>

            <BottomNavbar firstName={firstName} lastName={lastName} />
        </>
    )
}