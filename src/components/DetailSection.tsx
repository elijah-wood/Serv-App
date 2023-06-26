import { ChevronRightIcon, HStack, Spacer, VStack } from 'native-base'
import React from 'react'
import { ColorValue, Platform, ToastAndroid, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import { setStringAsync } from 'expo-clipboard';

type Props = TouchableOpacityProps & {
    title: string
    value: string
    color?: ColorValue
    showDisclosure?: boolean
    customRightComponent?: React.ReactNode
}
  
export const DetailSection: React.FC<Props> = ({
    onPress,
    ...props
  }) => {
    const handleLongPress = async () => {
        await setStringAsync(props.value)
        if (Platform.Version <= 32) {
            ToastAndroid.show("Copied", ToastAndroid.SHORT)
        }
    };
    return (
        <SectionContainer>
            <TouchableOpacity onPress={onPress} onLongPress={Platform.OS === 'android' ? handleLongPress: null} disabled={props.disabled}>
                <HStack alignItems={'center'}>
                    <VStack>
                        <SectionTitle>{props.title}</SectionTitle>
                        <SectionValue selectable={Platform.OS === 'ios'} color={props.color} >{props.value}</SectionValue>
                    </VStack>
                    {(props.showDisclosure == true) && 
                    <>
                        <Spacer/>
                        <RightComponentContainer>
                            <ChevronRightIcon />
                        </RightComponentContainer>
                    </>
                    }
                    {(props.customRightComponent) && 
                    <>
                        <Spacer/>
                        <RightComponentContainer>
                            {props.customRightComponent}
                        </RightComponentContainer>
                    </>
                    }
                </HStack>
            </TouchableOpacity>
        </SectionContainer>
    )
}

const RightComponentContainer = styled.View`
  padding-vertical: 16px;
  padding-right: 16px;
`

const SectionContainer = styled.View`
  background-color: white;
  margin-horizontal: 16px;
  border-radius: 9px;
`

const SectionTitle = styled.Text`
  color: grey;
  padding-top: 16px;
  padding-left: 16px;
`

const SectionValue = styled.Text<{ color?: ColorValue }>`
  color: ${props => props.color ? props.color : 'black'};;
  font-size: 17px;
  padding: 16px;
`

export { SectionContainer, SectionTitle, SectionValue }