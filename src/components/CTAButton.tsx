import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import { VStack } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'
import { Platform } from 'react-native'

type Props = TouchableOpacityProps & {
    label: string
    icon: string
  }
  
  export const CTAButton: React.FC<Props> = ({
    label,
    icon,
    onPress,
    ...props
  }) => {
    return (
        <ButtonContainerView>
            <TouchableOpacity onPress={onPress}>
                <VStack alignItems={'center'} justifyContent={'center'} style={{ height: "100%" }}>
                    <Icon name={icon} size={22} color="#fff" />
                    <ButtonText>{label}</ButtonText>
                </VStack>
            </TouchableOpacity>
        </ButtonContainerView>
    )
  }

const ButtonContainerView = styled.View`
  background-color: #0062FF;
  border-radius: 9px;
  height: 67px;
  flex: 1;
`

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`