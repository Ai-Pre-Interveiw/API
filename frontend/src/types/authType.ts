import { StringStateType } from '@/types/commonType'

// 회원
export type userType = {
  memberNo: number
  email: string
  nickname: string
  createdAt: string
  imageUrl: string
  resume: { filePath: string; uploadTime: string }[];
}

export type SignupInputSectionType = {
  onClick: () => void
} & StringStateType

export type MypageInfoSectionType = {
  email: string
  profile: string
  name: string
}