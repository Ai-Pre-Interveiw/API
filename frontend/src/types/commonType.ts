import { Dispatch, SetStateAction } from 'react'

export type FullButtonType = {
  text: string
  disabled: boolean
  onClick: () => void
  type?: 'button' | 'submit' | 'reset'; // type 속성 추가, 선택 사항으로 설정
}

export type AuthBackgroundType = {
  title: String
  text1: String
  text2: String
  onClick1: () => void
  onClick2: () => void
  inputs: { inputTitle: string; inputText: string; isEssentail: boolean; }[]
}

export type MainBackgroundType = {
  image_url: string[]
  text1: string[]
  text2: string[]
}

export type LargeButtonType = {
  text: string
  onClick: () => void
}

export type ResetButtonType = LargeButtonType

export type StringStateType = {
  value: string
  setValue: Dispatch<SetStateAction<string>>
}

export type NumberStateType = {
  value: number
  setValue: Dispatch<SetStateAction<number>>
}

export type BooleanStateType = {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
}

export type FileStateType = {
  value: File | null
  setValue: Dispatch<SetStateAction<File | null>>
}

export type ModalType = {
  width: string
  height: string
  name: string
  texts: string[]
  onClose: () => void
}

export type CustomToggleType = {
  selected: boolean
  onClick: () => void
}

export type SeoType = {
  title: string
  description: string
}