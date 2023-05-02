import styled from 'styled-components/native'
import { TouchableOpacity } from "react-native-gesture-handler"
import { Divider, HStack, VStack } from "native-base"

import { Invoice } from "../api/UseJobs"

type InvoiceProps = {
    invoice: Invoice
    onPress: () => void
}

export const InvoiceCell: React.FC<InvoiceProps> = ({
...props
}) => {

return (
    <JobContainerView showBorder={true}>
        <TouchableOpacity onPress={props.onPress}>
        <VStack space={5}>
            <HStack space={2}>
                <JobFlexFillWidth>
                    <JobTitle>${props.invoice.price / 100}</JobTitle>            
                    <JobSubtitle>{'Estimate'}</JobSubtitle>
                    <JobSubtitle>{props.invoice.number}</JobSubtitle>
                    <JobSubtitle>{'May 1 at 3:14pm'}</JobSubtitle>
                </JobFlexFillWidth>
                {/* <Avatar>
                    {getInitials(renderCustomerFullName(props.customer))}
                </Avatar> */}
            </HStack>
            <Divider/>        
        </VStack>
        </TouchableOpacity>
    </JobContainerView>
)
}


const JobFlexFillWidth = styled.View`
  flex: 1;
  row-gap: 5px;
  width: 100%;
`

const JobContainerView = styled.View<{ showBorder: boolean }>`
  width: 100%;
  padding-horizontal: 16px;
  padding-top: 16px;
  ${props => props.showBorder ? 'border: grey; border-radius: 9px;' : ''};
`

const JobTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  text-align: left;
`

const JobSubtitle = styled.Text`
  font-size: 15px;
  text-align: left;
`