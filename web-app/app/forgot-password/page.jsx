'use client'
import { Navbar, Header, Footer } from '../common'
import { firebaseAuth } from '../context'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const router = useRouter()

    function ResetPassword () {
        const email = document.getElementById('email').value

        sendPasswordResetEmail(firebaseAuth, email).then(() => alert("Reset password email has been sent."))
    }

    return (
        <>
            <Header pageTitle={'Reset Your Password | Drivense'} />
            <Navbar />

            <div class='container'>
                <h2>
                    Reset your password
                </h2>
                <h4>
                    Enter your email and we will send you a link to reset your password
                </h4>
                <fieldset>
                    <label>Email</label>
                    <input type="email" name="email" id="email" />
                </fieldset>
                <button
                    onClick={() => ResetPassword()}
                    style={{
                        width: '25%',
                        padding: '1rem',
                        backgroundColor: '#FBFEF9',
                        color: '#000428',
                        borderRadius: '2rem'
                    }}
                >
                    Send Reset Email
                </button>
                <button
                    onClick={() => router.push('/log-in')}
                    style={{
                        width: '25%',
                        padding: '1rem',
                        backgroundColor: '#FBFEF9',
                        color: '#000428',
                        borderRadius: '2rem'
                    }}
                >
                    Return to Login
                </button>
            </div>

            <Footer />
        </>
    )
}