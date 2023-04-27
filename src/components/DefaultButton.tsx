import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { VStack } from 'native-base'

type Props = TouchableOpacityProps & {
    label: string
    loading?: boolean
}
  
const DefaultButton: React.FC<Props> = ({
    label,
    onPress,
    loading,
    disabled,
    ...props
  }) => {
    return (
        <ButtonContainerView isDisabled={disabled}>
            <TouchableOpacity onPress={onPress} disabled={disabled || loading} {...props}>
                <VStack alignItems={'center'} justifyContent={'center'} style={{ height: "100%" }}>
                    {loading ? <ActivityIndicator color={'white'}/> : <ButtonText>{label}</ButtonText>}
                </VStack>
            </TouchableOpacity>
        </ButtonContainerView>
    )
  }

const ButtonContainerView = styled.View<{ isDisabled: boolean }>`
  background-color: ${props => props.isDisabled ? '#E3E9ED' : '#0062FF'};
  border-radius: 9px;
  height: 63px;
`

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`
export default DefaultButton