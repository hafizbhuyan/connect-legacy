import { Navbar, Header, Footer } from '../common'
import '../../styles/products.css'
import Image from 'next/image'
import Link from 'next/link'

export default function ConnectApp() {
    return (
        <>
            <Header pageTitle={'Connect App | Drivense'} />
            <Navbar />
            <div class='header'>
                <h2>The Connect App</h2>
                <Image src={'/MobileAndWebBlueBG.png'} width={500} height={500} />
                <Link class='button' href={'/sign-up'}>
                    Get Started
                </Link>
            </div>

            <div class='product'>

                <div class='benefit'>
                    <h4>For virtual events</h4>
                    <Image src={'/VirtualEvent.png'} width={500} height={400} />
                </div>

                <div class='benefit'>
                    <h4>
                        Nothing to download (we&apos;re a web app!)
                    </h4>
                    <Image src={'/WebApp.png'} width={400} height={400} />
                </div>

                <div class='benefit'>
                    <h4>
                        Keep track of everyone you meet
                    </h4>
                    <Image src={'/ConnectionsList.png'} width={400} height={400} />
                </div>

            </div>
            <Footer />
        </>
    )
}