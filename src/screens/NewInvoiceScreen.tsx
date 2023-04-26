import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Divider, FlatList, HStack, Spacer, VStack, View } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'
import { Controller, useForm } from 'react-hook-form'
import { MaskedText, MaskedTextInput } from "react-native-mask-text"

import { RootStackParamList } from '../../App'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import DefaultButton from '../components/DefaultButton'
import { TextInput } from 'react-native'

type NavigationProp = StackNavigationProp<RootStackParamList, 'InvoiceScreen'>
type InvoiceRouteProp = RouteProp<RootStackParamList, 'InvoiceScreen'>

type Props = {
  route: InvoiceRouteProp
  navigation: NavigationProp
}

type InvoiceItem = {
    id: string
    itemName: string
    price: string
    quantity: string
    totalPrice: string
}

const InvoiceScreen: React.FC<Props> = ({ navigation, route }) => {
    const { job } = route.params

    const { control, handleSubmit, formState: { errors }, getValues, setFocus, reset } = useForm({
        defaultValues: {
            name: '',
            price: '',
            quantity: '1'
        }
    })

    const [items, setItems] = useState<InvoiceItem[]>([])
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

    const onSubmit = () => { 
        setItems([...items, { 
            id: getValues('name'), 
            itemName: getValues('name'), 
            price: getValues('price'), 
            quantity: getValues('quantity'),
            totalPrice: ''
        }])
        reset()
    }

    return (
        <ContainerView>
            <ScrollView>
                <CellContainer>
                    <VStack space={2}>
                        <Cell title={'Customer'} subtitle={renderCustomerFullName(job.Customer)}/>
                        <Cell title={'Job'} subtitle={job.name}/>
                        <Cell title={'Due Date'} subtitle={'??'}/>
                        <VStack space={1}>
                            <CellTitle>Items</CellTitle>
                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.id}
                                ItemSeparatorComponent={() => <Divider/> }
                                renderItem={({ item }) => (
                                    <VStack space={1}>
                                        <ItemText>{item.itemName}</ItemText>
                                        <HStack>
                                            <MaskedText
                                                style={{ fontSize: 17 }}
                                                type="currency"
                                                options={{
                                                    prefix: '$',
                                                    decimalSeparator: '.',
                                                    groupSeparator: ',',
                                                    precision: 2
                                                }}
                                            >{item.price}</MaskedText>
                                            <Spacer/>
                                            <ItemText>{item.quantity}</ItemText>
                                            <Spacer/>
                                            <ItemText>?</ItemText>
                                        </HStack>
                                    </VStack>  
                                )}
                            />
                            <VStack space={1}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <TextInput
                                            style={{ fontSize: 17 }}
                                            onChangeText={onChange}
                                            value={value}
                                            onBlur={onBlur}
                                            placeholder={'Enter item here'}
                                        />
                                    )}
                                    name="name"
                                />
                                <HStack>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value, onBlur } }) => (
                                            <MaskedTextInput
                                                style={{ fontSize: 17 }}
                                                onChangeText={(_, raw) => { onChange(raw) }}
                                                value={value}
                                                onBlur={onBlur}
                                                keyboardType='numeric'
                                                type="currency"
                                                options={{
                                                  prefix: '$',
                                                  decimalSeparator: '.',
                                                  groupSeparator: ',',
                                                  precision: 2
                                                }}
                                            />  
                                        )}
                                        name="price"
                                    />  
                                    <Spacer/>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value, onBlur } }) => (
                                            <TextInput
                                                style={{ fontSize: 17 }}
                                                onChangeText={onChange}
                                                value={value}
                                                onBlur={onBlur}
                                                placeholder={'Quantity'}
                                                keyboardType='number-pad'

                                            />
                                        )}
                                        name="quantity"
                                    />  
                                    <Spacer/>
                                    <ItemTotalText>{itemTotal}</ItemTotalText>
                                </HStack>
                            </VStack>  
                            <DefaultButton label='Add Item' onPress={handleSubmit(onSubmit)}/>
                        </VStack>
                        <Divider/>
                        <HStack>
                            <TotalText>Total Amount</TotalText>
                            <Spacer/>
                            <TotalText>{grandTotal}</TotalText>
                        </HStack>
                    </VStack>
                </CellContainer>
            </ScrollView>
        </ContainerView>
    )
}

const Cell = ({title, subtitle}) => (
    <VStack space={1}>
        <CellTitle>{title}</CellTitle>
        <CellSubtitle>{subtitle}</CellSubtitle>
        <Divider/>
    </VStack>
)

const ItemTotalText = styled.Text`
  font-size: 17px;
`

const ItemText = styled.Text`
  font-size: 17px; 
`

const TotalText = styled.Text`
  font-size: 17px;
  font-weight: bold;
`

const CellContainer = styled.View`
    padding-horizontal: 12px;
    padding-top: 12px;
`

const CellTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
`

const CellSubtitle = styled.Text`
  color: #0062FF;
  font-size: 17px;
`

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
`

export default InvoiceScreen
