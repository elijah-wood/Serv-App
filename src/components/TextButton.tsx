import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'

type Props = TouchableOpacityProps & {
  label: string
  fontSize?: number
  color?: string
}

const TextButton: React.FC<Props> = ({ label, fontSize, color, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonText fontSize={fontSize ?? 15} color={color ?? 'black'}>
        {label}
      </ButtonText>
    </TouchableOpacity>
  )
}

const ButtonText = styled.Text<{ fontSize: number; color: string }>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  text-decoration-line: underline;
`

export default TextButton
