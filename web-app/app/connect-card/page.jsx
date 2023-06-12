import { Navbar, Header, Footer } from '../common'
import '../../styles/products.css'
import Image from 'next/image'
import Link from 'next/link'

export default function ConnectCard() {
    return (
        <>
            <Header pageTitle={'Connect Card | Drivense'} />
            <Navbar />

            <div class='header'>
                <h2>The Connect Card</h2>
                <Image src={'/CardsBlueBG.png'} width={1000} height={500} />
                <Link class='button' href={'/sign-up'}>
                    Get Started
                </Link>
            </div>

            <div class='product'>

                <div class='benefit'>
                    <h4>
                        For in person events
                    </h4>
                    <Image src={'/LiveEvent.png'} width={500} height={500} />
                </div>

                <div class='benefit'>
                    <h4>
                        Never run out of cards
                    </h4>
                    <Image src={'/Empty.png'} width={500} height={500} />
                </div>

                <div class='benefit'>
                    <h4>
                        Tap and Connect
                    </h4>
                    <Image src={'/Meeting.png'} width={500} height={500} />
                </div>

            </div>
            <Footer />
        </>
    )
}