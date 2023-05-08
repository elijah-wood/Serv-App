import styled from 'styled-components/native'
import { TouchableOpacity } from "react-native-gesture-handler"
import { Divider, HStack, VStack } from "native-base"
import { useEffect, useState } from 'react'

import { Invoice } from '../api/UseJobs'
import { renderCurrency } from '../utils/RenderCurrency'

type InvoiceProps = {
    invoice: Invoice
    onPress: () => void
}

export const InvoiceCell: React.FC<InvoiceProps> = ({
    ...props
}) => {
    const [totalPrice, setTotalPrice] = useState(0)

    const renderDate = (dateString: string): string => {
        let date = new Date(dateString)
        return date.toLocaleString()
    }

    useEffect(() => {
        const getTotalPrice = async () => {
            let total = 0
            console.log(props.invoice)
            props.invoice?.InvoiceItem?.forEach(item => {
                let itemPrice = (item.quantity * item.unit_amount) / 100
                total += itemPrice
            })
            setTotalPrice(total)
        }
        getTotalPrice()
    }, [])

    return (
        <ContainerView showBorder={true}>
            <TouchableOpacity onPress={props.onPress}>
            <VStack space={5}>
                <HStack space={2}>
                    <FlexFillWidth>
                        <Title>{renderCurrency(totalPrice)}</Title>            
                        <Subtitle>{'Estimate'}</Subtitle>
                        <Subtitle>Invoice #{props.invoice.number}</Subtitle>
                        <Subtitle>{renderDate(props.invoice.created_at)}</Subtitle>
                    </FlexFillWidth>
                </HStack>
                <Divider/>        
            </VStack>
            </TouchableOpacity>
        </ContainerView>
    )
}


const FlexFillWidth = styled.View`
  flex: 1;
  row-gap: 5px;
  width: 100%;
`

const ContainerView = styled.View<{ showBorder: boolean }>`
  width: 100%;
  padding-horizontal: 16px;
  padding-top: 16px;
  ${props => props.showBorder ? 'border: grey; border-radius: 9px;' : ''};
`

const Title = styled.Text`
  font-size: 17px;
  color: #0062FF;
  font-weight: bold;
  text-align: left;
`

const Subtitle = styled.Text`
  font-size: 15px;
  text-align: left;
`