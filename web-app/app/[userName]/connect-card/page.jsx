'use client'
import { useState, useEffect, createRef } from 'react'
import { BottomNavbar, Header, Loading } from '../../common'
import Image from 'next/image'
import Link from 'next/link'
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { firebaseFirestore } from '../../context'
import '../../../styles/profile.css'
import { useAuth } from '../../layout'
import { useRouter } from 'next/navigation'
import Modal from 'react-modal'
import * as Colors from '../../colors'

export default function ConnectCard({ params }) {
    const firstName = params.userName.substring(0, params.userName.indexOf('-'))
    const lastName = params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length)
    const userDocument = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)

    const [cardBgColor, setCardBgColor] = useState('#000428')
    const [cardTextColor, setCardTextColor] = useState('#FBFEF9')
    const [topText, setTopText] = useState('[Top Text Placeholder]')
    const [middleText, setMiddleText] = useState('[Middle Text Placeholder]')
    const [bottomText, setBottomText] = useState('[Bottom Text Placeholder]')
    const cardRef = createRef()
    const { authUser, loading } = useAuth()
    const router = useRouter()
    const colors = [
        Colors.YellowOchre,
        Colors.RawSienna,
        Colors.BurntSienna,
        Colors.Orange,
        Colors.Vermilion,
        Colors.Crimson,
        Colors.Scarlet,
        Colors.Magenta,
        Colors.Purple,
        Colors.PhthaloBlue,
        Colors.DeepCyanBlue,
        Colors.CobaltBlue,
        Colors.CeruleanBlue,
        Colors.Viridian,
        Colors.MonastralGreen,
        Colors.SapGreen,
        Colors.PhthaloGreen,
        Colors.RawUmber,
        Colors.BurntUmber,
        Colors.LampBlack,
        Colors.Grey,
        Colors.TitaniumWhite
    ]

    const [colorModal, setColorModal] = useState(false)

    useEffect(() => {
        if (authUser === 'signedOutState' || authUser === 'unknownState') {
            router.push('/log-in')
            alert("Please log into your account")
        }
        LoadData()
    }, [])

    async function LoadData() {
        const cardRef = await getDoc(userDocument)
        const companyRef = await getDoc(companyDoc)
        const cardData = cardRef.data().card
        setCardBgColor(cardData.bgColor)
        setCardTextColor(cardData.textColor)
        setTopText(cardData.topText)
        setMiddleText(cardData.middleText)
        setBottomText(cardData.bottomText)
    }

    async function UpdateBgColor(chosenColor) {
        setCardBgColor(chosenColor.backgroundColor)

        const newCardDetails = {
            bgColor: chosenColor.backgroundColor,
            textColor: cardTextColor,
            topText: topText,
            middleText: middleText,
            bottomText: bottomText
        }

        await updateDoc(userDocument, {
            card: newCardDetails
        })
    }

    async function UpdateTextColor(chosenColor) {
        setCardTextColor(chosenColor.backgroundColor)

        const newCardDetails = {
            bgColor: cardBgColor,
            textColor: chosenColor.backgroundColor,
            topText: topText,
            middleText: middleText,
            bottomText: bottomText
        }

        await updateDoc(userDocument, {
            card: newCardDetails
        })
    }

    async function UpdateTopText() {
        const input = document.getElementById('topText').value
        setTopText(input)

        const newCardDetails = {
            bgColor: cardBgColor,
            textColor: cardTextColor,
            topText: input,
            middleText: middleText,
            bottomText: bottomText
        }

        await updateDoc(userDocument, {
            card: newCardDetails
        })
    }

    async function UpdateMiddleText() {
        const input = document.getElementById('middleText').value
        setMiddleText(input)

        const newCardDetails = {
            bgColor: cardBgColor,
            textColor: cardTextColor,
            topText: topText,
            middleText: input,
            bottomText: bottomText
        }

        await updateDoc(userDocument, {
            card: newCardDetails
        })
    }

    async function UpdateBottomText() {
        const input = document.getElementById('bottomText').value
        setBottomText(input)

        const newCardDetails = {
            bgColor: cardBgColor,
            textColor: cardTextColor,
            topText: topText,
            middleText: middleText,
            bottomText: input
        }

        await updateDoc(userDocument, {
            card: newCardDetails
        })
    }

    if (loading || authUser === 'signedOutState' || authUser === 'unknownState') {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Header pageTitle={`${firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)}'s Connect Card | Drivense`} />

            <div class='container'>
                <h2>Customize and order your card from here.</h2>

                <div class='card-view' ref={cardRef}>

                    <h4>Card Front</h4>

                    <div class='card' style={{
                        backgroundColor: cardBgColor,
                        color: cardTextColor
                    }}>
                        <h2>
                            {topText}
                        </h2>
                        <hr style={{ width: '50%', color: cardTextColor }} />
                        <h4>
                            {middleText}
                        </h4>
                        <h4>
                            {bottomText}
                        </h4>
                    </div>

                </div>

                <div class='notes'>
                    <h2>
                        Notes
                    </h2>
                    <h4>
                        Take a screenshot of your design, then email it to us and we&apos;ll deliver it to you asap!
                        Edit the text, and colors from here. The back will have your company&apos;s logo.
                        We are only offering one layout at this time.
                    </h4>
                    <p>
                        For colors, it&apos;s best to use a HEX code. You can find them at!
                        <Link
                            style={{
                                color: 'yellow'
                            }}
                            target='_blank'
                            href={'https://www.google.com/search?q=hex+color&oq=hex+&aqs=chrome.1.69i57j35i39j0i433i512l5j69i65.1337j0j7&sourceid=chrome&ie=UTF-8'}>
                            Google&apos;s Hex Generator
                        </Link> (Please include the #)
                    </p>
                    <p>
                        PS: The placeholders are just examples. You can and should put what you want. It is <i>YOUR</i> Connect Card!
                    </p>
                </div>

                <div class='card-editor-view'>

                    <div class='card-editor'>
                        <button
                            onClick={() => setColorModal(true)}
                            style={{
                                backgroundColor: '#FBFEF9',
                                color: '#000428',
                                width: '40%',
                                height: 'auto',
                                padding: '2rem',
                                borderRadius: '2rem'
                            }}
                        >
                            Update the Background and Text color
                        </button>

                        <fieldset>
                            <label>Top Text</label>
                            <input type='text' id='topText' name='topText' placeholder='Ex: Hafiz Bhuyan' />
                            <button
                                onClick={() => UpdateTopText()}
                                class='button'
                            >
                                Update
                            </button>
                        </fieldset>

                        <fieldset>
                            <label>Middle Text</label>
                            <input type='text' id='middleText' name='middleText' placeholder='Ex: Co-Founder & CEO at Drivense' />
                            <button
                                onClick={() => UpdateMiddleText()}
                                class='button'
                            >
                                Update
                            </button>
                        </fieldset>

                        <fieldset>
                            <label>Bottom Text</label>
                            <input type='text' id='bottomText' name='bottomText' placeholder='Ex: hafizbhuyan@drivense.com' />
                            <button
                                onClick={() => UpdateBottomText()}
                                class='button'
                            >
                                Update
                            </button>
                        </fieldset>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={colorModal}
                style={{
                    content: {
                        width: '75%',
                        height: '75%',
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
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <h4>Background Color</h4>
                    <div class='color-options'>
                        {
                            colors.map((color, index) => {
                                return (
                                    <div class='color' key={index} onClick={() => UpdateBgColor(color)}>
                                        <div style={{ width: 50, height: 50, backgroundColor: color.backgroundColor }}></div>
                                        <p>{color.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <h4>Text Color</h4>
                    <div class='color-options'>
                    {
                            colors.map((color, index) => {
                                return (
                                    <div class='color' key={index} onClick={() => UpdateTextColor(color)}>
                                        <div style={{ width: 50, height: 50, backgroundColor: color.backgroundColor }}></div>
                                        <p>{color.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <button
                    onClick={() => setColorModal(false)}
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

            <BottomNavbar firstName={firstName} lastName={lastName} />
        </>
    )
}