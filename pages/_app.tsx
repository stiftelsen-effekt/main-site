import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { LayoutPage } from '../types'

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as LayoutPage).layout
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
