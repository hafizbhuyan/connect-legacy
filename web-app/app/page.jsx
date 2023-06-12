'use client'
import '../styles/globals.css'
import '../styles/home.css'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar, Header, Footer } from './common'

export default function Home() {
    return (
        <>
            <Header pageTitle={'Connections made easier | Drivense'} />
            <Navbar />

            <section class='header'>
                <h2>
                    First impressions are vital
                </h2>
                <h4>
                    Make yours with Drivense
                </h4>
                <h4>
                    With a virtual and physical option,
                    don&apos;t let event formats limit the people you meet
                </h4>
            </section>

            <section class="current-users">
                <h2>
                    Join these amazing companies already Connecting!
                </h2>

                <div class="content">
                    <div class='company' onClick={() => window.open('https://www.tryhungry.com')}>
                        <Image src={'/current-users/Hungry.jpg'} width={300} height={300} />
                        <h4>
                            Hungry
                        </h4>
                    </div>
                    <div class='company' onClick={() => window.open('https://www.bartrack.beer')}>
                        <Image src={'/current-users/BarTrack.jpg'} width={300} height={300} />
                        <h4>
                            BarTrack
                        </h4>
                    </div>
                    <div class='company' onClick={() => window.open('https://www.recrebox.com')}>
                        <Image src={'/current-users/RecRe.jpg'} width={300} height={300} />
                        <h4>
                            RecRe
                        </h4>
                    </div>
                </div>
            </section>

            <section class='products' title='What we offer'>
                <h2>One Account. Two Products. Unlimited Connections.</h2>
                <div className="content">
                    <div class='product-left'>
                        <h4>Cards</h4>
                        <Image src={'/Cards.png'} width={1000} height={500} class='cards' />
                        <Image src={'/CardsSmallScreens.png'} width={500} height={250} class='cardsRp' />
                        <Link class='button' href={'/connect-card'}>
                            <p>Learn More</p>
                        </Link>
                    </div>

                    <div class='product-right'>
                        <h4>App</h4>
                        <Image src={'/MobileAndWeb.png'} width={500} height={500} />
                        <Link class='button' href={'/connect-app'}>
                            <p>Learn More</p>
                        </Link>
                    </div>
                </div>
            </section>

            <section class='who-you-are'>
                <h2>Share endlessly</h2>
                <div className="content">
                    <div class='subsection'>
                        <h4>For Socials</h4>
                        <div className="socials">
                            <Image class='social' src={'/LinkedInLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/InstagramLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/SnapchatLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/TwitterLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/RedditLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/FacebookLogo.png'} width={75} height={75} />
                            <Image class='social' src={'/DiscordLogo.png'} width={75} height={75} />
                        </div>
                    </div>

                    <div class='subsection'>
                        <h4>For Artists</h4>
                        <div className="socials">
                            <Image class='social' src={'/SoundCloudLogo.png'} width={100} height={50} />
                            <Image class='social' src={'/PinterestLogo.png'} width={50} height={50} />
                            <Image class='social' src={'/TwitchLogo.png'} width={100} height={50} />
                            <Image class='social' src={'/SpotifyLogo.png'} width={50} height={50} />
                            <Image class='social' src={'/AppleMusicLogo.png'} width={100} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/FigmaLogo.png'} width={50} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/DribbbleLogo.png'} width={150} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/MediumLogo.png'} width={50} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/YouTubeLogo.png'} width={100} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                        </div>
                    </div>

                    <div class='subsection'>
                        <h4>For Devs</h4>
                        <div className="socials">
                            <Image class='social' src={'/GitHubLogo.png'} width={50} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/CodePenLogo.png'} width={100} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/GitLabLogo.png'} width={50} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/BitBucketLogo.png'} width={250} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/StackOverflowLogo.png'} width={250} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                        </div>
                    </div>

                    <div class='subsection'>
                        <h4>For Founders</h4>
                        <div className="socials">
                            <Image class='social' src={'/F6SLogo.png'} width={50} height={50} />
                            <Image class='social' src={'/CrunchbaseLogo.png'} width={150} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/ProductHuntLogo.png'} width={150} height={50} />
                            <Image class='social' src={'/HackerNewsLogo.png'} width={150} height={50} />
                            <Image class='social' src={'/TechCrunchLogo.png'} width={100} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/AngelListLogo.png'} width={50} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                            <Image class='social' src={'/InsideLogo.png'} width={150} height={50} style={{
                                backgroundColor: '#FBFEF9'
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="the-team">
                <h2>The Team</h2>
                <div className="content">
                    <div className="subsection">
                        <h4>Hafiz Bhuyan</h4>
                        <Image src={'/HafizBPic.png'} width={500} height={500} />
                    </div>

                    <div className="subsection">
                        <h4>Chris Traynor</h4>
                        <Image src={'/ChrisTPic.jpg'} width={400} height={500} />
                    </div>

                    <div className="subsection">
                        <h4>Henry Villeda</h4>
                        <Image src={'/HenryVPic.png'} width={500} height={500} />
                    </div>

                    <div className="subsection">
                        <h4>Jack Gutierrez</h4>
                        <Image src={'/JackGPic.png'} width={400} height={500} />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}