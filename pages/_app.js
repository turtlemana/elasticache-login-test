import '@/styles/globals.css'
import {SessionProvider} from 'next-auth/react'
import {SWRConfig} from 'swr'
import fetcher from '../utils/fetchUserInfo'

export default function App({ Component, pageProps }) {
  return (
    
    <SWRConfig value={{fetcher:fetcher, revalidateIfStale:true,refreshWhenOffline:true, refreshWhenHidden:true}}>

    <SessionProvider session={pageProps.session}> 
  
  <Component {...pageProps} />

   </SessionProvider>

   </SWRConfig>
  )
  
  
}
