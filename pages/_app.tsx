import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { LayoutPage } from '../types'
import { Layout } from '../components/main/layout'

function MyApp({ Component, pageProps }: AppProps) {
  // Gets the page layout from the component, defaults to the main layout
  const PageLayout = (Component as LayoutPage).layout || Layout
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  )
}

export default MyApp
