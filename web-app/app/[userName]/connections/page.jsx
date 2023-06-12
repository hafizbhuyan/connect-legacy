'use client'
import { Header, BottomNavbar, Loading } from '../../common'
import { useEffect, useState } from 'react'
import '../../../styles/profile.css'
import { firebaseFirestore } from '../../context'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useAuth } from '../../layout'
import { useRouter } from 'next/navigation'

export default function Connections({ params }) {
    const firstName = params.userName.substring(0, params.userName.indexOf('-'))
    const lastName = params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length)
    const userDocument = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const [connections, setConnections] = useState([])
    const { authUser, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authUser === 'signedOutState' || authUser === 'unknownState') {
            router.push('/log-in')
            alert("Please log into your account")
        }
        getConnections()
    }, [])

    async function getConnections () {
        const connectionDoc = await getDoc(userDocument)
        setConnections(connectionDoc.data().connections)
    }

    function getActualDate(dateToConvert) {
        const date = dateToConvert.toDate()
        const validDate = new Date(date)
        const year = validDate.getFullYear()
        const month = validDate.getMonth() + 1
        const day = validDate.getDate()
        const dayOfWeek = weekday[validDate.getDay()]

        return `${dayOfWeek} ${month}/${day}/${year}`
    }

    if (loading || authUser === 'signedOutState' || authUser === 'unknownState') {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Header pageTitle={`${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}'s Connections | Drivense`} />

            <div class='container'>
                <h2>{connections.length > 0 ? 'Your connections' : ''}</h2>

                <div class='connection-container'>
                    {
                        connections.length > 0 ? connections.map((connection, index) => {
                            return (
                                <div class='connection' key={index}>
                                    <h4>{connection.name}</h4>
                                    <h4>{connection.position} at {connection.company}</h4>
                                    <h4>You connected in {connection.meetingLocation} on {getActualDate(connection.connectedOn)}</h4>
                                    <Link href={`mailto: ${connection.email}`}>
                                        <h4>Message {connection.email}</h4>
                                    </Link>
                                </div>
                            )
                        }) : <h2>Nothing yet, start making those connections!</h2>
                    }
                </div>
            </div>
            
            <BottomNavbar firstName={firstName} lastName={lastName} />
        </>
    )
}