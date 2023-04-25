import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Divider, FlatList, HStack, Spacer, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'

import { RootStackParamList } from '../../App'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import DefaultButton from '../components/DefaultButton'

type NavigationProp = StackNavigationProp<RootStackParamList, 'InvoiceScreen'>
type InvoiceRouteProp = RouteProp<RootStackParamList, 'InvoiceScreen'>

type Props = {
  route: InvoiceRouteProp
  navigation: NavigationProp
}

type InvoiceItem = {
    id: string
    itemName: string
    price: number
    quantity: number
}

const InvoiceScreen: React.FC<Props> = ({ navigation, route }) => {
    const { job } = route.params

    const [items, setItems] = useState<InvoiceItem[]>([])
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState(0.0)
    const [itemQuantity, setItemQuantity] = useState(1)
    const [itemTotal, setItemTotal] = useState('$0.00')
    const [grandTotal, setGrandTotal] = useState('$0.00')

    // const useCreateInvoice = UseCreateInvoice()

    // useEffect(() => {
    // switch (useGetJob.status) {
    //     case 'success':
    //         if (useGetJob.data.result) {
    //             setJob(useGetJob.data.result)
    //         }
    //     break
    //     default:
    //     break
    // }
    // }, [useGetJob])

    // if (useGetJob.isFetching) {
    //     return (
    //         <PaddedActivityIndicator/>
    //     )
    // }

    return (
    <ContainerView>
        <ScrollView>
            <VStack>
                <VStack>
                    <CellTitle>Customer</CellTitle>
                    <CellSubtitle>{renderCustomerFullName(job.Customer)}</CellSubtitle>
                    <Divider/>
                </VStack>
                <VStack>
                    <CellTitle>Job</CellTitle>
                    <CellSubtitle>{job.name}</CellSubtitle>
                    <Divider/>
                </VStack>
                <VStack>
                    <CellTitle>Due Date</CellTitle>
                    <CellSubtitle>04/05/23</CellSubtitle>
                    <Divider/>
                </VStack>
                <VStack>
                    <CellTitle>Items</CellTitle>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <Divider/> }
                        renderItem={({ item }) => (
                            <VStack>
                                <ItemNameTextInput
                                    onChange={setItemName}
                                    value={itemName}
                                    placeholder={'Enter item here'}
                                />
                                <HStack>
                                    <PriceTextInput
                                        onChange={setItemPrice}
                                        value={itemPrice}
                                        placeholder={'Price'}
                                    />
                                    <Spacer/>
                                    <QuantityTextInput
                                        onChange={setItemQuantity}
                                        value={itemQuantity}
                                        placeholder={'Quantity'}
                                    />
                                    <Spacer/>
                                    <ItemTotalText
                                        value={itemTotal}
                                    />
                                </HStack>
                            </VStack>  
                        )}
                    />
                    <DefaultButton label='New Item'/>
                </VStack>
                <HStack>
                    <TotalText>Total Amount</TotalText>
                    <Spacer/>
                    <TotalText>{grandTotal}</TotalText>
                </HStack>
            </VStack>
        </ScrollView>
    </ContainerView>
    )
}

const PriceTextInput = styled.TextInput`
`

const QuantityTextInput = styled.TextInput`
`

const ItemTotalText = styled.Text`
`

const TotalText = styled.Text`
`

const ItemNameTextInput = styled.TextInput`
`

const CellTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
`

const CellSubtitle = styled.Text`
  color: #E3E9ED;
`

const ContainerView = styled.View`
  background-color: transparent;
  height: 100%;
  width: 100%;
`

export default InvoiceScreen
