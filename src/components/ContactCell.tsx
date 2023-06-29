import React from 'react'
import styled from 'styled-components/native'
import { Avatar, Divider, HStack, Spacer, VStack } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureResponderEvent, TouchableOpacity } from 'react-native'
import { getInitials } from '../utils/GetStringInitials'
import { Contact } from 'expo-contacts'

export interface SelectableContact extends Contact {
	selected: boolean
}

type ContactCellProps = {
	contact: SelectableContact
	onPress: (e: GestureResponderEvent) => void
}

const ContactCell = (props: ContactCellProps) => {
	const { contact, onPress } = props
	const phoneNumber = contact.phoneNumbers?.[0].number ?? null
	const email = contact.emails?.[0].email ?? null
	const { selected } = contact

	return <ContactCellContainerView>
		<TouchableOpacity onPress={onPress}>
			<VStack space={5}>
				<HStack style={{alignItems: 'center'}}>
					<Avatar>
            {getInitials(contact.name)}
          </Avatar>
          <ContactCellContentView>
          	<ContactTitleText>
          		{contact.name}
          	</ContactTitleText>
          	
          	{phoneNumber ?
	          	<ContactFieldText>
	          		{phoneNumber}
	          	</ContactFieldText> :
	          	null
	          }
	          
	          {email ? 
		          <ContactFieldText>
		          	{email}
		          </ContactFieldText> :
		          null
		        }
          </ContactCellContentView>
          
          <Spacer />
          
          {selected ?
          	<Icon name='checkmark-circle' color={'#0046FF'} size={25} /> :
          	<EmptySelectedIcon />
          }
				</HStack>
				<Divider />
			</VStack>
		</TouchableOpacity>
	</ContactCellContainerView>
};

const ContactCellContainerView = styled.View`
	width: 100%;
  padding-left: 16px;
  padding-right: 18px;
  padding-top: 16px;
`;

const ContactCellContentView = styled.View`
	padding-horizontal: 12px;
`

const ContactTitleText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	line-height: 22px;
`

const ContactFieldText = styled.Text`
	font-size: 15px;
	line-height: 18px;
`

const EmptySelectedIcon = styled.View`
	width: 20px;
	height: 20px;
	border-width: 1px;
	border-radius: 11px;
	border-color: #C7C7CC;
	margin-right: 3px;
`

export default ContactCell
