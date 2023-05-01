import { ChevronRightIcon, HStack, Spacer, VStack } from 'native-base'
import React from 'react'
import { ColorValue, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'

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
    return (
        <SectionContainer>
            <TouchableOpacity onPress={onPress} disabled={props.disabled}>
                <HStack alignItems={'center'}>
                    <VStack>
                        <SectionTitle>{props.title}</SectionTitle>
                        <SectionValue color={props.color} >{props.value}</SectionValue>
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