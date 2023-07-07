import React from 'react'
import styled from 'styled-components/native'


const LoadingView = () => {
  return <ContainerView>
    <PaddedActivityIndicator/>
  </ContainerView>
}


export default LoadingView


const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  background-color: white;
`
