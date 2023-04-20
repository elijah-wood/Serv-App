import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, Image } from 'react-native'
import styled from 'styled-components/native'
import { VStack } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'

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
                <VStack space={1} alignItems={'center'} justifyContent={'center'} style={{ height: "100%" }}>
                  {(icon == 'phone') && 
                      <Image 
                      source={require('../assets/CallIcon.png')} 
                      style={{ width: 24, height: 24 }}
                    />
                  }
                  {(icon == 'message') && 
                      <Image 
                      source={require('../assets/MessagesIcon.png')} 
                      style={{ width: 28, height: 24 }}
                    />
                  }
                  <ButtonText>{label}</ButtonText>
                </VStack>
            </TouchableOpacity>
        </ButtonContainerView>
    )
  }

const ButtonContainerView = styled.View`
  background-color: white;
  border-radius: 9px;
  height: 67px;
  flex: 1;
`

const ButtonText = styled.Text`
  color: #0062FF;
  font-size: 16px;
`