
import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Ticket Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/sell-ticket">
            <a className="mr-6 text-pink-500">
              Sell Ticket
            </a>
          </Link>
          <Link href="/masssell">
            <a className="mr-6 text-pink-500">
              Mass Sell
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace