'use client'
import { Navbar, Header, Footer } from '../common'
import '../../styles/log-in.css'
import Link from 'next/link'
import Image from 'next/image'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../context'
import { useRouter } from 'next/navigation'
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from 'firebase/auth'

export default function LogIn() {
    const router = useRouter()

    async function handleLogIn() {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        if (!email.includes('@')) {
            alert("Please make sure you entered a correct email.")
            return
        }
        if (password.length < 8) {
            alert("Your password is too short. Please make sure it's longer than 8 characters.")
            return
        }

        await signInWithEmailAndPassword(firebaseAuth, email, password).then(user => {
            if (user) {
                const firstName = user.user.displayName.substring(0, user.user.displayName.indexOf(' '))
                const lastName = user.user.displayName.substring(user.user.displayName.indexOf(' ') + 1, user.user.displayName.length)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/profile`)
            }
        }).catch(e => {
            router.push('/log-in')
            alert("The email and password you entered didn't match our records.\nPlease try again.")
        })
    }

    async function GoogleSignIn () {
        const googleProvider = new GoogleAuthProvider()
        await signInWithPopup(firebaseAuth, googleProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function FacebookSignIn () {
        const facebookProvider = new FacebookAuthProvider()
        await signInWithPopup(firebaseAuth, facebookProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function TwitterSignIn () {
        const twitterProvider = new TwitterAuthProvider()
        await signInWithPopup(firebaseAuth, twitterProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    async function GithubSignIn () {
        const gitHubProvider = new GithubAuthProvider()
        await signInWithPopup(firebaseAuth, gitHubProvider)
            .then(async newUser => {
                const firstName = newUser.user.displayName.substring(0, newUser.user.displayName.indexOf(' '))
                const lastName = newUser.user.displayName.substring(newUser.user.displayName.indexOf(' ') + 1, newUser.user.displayName.length)
                router.push(`/${firstName.toLowerCase()}-${lastName.toLowerCase()}`)
            })
    }

    return (
        <>
            <Header pageTitle={'Log In | Drivense'}></Header>
            <Navbar></Navbar>

            <section>
                <form>
                    <fieldset>
                        <label>Email</label>
                        <input type='email' id='email' name='email' placeholder='Ex: hafizbhuyan@drivense.com' autoFocus required />
                    </fieldset>

                    <fieldset>
                        <label>Password</label>
                        <input type='password' id='password' name='password' placeholder='Ex: ******' required tabIndex={0} />
                    </fieldset>
                    <button onClick={handleLogIn} id='email_log_in' class='login' type='button'>Log In</button>
                </form>

                <h4>Or use a social login</h4>

                <div class='social-logins'>
                    <button id='google_log_in' class='social-login' onClick={() => GoogleSignIn()}>
                        <Image src={'/GoogleLogo.png'} width={75} height={75} />
                    </button>
                    <button id='facebook_log_in' class='social-login' onClick={() => FacebookSignIn()}>
                        <Image src={'/FacebookLogo.png'} width={75} height={75} />
                    </button>
                    <button id='twitter_log_in' class='social-login' onClick={() => TwitterSignIn()}>
                        <Image src={'/TwitterLogo.png'} width={75} height={75} />
                    </button>
                    <button id='github_log_in' class='social-login' onClick={() => GithubSignIn()}>
                        <Image src={'/GitHubLogo.png'} width={75} height={75} />
                    </button>
                </div>
                <hr />
                <h4>
                    Having trouble logging in?
                </h4>
                <button
                    onClick={() => router.push('/forgot-password')}
                    target={'_blank'}
                    id='forgotPass'
                    class='button'
                >
                    <h4>Reset your Password</h4>
                </button>
            </section>

            <Footer />
        </>
    )
}