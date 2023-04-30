import styled from 'styled-components/native'
import { TouchableOpacity } from "react-native-gesture-handler"
import { Avatar, Divider, HStack, VStack } from "native-base"

import { Job } from "../api/UseJobs"
import { renderCustomerFullName } from "../utils/RenderCustomerFullName"
import { renderAddress } from "../utils/RenderAddress"
import { getInitials } from "../utils/GetStringInitials"
import { Customer } from '../api/UseCustomers'
import { capitalizeFirstLetter } from '../utils/CapitalizeFirstLetter'

type JobProps = {
    job: Job
    customer: Customer
    showBorder: boolean
    onPress: () => void
}

export const JobRow: React.FC<JobProps> = ({
...props
}) => {

return (
    <JobContainerView showBorder={props.showBorder}>
        <TouchableOpacity onPress={props.onPress}>
        <VStack space={5}>
            <HStack space={2}>
                <JobFlexFillWidth>
                    <JobTitle>{props.job.name}</JobTitle>            
                    <JobSubtitle>{renderCustomerFullName(props.customer)}</JobSubtitle>
                    <JobSubtitle>{renderAddress(props.job.address)}</JobSubtitle>
                    <JobBoldSubtitle>{capitalizeFirstLetter(props.job.status) + ' • ' + 'You'}</JobBoldSubtitle>
                </JobFlexFillWidth>
                {/* <Avatar>
                    {getInitials(renderCustomerFullName(props.customer))}
                </Avatar> */}
            </HStack>
            {(props.showBorder == false) && 
                <Divider/>
            }

            {(props.showBorder == true) && 
                <Divider/>
            }
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
  padding-horizontal: 15px;
  padding-top: 15px;
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

const JobBoldSubtitle = styled.Text`
  font-size: 15px;
  text-align: left;
  font-weight: bold;
`