import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Box, Divider, Flex, HStack, Spacer, VStack } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaskedText } from "react-native-mask-text"
import { Alert, Button, DeviceEventEmitter, Pressable, TextInput, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import CurrencyInput from 'react-native-currency-input'

import { RootStackParamList } from '../../App'
import { renderCustomerFullName } from '../utils/RenderCustomerFullName'
import DefaultButton from '../components/DefaultButton'
import UseCreateInvoice, { InvoiceItem as InvoiceItemAPI } from '../api/UseCreateInvoice'

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
    totalPrice: number
}

const InvoiceScreen: React.FC<Props> = ({ navigation, route }) => {
    const { job } = route.params
    const useCreateInvoice = UseCreateInvoice()

    const [date, setDate] = useState(new Date())
    const [openDatePicker, setOpenDatePicker] = useState(false)

    useEffect(() => {
        switch (useCreateInvoice.status) {
            case 'success':
                DeviceEventEmitter.emit("event.refetchInvoices")
                navigation.goBack()
            break
            default:
            break
        }
    }, [useCreateInvoice])

    const [items, setItems] = useState<Item[]>([{ name: '', price: 0, quantity: 1 }])
    const [grandTotal, setGrandTotal] = useState(0)
    const itemRefs = useRef<InvoiceItemHandle[]>([])  
    const itemTotals = useRef<number[]>([])

    const addItem = () => {
        const newItem: Item = { name: '', price: 0, quantity: 1 }
        let existingItems: Item[] = []
        itemRefs.current.forEach(ref => {
            if (ref !== null) {
                existingItems.push(ref.get())
            }
        })        
        setItems([...existingItems, newItem])
    }

    const updateTotal = () => {
        setGrandTotal(itemTotals.current.reduce((accumulator, a) => accumulator + a, 0))
    }

    return (
        <>
            <DatePicker
                modal
                open={openDatePicker}
                date={date}
                mode={'date'}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
            <ContainerView>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    <CellContainer>
                        <VStack>
                            <Cell title={'Customer'} subtitle={renderCustomerFullName(job.Customer)}/>
                            <Cell title={'Job'} subtitle={job.name}/>
                            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                                <Cell title={'Due Date'} subtitle={date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' })}/>
                            </TouchableOpacity>
                            <VStack space={2}>
                                <CellTitle>Items</CellTitle>                                
                                {items.map((item, index) => (
                                    <InvoiceItem
                                        key={index}
                                        item={item}
                                        ref={(itemRef: InvoiceItemHandle) => {
                                            itemRefs.current[index] = itemRef                                       
                                        }}               
                                        onUpdate={(total) => { 
                                            itemTotals.current[index] = total
                                            updateTotal()
                                        }}     
                                        onDelete={() => {
                                            let updatedItems: Item[] = []                                        
                                            itemRefs.current.forEach((ref, i) => { 
                                                if (i != index && ref !== null) {
                                                    updatedItems.push(ref.get())
                                                }
                                            })
                                            setItems(updatedItems)
                                            itemRefs.current.splice(index, 1)
                                            itemTotals.current.splice(index, 1)
                                            updateTotal()
                                        }}                                      
                                    />
                                ))}       
                                <Box alignItems={'left'} marginLeft={-2}>                                    
                                    <Button title="Add Item" onPress={addItem} />                                    
                                </Box>                    
                            </VStack>
                            <TotalContainer>
                                <HStack>
                                    <TotalText>Total Amount</TotalText>
                                    <Spacer/>
                                    <MaskedText
                                        style={{ fontSize: 17, textAlign: 'right', fontWeight: 'bold' }}
                                        type="currency"
                                        options={{
                                            prefix: '$',
                                            decimalSeparator: '.',
                                            groupSeparator: ',',
                                            precision: 2
                                        }}>{grandTotal}</MaskedText> 
                                </HStack>
                            </TotalContainer>                               
                        </VStack>
                    </CellContainer>
                    <Flex direction='row' justifyContent={'space-between'} style={{ padding: 12, gap: 12 }}>
                        <Box flex={1}>
                            <DefaultButton label='Send Estimate'/>
                        </Box>     
                        <Box flex={1}>
                            <DefaultButton loading={useCreateInvoice.isLoading} label='Send Invoice' onPress={() => {
                                let items: Item[] = []
                                itemRefs.current.forEach(ref => { 
                                    if (ref !== null) {                                        
                                        items.push(ref.get()) 
                                    }                                    
                                })
                                useCreateInvoice.mutate({ items: items.map(item => {                                     
                                    return { description: item.name, unit_amount: item.price, amount: item.price * item.quantity } as InvoiceItemAPI 
                                })})
                            }}/>
                        </Box>                                                                 
                    </Flex>              
                </KeyboardAwareScrollView>
            </ContainerView>
        </>
    )
}

const Cell = ({title, subtitle}) => (
    <VStack space={1}>
        <CellTitle>{title}</CellTitle>
        <CellSubtitle>{subtitle}</CellSubtitle>
        <Divider/>
    </VStack>
)


interface Item {
    name: string;
    price: number;
    quantity: number;
}

type InvoiceItemHandle = {
    get: () => Item
}

type InvoiceItemProps = {
    item: Item
    onUpdate: (total: number) => void
    onDelete: () => void
    ref: React.ForwardedRef<InvoiceItemHandle>
}

const InvoiceItem: React.FC<InvoiceItemProps> = forwardRef((props, ref) => {
    const [name, setName] = useState(props.item.name)
    const [price, setPrice] = useState(props.item.price)
    const [quantity, setQuantity] = useState(props.item.quantity.toString())

    useEffect(() => {
        setName(props.item.name)
        setPrice(props.item.price)
        setQuantity(props.item.quantity.toString())
    }, [props.item])

    const total = (price * 100) * parseFloat(quantity)

    useEffect(() => {
        props.onUpdate(total)
    }, [quantity, price])

    useImperativeHandle(ref, () => ({
        get: () => {
            return { name: name, price: price, quantity: parseFloat(quantity) } as Item
        },
    }))
  
    return (
        <VStack space={2}>
            <HStack>
                <TextInput
                    style={{ fontSize: 17 }}
                    onChangeText={setName}
                    value={name}                
                    placeholder={'Enter item name here'}
                />  
                <Spacer/>
                <Pressable onPress={() => {
                    props.onDelete()
                }}> 
                    <DeleteText>Delete</DeleteText>
                </Pressable>                                    
            </HStack>          
            <Flex direction='row'>
                <Box width={'33.3%'} alignSelf={'flex-left'}>
                    <CurrencyInput
                        style={{ fontSize: 17 }}                        
                        value={price}
                        onChangeValue={setPrice}
                        prefix="$"
                        delimiter=","
                        separator="."
                        precision={2}
                        minValue={0}
                        maxValue={100000}
                        />
                </Box>
                <Box width={'33.3%'} alignSelf={'flex-center'}>
                    <TextInput
                        style={{ fontSize: 17, textAlign: 'center' }}
                        onChangeText={setQuantity}                        
                        value={quantity}                        
                        placeholder={'Quantity'}
                        keyboardType='number-pad'
                    />
                </Box>     
                <Box width={'33.3%'} alignSelf={'flex-right'}>
                    <MaskedText
                        style={{ fontSize: 17, textAlign: 'right' }}
                        type="currency"
                        options={{
                            prefix: '$',
                            decimalSeparator: '.',
                            groupSeparator: ',',
                            precision: 2
                        }}>{total}</MaskedText> 
                </Box>                                                       
            </Flex>
            <Divider/>
        </VStack>  
    )
})

const DeleteText = styled.Text`
  font-size: 17px;
  font-weight: 500;
  color: red;
`

const TotalContainer = styled.View`
  padding-top: 12px;
`

const TotalText = styled.Text`
  font-size: 17px;
  font-weight: bold;
`

const CellContainer = styled.View`
  padding-horizontal: 12px;
`

const CellTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  padding-top: 12px;
`

const CellSubtitle = styled.Text`
  color: #0062FF;
  font-size: 17px;
  padding-bottom: 12px;
`

const ContainerView = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
`

export default InvoiceScreen
