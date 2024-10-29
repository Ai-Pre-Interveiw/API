import { JoinUserType, SendFCMTokenType } from '@/types/reqType'
import { authRequest, publicRequest } from '@utils/requestMethods'

const url = '/api/v1/auth'

// 5분에 한 번 저장
const JWT_EXPIRY_TIME = 3600 * 1000

// refresh token 요청
export const refresh = async () => {
  return authRequest
    .post(`${url}/refresh`)
    .then(res => loginSuccess(res.data))
    .catch(err => console.log(err))
}

// 로그인 성공 시
export const loginSuccess = async (res: { accessToken: string }) => {
  const { accessToken } = res

  authRequest.defaults.headers.Authorization = `Bearer ${accessToken}`
  setTimeout(() => refresh(), JWT_EXPIRY_TIME - 5000)
}

// 회원가입
export const joinUser = async (req: JoinUserType) => {
  const storage = localStorage.getItem('register')
  const email = storage && JSON.parse(storage).email
  const provider = storage && JSON.parse(storage).provider

  return publicRequest
    .put(`${url}/join`, {
      ...req,
      email: email || '',
      provider: provider || '',
    })
    .then(res => res)
}

// 회원 정보 조회
export const fetchUserInfo = async () => {
  return authRequest.get(`${url}/info`).then(res => res)
}

// FCM 기기 토큰 전송
export const sendFCMToken = async (req: SendFCMTokenType) => {
  return authRequest
    .post(`${url}/device`, req)
    .then(res => console.log(res.data.code, 'fcm token 전송'))
    .catch(err => console.log(err))
}

// 닉네임 중복검사
export const checkNickname = async (ninkname: string) =>
  publicRequest
    .get(`${url}/nickname?nickname=${ninkname}`)
    .then(res => res.data.data)
    .catch(err => err)