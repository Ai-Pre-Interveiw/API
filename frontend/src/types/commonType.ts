import { Dispatch, SetStateAction } from 'react'

export type FullButtonType = {
  text: string
  disabled: boolean
  onClick: () => void
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
  name: string
  children: React.ReactNode
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