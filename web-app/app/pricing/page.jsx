import { Navbar, Header, Footer } from '../common'

export default function Pricing() {
    return (
        <>
            <Header pageTitle={'Pricing | Drivense'} />
            <Navbar />
            <div style={{
                    width: '100%',
                    minHeight: '100vh',
                    height: '100%',
                    backgroundColor: '#000428',
                    color: '#FBFEF9'
            }}>
                <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                <stripe-pricing-table 
                    pricing-table-id="prctbl_1MpgU6AtdROBPDlLoVyikHIf"
                    publishable-key="pk_test_2TMnN0GNlL1xKaIz6hXfm5te00zhvxISTH"
                >
                </stripe-pricing-table>
            </div>

            <Footer />
        </>
    )
}