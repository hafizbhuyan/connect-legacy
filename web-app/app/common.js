'use client'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../public/DrivenseLogoNoBg.png'
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
  FaLinkedin,
  FaYoutubeSquare,
  FaHome,
  FaUsers,
  FaUserPlus,
  FaIdCard,
  FaCog,
  FaUser
} from 'react-icons/fa'
import '../styles/profile.css'
import Script from 'next/script'

export function Navbar() {
  return (
    <body>
      <nav>
        <div class="logo-container">
          <Link href={'/'}>
            <Image src={Logo} width={30} height={40} />
          </Link>
        </div>
        <div class="link-container" id="navbar-links">
          <Link href={'/'} class='button' >Home</Link>
          <Link href={'/connect-card'} class='button' >Connect Card</Link>
          <Link href={'/connect-app'} class='button' >Connect App</Link>
        </div>

        {/* <button class="icon" onclick={myFunction}>
          <FaBars size={25} />
        </button> */}

        <div class={'signUp'} id="navbar-links">
          <Link href={'/sign-up'} class='button' >Sign Up</Link>
          <Link href={'/log-in'} class='button' >Log In</Link>
        </div>
      </nav>
    </body>
  )
}

export function Header({ pageTitle }) {
  return (
    <head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-94D3VE42LW"
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-94D3VE42LW');
        `}
      </Script>
      <meta charSet="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content="Professional networking for the 21st century" />
      <meta name="keywords" content="professional networking, business, conferences, networking, business technology" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageTitle} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content="https://firebasestorage.googleapis.com/v0/b/drivense-connect.appspot.com/o/company-logos%2FDrivense-logo.png?alt=media&token=e7424833-7c8e-4fc5-b9a3-007bbf420181" />
      <meta property='og:url' content='www.drivense.com/' />
      <meta property='fb:app_id' content='433190904799572' />
      <title>{pageTitle}</title>
      <link rel="shortcut icon" href="/DrivenseLogoNoBg.png" />
    </head>
  )
}

export function Footer() {
  return (
    <footer class="footer">
      <div class="extra-links">
        <Link target='_blank' href={'/privacy-policy'} class='button'>Privacy Policy</Link>
        <Link target='_blank' href={'https://us5.list-manage.com/contact-form?u=cdd4052bba8740ed807dfd934&form_id=26647b64ef64b092d813bf19a0861bd8'} class='button' >Contact Us</Link>
        <Link target='_blank' href={"/terms-and-conditions"} class='button'>Terms and Conditions</Link>
        <Link target='_blank' href={"#"} class='button'>Frequently Asked Questions</Link>
      </div>
      <div class="social-links">
        <p>Connect with us!</p>
        <div>
          <Link target='_blank' href={"https://www.facebook.com/drivense/"} class='social'><FaFacebookSquare size={50} color={'#1877F2'} /></Link>
          <Link target='_blank' href={"https://www.instagram.com/drivense.llc/"} class='social'><FaInstagramSquare size={50} color={'#405de6'} /></Link>
          <Link target='_blank' href={"https://twitter.com/drivense1"} class='social'><FaTwitterSquare size={50} color={'#1DA1F2'} /></Link>
          <Link target='_blank' href={"https://www.linkedin.com/company/drivense/"} class='social'><FaLinkedin size={50} color={'#00A0DC'} /></Link>
          <Link target='_blank' href={"https://www.youtube.com/@drivense"} class='social'><FaYoutubeSquare size={50} color={'#FF0000'} /></Link>
        </div>
      </div>
    </footer>
  )
}

export function Loading() {
  return (
    <div class='loading'>
      <Image src={Logo} width={800} height={1000} />
      <h2>...Loading...</h2>
    </div>
  )
}

export function BottomNavbar({ firstName, lastName }) {
  return (
    <div class='bottomNavbar'>
      <Link class='icon-container' href={`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/profile`}>
        <FaUser class='icon' />
        <h4>Profile</h4>
      </Link>
      <Link class='icon-container' href={`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/connections`}>
        <FaUsers class='icon' />
        <h4>Connections</h4>
      </Link>
      <Link class='icon-container' href={`${firstName.toLowerCase()}-${lastName.toLowerCase()}/connect`}>
        <FaUserPlus class='icon' />
        <h4>Connect</h4>
      </Link>
      <Link class='icon-container' href={`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/connect-card`}>
        <FaIdCard class='icon' />
        <h4>Connect Card</h4>
      </Link>
      <Link class='icon-container' href={`/${firstName.toLowerCase()}-${lastName.toLowerCase()}/settings`}>
        <FaCog class='icon' />
        <h4>Settings</h4>
      </Link>
    </div>
  )
}