'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../layout'
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa'
import Modal from 'react-modal'
import { BottomNavbar, Loading, Header } from '../../common'
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { firebaseFirestore, firebaseStorage } from '../../context'
import { ref, getDownloadURL, uploadString } from 'firebase/storage'
import ImageUploading from 'react-images-uploading'
import * as Items from './items.js'
import Link from 'next/link'

export default function Profile({ params }) {
    const [showModal, setShowModal] = useState(false)
    const [itemModal, setItemModal] = useState(false)
    const [itemValueModal, setItemValueModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [picture, setPicture] = useState('')
    const [totalConnections, setTotalConnections] = useState(0)

    const [firstName, setFirstName] = useState(params.userName.substring(0, params.userName.indexOf('-')))
    const [lastName, setLastName] = useState(params.userName.substring(params.userName.indexOf('-') + 1, params.userName.length))
    const docRef = doc(firebaseFirestore, 'users', `${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
    const { get } = useSearchParams(`www.drivense.com/${firstName}-${lastName}/?visitor=true`)

    // const userDocument = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
    const [modalItems, setModalItems] = useState([
        Items.Email,
        Items.Phone,
        Items.City,
        Items.Quote,
        Items.Link,
        Items.LinkedIn,
        Items.Instagram,
        Items.Facebook,
        Items.Twitter,
        Items.Snapchat,
        Items.Reddit,
        Items.GitHub,
        Items.F6S,
        Items.GitLab,
        Items.CodePen,
        Items.Figma,
        Items.SoundCloud,
        Items.Spotify,
        Items.Twitch,
        Items.AppleMusic,
        Items.Dribbble,
        Items.Crunchbase,
        Items.Medium,
        Items.Pinterest,
        Items.BitBucket,
        Items.AngelList,
        Items.Discord,
        Items.HackerNews,
        Items.ProductHunt,
        Items.StackOverflow,
        Items.YouTube,
        Items.Inside
    ])
    const [bodyItems, setBodyItems] = useState([])
    const [selectedObject, setSelectedObject] = useState()

    const router = useRouter()
    const { authUser, loading } = useAuth()

    useEffect(() => {
        if (authUser === 'signedOutState' || authUser === 'unknownState') {
            router.push('/log-in')
            alert("Please log into your account")
        }
        LoadData()
    }, [])

    async function LoadData() {
        const docSnap = await getDoc(docRef)
        setFirstName(firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length))
        setLastName(lastName.charAt(0).toUpperCase() + lastName.substring(1, lastName.length))
        setCompany(docSnap.data().company ? docSnap.data().company : '')
        setPosition(docSnap.data().position ? docSnap.data().position : '')
        setPicture(docSnap.data().picture ? docSnap.data().picture : '')
        setTotalConnections(docSnap.data().totalConnections)
        setBodyItems(docSnap.data().items)
        bodyItems.forEach(a => {
            const selectedItemIndex = modalItems.indexOf(modalItems.find(b => b.name === a.name))
            modalItems.splice(selectedItemIndex, 1)
        })
    }

    async function HandleUpdates() {
        const inputCompany = document.getElementById('company').value
        const inputPosition = document.getElementById('position').value

        if (inputCompany !== company) {
            setCompany(inputCompany)
            await updateDoc(docRef, {
                company: inputCompany
            })
        }
        if (inputPosition !== position) {
            setPosition(inputPosition)
            await updateDoc(docRef, {
                position: inputPosition
            })
        }

        setShowModal(false)
    }

    async function HandleImages(imageList) {
        const reference = ref(firebaseStorage, `profile-pictures/${lastName.toLowerCase()}-${firstName.toLowerCase()}-profile-picture`)
        await uploadString(reference, imageList[0].dataURL, 'data_url').then(async snapshot => {
            const downloadUrl = await getDownloadURL(snapshot.ref)
            await updateDoc(docRef, {
                picture: downloadUrl
            })
            const pictureDoc = await getDoc(docRef)
            setPicture(pictureDoc.data().picture)
            setShowModal(false)
            alert('Your profile picture was updated!')
        })
    }

    async function AddItem() {
        const newValueInput = document.getElementById('newValue').value

        if (
            selectedObject.name === 'Stack Overflow' ||
            selectedObject.name === 'Apple Music' ||
            selectedObject.name === 'Discord'
        ) {
            const newValueInputTwo = document.getElementById('newValueTwo').value
            const newItem = {
                name: selectedObject.name,
                picture: selectedObject.picture,
                value: {
                    id: newValueInput,
                    username: newValueInputTwo
                },
                width: selectedObject.width,
                height: selectedObject.height
            }

            bodyItems.push(newItem)
            const selectedIndex = modalItems.indexOf(selectedObject)
            modalItems.splice(selectedIndex, 1)
            await updateDoc(docRef, {
                items: arrayUnion(newItem)
            })
            const itemDoc = await getDoc(docRef)
            console.log(`Items: ${itemDoc.data().items}`)
            alert(`Your ${newItem.name} data has been added`)
            setItemValueModal(false)
            setItemModal(false)
        } else {
            const newItem = {
                name: selectedObject.name,
                picture: selectedObject.picture,
                value: newValueInput,
                width: selectedObject.width,
                height: selectedObject.height,
                clicks: selectedObject.clicks
            }

            bodyItems.push(newItem)
            const selectedIndex = modalItems.indexOf(selectedObject)
            modalItems.splice(selectedIndex, 1)
            await updateDoc(docRef, {
                items: arrayUnion(newItem)
            })
            const itemDoc = await getDoc(docRef)
            console.log(`Items: ${itemDoc.data().items}`)
            alert(`Your ${newItem.name} data has been added`)
            setItemValueModal(false)
            setItemModal(false)
        }
    }

    async function DeleteItem(item) {
        const selectedIndex = bodyItems.indexOf(item)
        const originalItem = {
            name: item.name,
            picture: item.picture,
            value: '',
            width: item.width,
            height: item.height,
            clicks: 0
        }
        bodyItems.splice(selectedIndex, 1)
        modalItems.push(originalItem)
        await updateDoc(docRef, {
            items: bodyItems
        }).then(() => {
            setDeleteModal(false)
            alert(`Your ${item.name} data has been deleted`)
        })
    }

    function ClickHandler(item) {
        // Email
        if (item.name == 'Email') {
            window.open(`mailto: ${item.value}`)
        }

        // Phone
        else if (item.name == 'Phone') {
            window.open(`tel:${item.value}`)
        }

        // City
        else if (item.name == 'City') {
            window.open(`https://www.google.com/maps/place/${item.value}`)
        }

        // Custom
        else if (item.name == 'Custom') {
            window.open(item.value)
        }

        // LinkedIn
        else if (item.name == 'LinkedIn') {
            window.open(`https://www.linkedin.com/in/${item.value}`)
        }

        // Instagram
        else if (item.name == 'Instagram') {
            window.open(`https://www.instagram.com/${item.value}`)
        }

        // Facebook
        else if (item.name == 'Facebook') {
            window.open(`https://www.facebook.com/${item.value}`)
        }

        // Twitter
        else if (item.name == 'Twitter') {
            window.open(`http://twitter.com/${item.value}`)
        }

        // Snapchat
        else if (item.name == 'Snapchat') {
            window.open(`https://www.snapchat.com/add/${item.value}`)
        }

        // Reddit
        else if (item.name == 'Reddit') {
            window.open(`https://www.reddit.com/user/${item.value}`)
        }

        // GitHub
        else if (item.name == 'GitHub') {
            window.open(`https://github.com/${item.value}`)
        }

        // F6S
        else if (item.name == 'F6S') {
            window.open(`https://www.f6s.com/${item.value}`)
        }

        else if (item.name == 'GitLab') {
            window.open(`https://www.gitlab.com/${item.value}`)
        }

        else if (item.name == 'CodePen') {
            window.open(`https://www.codepen.io/${item.value}`)
        }

        else if (item.name == 'Figma') {
            window.open(`https://www.figma.com/@${item.value}`)
        }

        // SoundCloud
        else if (item.name == 'Sound Cloud') {
            window.open(`https://www.soundcloud.com/${item.value}`)
        }

        // Spotify
        else if (item.name == 'Spotify') {
            window.open(`https://open.spotify.com/artist/${item.value}`)
        }

        // Twitch
        else if (item.name == 'Twitch') {
            window.open(`https://www.twitch.tv/${item.value}`)
        }

        // Apple Music
        else if (item.name == 'Apple Music') {
            window.open(`https://music.apple.com/us/artist/${item.value.username}/${item.value.id}`)
        }

        // Dribbble
        else if (item.name == 'Dribbble') {
            window.open(`https://dribbble.com/${item.value}`)
        }

        // CrunchBase
        else if (item.name == 'Crunchbase') {
            window.open(`https://www.crunchbase.com/person/${item.value}`)
        }

        // Medium
        else if (item.name == 'Medium') {
            window.open(`https://www.medium.com/@${item.value}`)
        }

        // Pinterest
        else if (item.name == 'Pinterest') {
            window.open(`https://www.pinterest.com/${item.value}`)
        }

        // Bit Bucket
        else if (item.name == 'BitBucket') {
            window.open(`https://bitbucket.org/${item.value}`)
        }

        // Angel List
        else if (item.name == 'Angel List') {
            window.open(`https://www.angel.co/company/${item.value}`)
        }

        // Discord
        else if (item.name == 'Discord') {
            window.open(`https://discordapp.com/users/${item.value.username}#${item.value.id}`)
        }

        // Hacker News
        else if (item.name == 'Hacker News') {
            window.open(`https://news.ycombinator.com/user?id=${item.value}`)
        }

        // Product Hunt
        else if (item.name == 'Product Hunt') {
            window.open(`https://www.producthunt.com/@${item.value}`)
        }

        // Stack Overflow
        else if (item.name == 'Stack Overflow') {
            window.open(`https://www.stackoverflow.com/users/${item.value.id}/${item.value.username}`)
        }

        else if (item.name === 'Inside') {
            window.open(`https://inside.com/p/${item.value}`)
        }

        // YouTube
        else if (item.name == 'YouTube') {
            window.open(`https://www.youtube.com/${item.value}`)
        }
    }

    if (loading || authUser === 'unknownState') {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Header pageTitle={`${firstName}'s Connect Profile`} />
            <div class='container'>
                <Link class='visitor' onClick={() => console.log()} href={`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/?visitor=true`}>
                    See how visitors will see your Profile
                </Link>
                <button class='edit' onClick={() => setShowModal(true)}>
                    <FaEdit size={25} color={'#FBFEF9'} />
                </button>
                <Image src={picture} width={350} height={350} style={{ borderRadius: '1rem' }} />
                <h2>
                    {firstName} {lastName}
                </h2>
                <h4>Connections: {totalConnections}</h4>
                <h4>
                    {position} {position && company ? 'at' : ''} {company}
                </h4>

                <div
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <button class='addItem' onClick={() => setItemModal(true)}>
                        Add Item
                        <FaPlusSquare size={50} color={'#FBFEF9'} />
                    </button>
                    <button class='addItem' onClick={() => setDeleteModal(true)}>
                        Delete Item
                        <FaTrash size={50} color={'#FBFEF9'} />
                    </button>
                </div>
                <div class='items'>
                    {
                        bodyItems.length > 0 ? bodyItems.map((item, index) => {
                            // TODO: get the click working
                            return (
                                <button key={index} onClick={() => ClickHandler(item)} class='item'>
                                    <Image src={item.picture} width={100} height={100} />
                                    <h4>{item.value}</h4>
                                    <h4>Total Clicks: {item.clicks}</h4>
                                </button>
                            )
                        }) : <></>
                    }
                </div>

                <Modal
                    isOpen={showModal}
                    style={{
                        content: {
                            width: '75%',
                            height: '75%',
                            backgroundColor: '#000428',
                            color: '#FBFEF9',
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
                    <h2>Update your information</h2>
                    <ImageUploading
                        multiple={false}
                        onChange={HandleImages}
                        value={picture}
                    >
                        {({
                            onImageUpload
                        }) => (
                            <div class='updatePicture'>
                                <h4>Profile Picture</h4>
                                <button onClick={onImageUpload}>
                                    Choose a new picture
                                </button>
                            </div>
                        )}
                    </ImageUploading>
                    <fieldset>
                        <label>Company</label>
                        <input type='text' id='company' name='company' />
                    </fieldset>
                    <fieldset>
                        <label>Position</label>
                        <input type='text' id='position' name='position' />
                    </fieldset>
                    <div class='button-container'>
                        <button onClick={() => HandleUpdates()}>
                            Save and Close
                        </button>
                        <button onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </Modal>

                <Modal
                    isOpen={itemModal}
                    style={{
                        content: {
                            width: '75%',
                            height: '75%',
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
                    <div class='add-item-container'>
                        {
                            modalItems.length > 0 ? modalItems.map((item, index) => {
                                return (
                                    <div class='modal-items' key={index}>
                                        <Image
                                            class='item-image'
                                            src={item.picture}
                                            width={item.width}
                                            height={item.height}
                                            onClick={() => {
                                                setItemValueModal(true)
                                                setSelectedObject(item)
                                            }}
                                        />
                                        <h4>{item.name}</h4>
                                    </div>
                                )
                            }) : <></>
                        }

                    </div>
                    <div class='button-container'>
                        <button
                            style={{
                                backgroundColor: '#000428',
                                color: '#FBFEF9'
                            }}
                            onClick={() => setItemModal(false)}>
                            Close
                        </button>
                    </div>
                </Modal>

                <Modal
                    isOpen={itemValueModal}
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
                    {
                        selectedObject ?
                            selectedObject.name != 'Stack Overflow' ||
                                selectedObject.name != 'Apple Music' ||
                                selectedObject.name != 'Discord'
                                ?
                                <>
                                    <fieldset>
                                        <label style={{ color: '#000428' }}>{selectedObject.name} Username</label>
                                        <input type='text' id='newValue' name='newValue' />
                                    </fieldset>
                                    <div class='button-container'>
                                        <button
                                            style={{
                                                backgroundColor: '#000428',
                                                color: '#FBFEF9'
                                            }}
                                            onClick={() => AddItem()}>
                                            Save and Close
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: '#000428',
                                                color: '#FBFEF9'
                                            }}
                                            onClick={() => setItemValueModal(false)}>
                                            Close
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    <fieldset class='modal-input'>
                                        <label style={{ color: '#000428' }}>{selectedObject.name} ID</label>
                                        <input type='text' id='newValue' name='newValue' />
                                    </fieldset>
                                    <fieldset class='modal-input'>
                                        <label style={{ color: '#000428' }}>{selectedObject.name} Username</label>
                                        <input type='text' id='newValueTwo' name='newValueTwo' />
                                    </fieldset>
                                    <div class='button-container'>
                                        <button
                                            style={{
                                                backgroundColor: '#000428',
                                                color: '#FBFEF9'
                                            }}
                                            onClick={() => AddItem()}>
                                            Save and Close
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: '#000428',
                                                color: '#FBFEF9'
                                            }}
                                            onClick={() => setItemValueModal(false)}>
                                            Close
                                        </button>
                                    </div>
                                </>
                            : null
                    }
                </Modal>

                <Modal
                    isOpen={deleteModal}
                    style={{
                        content: {
                            width: '75%',
                            height: '75%',
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
                    <div class='add-item-container'>
                        {
                            bodyItems.length > 0 ? bodyItems.map((item, index) => {
                                return (
                                    <div class='modal-items' key={index}>
                                        <Image
                                            class='item-image'
                                            src={item.picture}
                                            width={item.width}
                                            height={item.height}
                                            onClick={() => DeleteItem(item)}
                                        />
                                        <h4>{item.name}</h4>
                                    </div>
                                )
                            }) : <></>
                        }

                    </div>
                    <div class='button-container'>
                        <button
                            style={{
                                backgroundColor: '#000428',
                                color: '#FBFEF9'
                            }}
                            onClick={() => setDeleteModal(false)}>
                            Close
                        </button>
                    </div>
                </Modal>

            </div>

            {
                get('visitor') === 'true'
                    ?
                    <></>
                    :
                    <BottomNavbar firstName={firstName} lastName={lastName} />
            }
        </>
    )
}
