'use client'
import '../../styles/log-in.css'
import { useState } from 'react'
import Image from 'next/image'
import { Navbar, Header, Footer } from '../common'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { firebaseAuth, firebaseFirestore } from '../context'
import { setDoc, doc, getDoc } from 'firebase/firestore'

export default function SignUp() {
    const router = useRouter()
    const [signUpStep, setSignUpStep] = useState(0)
    const [enteredCompanyName, setEnteredCompanyName] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSignUp() {
        const firstName = document.getElementById('firstName').value
        const lastName = document.getElementById('lastName').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value

        if (!email.includes('@')) {
            alert("Please make sure you entered a correct email.")
            return
        }
        if (password.length < 8) {
            alert("Your password is too short. Please make sure it's longer than 8 characters.")
            return
        }
        if (password !== confirmPassword) {
            alert("Your passwords don't match. Please enter them again.")
            return
        }

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            company: '',
            position: '',
            picture: '/Placeholder.jpg',
            totalConnections: 0,
            items: [
                {
                    name: 'Email',
                    picture: '/EmailIcon.png',
                    value: email,
                    width: 100,
                    height: 100,
                }
            ],
            connections: [],
            accountCreated: new Date().toISOString(),
            card: {
                bgColor: '#000428',
                textColor: '#FBFEF9',
                topText: '[Top Text Placeholder]',
                middleText: '[Middle Text Placeholder]',
                bottomText: '[Bottom Text Placeholder]',
            }
        }

        await createUserWithEmailAndPassword(firebaseAuth, email, password).then(async newUser => {
            updateProfile(newUser.user, {
                displayName: `${firstName} ${lastName}`
            })
            const document = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
            await setDoc(document, userData)
            router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/profile`)
        })
    }

    async function GoogleSignUp() {
        const googleProvider = new GoogleAuthProvider()
        await signInWithPopup(firebaseAuth, googleProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                const document = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: newUser.user.email,
                    company: '',
                    position: '',
                    picture: '/Placeholder.jpg',
                    totalConnections: 0,
                    items: [
                        {
                            name: 'Email',
                            picture: '/EmailIcon.png',
                            value: newUser.user.email,
                            width: 100,
                            height: 100,
                        }
                    ],
                    connections: [],
                    accountCreated: new Date().toISOString(),
                    card: {
                        bgColor: '#000428',
                        textColor: '#FBFEF9',
                        logo: '/DrivenseLogoNoBg.png',
                        topText: '[Top Text Placeholder]',
                        middleText: '[Middle Text Placeholder]',
                        bottomText: '[Bottom Text Placeholder]',
                    }
                }
                await setDoc(document, userData)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function FacebookSignUp() {
        const facebookProvider = new FacebookAuthProvider()
        await signInWithPopup(firebaseAuth, facebookProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                const document = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: newUser.user.email,
                    company: '',
                    position: '',
                    picture: '/Placeholder.jpg',
                    totalConnections: 0,
                    items: [
                        {
                            name: 'Email',
                            picture: '/EmailIcon.png',
                            value: newUser.user.email,
                            width: 100,
                            height: 100,
                        }
                    ],
                    connections: [],
                    accountCreated: new Date().toISOString(),
                    card: {
                        bgColor: '#000428',
                        textColor: '#FBFEF9',
                        logo: '/DrivenseLogoNoBg.png',
                        topText: '[Top Text Placeholder]',
                        middleText: '[Middle Text Placeholder]',
                        bottomText: '[Bottom Text Placeholder]',
                    }
                }
                await setDoc(document, userData)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function TwitterSignUp() {
        const twitterProvider = new TwitterAuthProvider()
        await signInWithPopup(firebaseAuth, twitterProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                const document = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: '',
                    company: '',
                    position: '',
                    picture: '/Placeholder.jpg',
                    totalConnections: 0,
                    items: [
                        {
                            name: 'Twitter',
                            picture: '/TwitterLogo.png',
                            value: '[Twitter Username]',
                            width: 100,
                            height: 100,
                        }
                    ],
                    connections: [],
                    accountCreated: new Date().toISOString(),
                    card: {
                        bgColor: '#000428',
                        textColor: '#FBFEF9',
                        logo: '/DrivenseLogoNoBg.png',
                        topText: '[Top Text Placeholder]',
                        middleText: '[Middle Text Placeholder]',
                        bottomText: '[Bottom Text Placeholder]',
                    }
                }
                await setDoc(document, userData)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function GithubSignUp() {
        const gitHubProvider = new GithubAuthProvider()
        await signInWithPopup(firebaseAuth, gitHubProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                const document = doc(firebaseFirestore, `users/${lastName.toLowerCase()}-${firstName.toLowerCase()}`)
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: newUser.user.email,
                    company: '',
                    position: '',
                    picture: '/Placeholder.jpg',
                    totalConnections: 0,
                    items: [
                        {
                            name: 'Email',
                            picture: '/EmailIcon.png',
                            value: newUser.user.displayName,
                            width: 100,
                            height: 100,
                        }
                    ],
                    connections: [],
                    accountCreated: new Date().toISOString(),
                    card: {
                        bgColor: '#000428',
                        textColor: '#FBFEF9',
                        logo: '/DrivenseLogoNoBg.png',
                        topText: '[Top Text Placeholder]',
                        middleText: '[Middle Text Placeholder]',
                        bottomText: '[Bottom Text Placeholder]',
                    }
                }
                await setDoc(document, userData)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function FindCompany () {
        const company = document.getElementById('enteredCompany').value
        setEnteredCompanyName(company)
        const companyDocument = doc(firebaseFirestore, `companies/${company}`)
        const companyDoc = await getDoc(companyDocument)

        if (!companyDoc.exists()) {
            setSignUpStep(-1)
            setErrorMessage('We couldnt find that company or organization. Please try again or contact your companys point of contact.')
        } else {
            setSignUpStep(1)
        }
    }

    async function MatchCodes () {
        const code = document.getElementById('enteredCompanyCode').value
        const companyDocument = doc(firebaseFirestore, `companies/${enteredCompanyName}`)
        const companyDoc = await getDoc(companyDocument)

        if (companyDoc.data().code != code) {
            setSignUpStep(-2)
            setErrorMessage("The code you entered doesn't match our records. Please try again or contact your companys point of contact.")
        } else {
            setSignUpStep(2)
        }
    }

    if (signUpStep === 0) {
        return (
            <>
                <Header pageTitle={'Sign Up | Drivense'} />
                <Navbar />

                <div class='container'>
                    <h4>
                        Before we start, please enter the name of your company.
                    </h4>
                    <fieldset>
                        <label>Company</label>
                        <input type='text' id='enteredCompany' name='enteredCompany' placeholder='Ex: Drivense' autoFocus required />
                    </fieldset>

                    <button onClick={() => FindCompany()} class='login' type='button'>Get Started!</button>
                </div>

                <Footer />
            </>
        )
    }
    else if (signUpStep === 1) {
        return (
            <>
                <Header pageTitle={'Sign Up | Drivense'} />
                <Navbar />

                <div class='container'>
                    <h4>
                        We found {enteredCompanyName}! {'\n'}
                        Please enter the company code
                    </h4>
                    <fieldset>
                        <label>Company Code</label>
                        <input type='text' id='enteredCompanyCode' name='enteredCompanyCode' autoFocus required />
                    </fieldset>
                    <button onClick={() => MatchCodes()} class='login' type='button'>Match Codes</button>
                </div>

                <Footer />
            </>
        )
    }
    else if (signUpStep === 2) {
        return (
            <>
                <Header pageTitle={'Sign Up | Drivense'} />
                <Navbar />

                <section>
                    <form>
                        <fieldset>
                            <label>First Name</label>
                            <input type='text' id='firstName' name='firstName' placeholder='Ex: Hafiz' autoFocus required />
                        </fieldset>

                        <fieldset>
                            <label>Last Name</label>
                            <input type='text' id='lastName' name='lastName' placeholder='Ex: Bhuyan' required />
                        </fieldset>

                        <fieldset>
                            <label>Email</label>
                            <input type='email' id='email' name='email' placeholder='Ex: hafizbhuyan@drivense.com' required />
                        </fieldset>

                        <fieldset>
                            <label>Password</label>
                            <input type='password' id='password' name='password' placeholder='Ex: ******' required />
                        </fieldset>

                        <fieldset>
                            <label>Confirm Password</label>
                            <input type='password' id='confirmPassword' name='password' placeholder='Ex: ******' required />
                        </fieldset>
                    </form>

                    <h4>Or use a social login</h4>

                    <div class='social-logins'>
                        <button id='google_sign_up' class='social-login' onClick={() => GoogleSignUp()}>
                            <Image src={'/GoogleLogo.png'} width={75} height={75} />
                        </button>
                        <button id='facebook_sign_up' class='social-login' onClick={() => FacebookSignUp()}>
                            <Image src={'/FacebookLogo.png'} width={75} height={75} />
                        </button>
                        <button id='twitter_sign_up' class='social-login' onClick={() => TwitterSignUp()}>
                            <Image src={'/TwitterLogo.png'} width={75} height={75} />
                        </button>
                        <button id='github_sign_up' class='social-login' onClick={() => GithubSignUp()}>
                            <Image src={'/GitHubLogo.png'} width={75} height={75} />
                        </button>
                    </div>

                    <button onClick={handleSignUp} id='email_sign_up' class='login' type='button'>Start Connecting!</button>
                </section>

                <Footer />
            </>
        )
    }
    else if (signUpStep === -1) {
        return (
            <>
                <Header pageTitle={'Sign Up | Drivense'} />
                <Navbar />

                <div class='container'>
                    <h4>
                        {errorMessage}
                    </h4>

                    <button onClick={() => setSignUpStep(0)} class='login' type='button'>Try Again</button>
                </div>

                <Footer />
            </>
        )
    } else if (signUpStep === -2) {
        return (
            <>
                <Header pageTitle={'Sign Up | Drivense'} />
                <Navbar />

                <div class='container'>
                    <h4>
                        {errorMessage}
                    </h4>

                    <button onClick={() => setSignUpStep(1)} class='login' type='button'>Try Again</button>
                </div>

                <Footer />
            </>
        )
    }
}