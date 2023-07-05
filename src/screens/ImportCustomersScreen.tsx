import React, { useEffect, useMemo, useState } from 'react'
import { Contact } from 'expo-contacts'
import { DeviceEventEmitter } from 'react-native'
import { Customer } from '../api/UseCustomers'
import { SelectableContact } from '../components/ContactCell'
import UseUploadCustomers from '../api/UseUploadCustomers'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { formatPhoneNumber } from '../utils/FormatPhoneNumber'
import ImportContactList from '../components/ImportContactList'
import { RootStackParamList } from '../../App'

const getImportButtonLabel = (count: number): string => {
	if (count === 1) {
		return `Add ${count} Customer`
	}
	if (count > 1) {
		return `Add ${count} Customers`
	}
	return 'Add Customers'
}


type ImportCustomersScreenRouteProp = RouteProp<RootStackParamList, 'ImportCustomersScreen'>


type ImportTeamMembersScreenProps = {
	route: ImportCustomersScreenRouteProp
}


const ImportCustomersScreen = (props: ImportTeamMembersScreenProps) => {
	const customers = props.route.params?.customers ?? []
	const phoneNumbers: string[] = useMemo(() => {
		return customers.map(customer => customer.phone)
	}, [customers])

	const useUploadCustomers = UseUploadCustomers()
	const navigation = useNavigation()

	const [isUploading, setUploading] = useState(false)

	useEffect(() => {
		switch (useUploadCustomers.status) {
		case 'success':
			setUploading(false)
			DeviceEventEmitter.emit("event.refetchCustomers")
      navigation.goBack()
    case 'error':
    	setUploading(false)
		default:
			break
		}
	}, [useUploadCustomers.status])

	const importContacts = async (contacts: SelectableContact[]) => {
		setUploading(true);
		const customers = contacts.map(contact => {
			let customer = {
				first_name: contact.firstName,
				last_name: contact.lastName,
				email: contact.emails?.[0].email,
				phone: formatPhoneNumber(contact.phoneNumbers?.[0].number)
			} as Customer

			return customer
		});
		useUploadCustomers.mutate(customers)
	}

	const filterContact = (contact: Contact) => {
		if (!contact.phoneNumbers || contact.phoneNumbers?.length === 0) {
			return false
		}
		if (phoneNumbers.indexOf(formatPhoneNumber(contact.phoneNumbers?.[0].number)) !== -1) {
			return false
		}
		return true;
	}

	const handlePressAddContactsButton = (contacts: SelectableContact[]) => {
		importContacts(contacts)
	}

	return <ImportContactList
		onImport={handlePressAddContactsButton}
		isUploading={isUploading}
		importButtonLabel={getImportButtonLabel}
		filterContact={filterContact}
	/>
}

export default ImportCustomersScreen