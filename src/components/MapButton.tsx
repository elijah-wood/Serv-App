import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'

type Props = TouchableOpacityProps & {
}
  
export const MapButton: React.FC<Props> = ({
    onPress,
    ...props
  }) => {
    return (
        <MapsContainerView>
            <MapsText>map</MapsText>
        </MapsContainerView>
    )
}

const MapsContainerView = styled.View`
  background: #0062FF;
  border-radius: 9px;
  aspect-ratio: 1;
  flex: 1;
  justify-content: center;
  align-items: center;
`

const MapsText = styled.Text`
  color: white;
  font-size: 16px;
`