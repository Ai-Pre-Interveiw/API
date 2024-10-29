import { GlobalStyle } from '@styles/GlobalStyle'
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from '@routers/AuthRouter'
import HomeRouter from '@routers/HomeRouter'
import { useRecoilValue } from 'recoil'
import { userState } from '@stores/user'
// import '@/services/foregroundMessage'
import ScrollToTop from './utils/scrollToTop'

const App = () => {
  const user = useRecoilValue(userState)

  return (
    <BrowserRouter>
      <GlobalStyle />
      <ScrollToTop />
      {user.memberNo !== -1 ? (
        <AuthRouter />
      ) : (
        <HomeRouter user={user.memberNo !== -1} />
      )}
    </BrowserRouter>
  )
}

export default App
