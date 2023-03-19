import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'

type Props = TouchableOpacityProps & {
  label: string
  fontSize?: number
  color?: string
  underline?: boolean
  bold?: boolean
}

const TextButton: React.FC<Props> = ({ label, fontSize, color, underline, bold, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonText fontSize={fontSize ?? 15} color={color ?? 'black'} underline={underline ?? false} bold={bold ?? false}>
        {label}
      </ButtonText>
    </TouchableOpacity>
  )
}

const ButtonText = styled.Text<{ fontSize: number; color: string; underline: boolean; bold: boolean }>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  text-decoration-line: ${props => props.underline ? 'underline' : 'none'};
  ${props => props.bold ? 'font-weight: bold;' : ''}
`

export default TextButton
