'use client'
import Image from 'next/image';
import { firebaseFirestore } from '../context'
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'

export default function Visitor({ userData }) {
    const firstName = userData.firstName
    const lastName = userData.lastName
    const company = userData.company
    const position = userData.position
    const picture = userData.picture
    const totalConnections = userData.totalConnections
    const items = userData.items
    const docRef = doc(firebaseFirestore, 'users', `${lastName.toLowerCase()}-${firstName.toLowerCase()}`)

    async function ClickHandler(item) {
        const indexOfItem = items.indexOf(item)
        items[indexOfItem].clicks++

        // Email
        if (item.name == 'Email') {
            window.open(`mailto: ${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Phone
        else if (item.name == 'Phone') {
            window.open(`tel: ${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // City
        else if (item.name == 'City') {
            window.open(`https://www.google.com/maps/place/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Custom
        else if (item.name == 'Custom') {
            window.open(item.value)
            await updateDoc(docRef, {
                items: items
            })
        }

        // LinkedIn
        else if (item.name == 'LinkedIn') {
            window.open(`https://www.linkedin.com/in/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Instagram
        else if (item.name == 'Instagram') {
            window.open(`https://www.instagram.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Facebook
        else if (item.name == 'Facebook') {
            window.open(`https://www.facebook.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Twitter
        else if (item.name == 'Twitter') {
            window.open(`http://twitter.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Snapchat
        else if (item.name == 'Snapchat') {
            window.open(`https://www.snapchat.com/add/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Reddit
        else if (item.name == 'Reddit') {
            window.open(`https://www.reddit.com/user/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // GitHub
        else if (item.name == 'GitHub') {
            window.open(`https://github.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // F6S
        else if (item.name == 'F6S') {
            window.open(`https://www.f6s.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        else if (item.name == 'GitLab') {
            window.open(`https://www.gitlab.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        else if (item.name == 'CodePen') {
            window.open(`https://www.codepen.io/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        else if (item.name == 'Figma') {
            window.open(`https://www.figma.com/@${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // SoundCloud
        else if (item.name == 'Sound Cloud') {
            window.open(`https://www.soundcloud.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Spotify
        else if (item.name == 'Spotify') {
            window.open(`https://open.spotify.com/artist/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Twitch
        else if (item.name == 'Twitch') {
            window.open(`https://www.twitch.tv/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Apple Music
        else if (item.name == 'Apple Music') {
            window.open(`https://music.apple.com/us/artist/${item.value.username}/${item.value.id}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Dribbble
        else if (item.name == 'Dribbble') {
            window.open(`https://dribbble.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // CrunchBase
        else if (item.name == 'Crunchbase') {
            window.open(`https://www.crunchbase.com/person/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Medium
        else if (item.name == 'Medium') {
            window.open(`https://www.medium.com/@${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Pinterest
        else if (item.name == 'Pinterest') {
            window.open(`https://www.pinterest.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Bit Bucket
        else if (item.name == 'BitBucket') {
            window.open(`https://bitbucket.org/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Angel List
        else if (item.name == 'Angel List') {
            window.open(`https://www.angel.co/company/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Discord
        else if (item.name == 'Discord') {
            window.open(`https://discordapp.com/users/${item.value.username}#${item.value.id}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Hacker News
        else if (item.name == 'Hacker News') {
            window.open(`https://news.ycombinator.com/user?id=${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Product Hunt
        else if (item.name == 'Product Hunt') {
            window.open(`https://www.producthunt.com/@${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // Stack Overflow
        else if (item.name == 'Stack Overflow') {
            window.open(`https://www.stackoverflow.com/users/${item.value.id}/${item.value.username}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        else if (item.name === 'Inside') {
            window.open(`https://inside.com/p/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }

        // YouTube
        else if (item.name == 'YouTube') {
            window.open(`https://www.youtube.com/${item.value}`)
            await updateDoc(docRef, {
                items: items
            })
        }
    }

    return (
        <div class='container'>
            <p style={{ fontSize: '10px', top: 0 }}>Created by Drivense</p>
            <Image src={picture} width={350} height={350} style={{ borderRadius: '1rem' }} />
            <h2>
                {firstName.charAt(0).toUpperCase() + firstName.substring(1, firstName.length)} {lastName.charAt(0).toUpperCase() + lastName.substring(1, lastName.length)}
            </h2>
            <h4>Connections: {totalConnections}</h4>
            <h4>
                {position} {position && company ? 'at' : ''} {company}
            </h4>
            <div class='items'>
                {
                    items.length > 0 ? items.map((item, index) => {
                        // TODO: get the click working
                        return (
                            <button key={index} onClick={() => ClickHandler(item)} class='item'>
                                <Image src={item.picture} width={100} height={100} />
                                <h4>{item.value}</h4>
                            </button>
                        )
                    }) : <></>
                }
            </div>
        </div>
    )
}