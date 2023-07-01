import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { SearchBar } from '@rneui/themed'
import { requestPermissionsAsync, getContactsAsync, PermissionStatus, Contact } from 'expo-contacts'
import { DeviceEventEmitter, FlatList, Linking } from 'react-native'
import UseCustomers, { Customer } from '../api/UseCustomers'
import ContactCell, { SelectableContact } from '../components/ContactCell'
import DefaultButton from '../components/DefaultButton'
import { searchContacts } from '../utils/SearchContacts'
import UseUploadCustomers from '../api/UseUploadCustomers'
import { useNavigation } from '@react-navigation/native'
import { EmptyStateView } from '../components/EmptyStateView'
import { formatPhoneNumber } from '../utils/FormatPhoneNumber'

const filterContact = (contact: Contact, existingPhoneNumbers: string[]): boolean => {
	if (!contact.phoneNumbers || contact.phoneNumbers?.length === 0) {
		return false
	}

	if (existingPhoneNumbers.indexOf(formatPhoneNumber(contact.phoneNumbers?.[0].number)) !== -1) {
		return false
	}

	return true
}

const getImportButtonLabel = (contacts: SelectableContact[]): string => {
	if (contacts.length === 1) {
		return `Add ${contacts.length} Customer`
	}
	if (contacts.length > 1) {
		return `Add ${contacts.length} Customers`
	}
	return 'Add Customers'
}

const ImportCustomersScreen = () => {
	const useCustomers = UseCustomers()
	const useUploadCustomers = UseUploadCustomers()
	const navigation = useNavigation()

	const [search, setSearch] = useState('')
	const [contacts, setContacts] = useState<SelectableContact[] | null>(null)
	const [isUploading, setUploading] = useState(false)
	const [permissionStatus, setPermissionStatus] = useState(PermissionStatus.UNDETERMINED)

	const syncContacts = async () => {
		const { status } = await requestPermissionsAsync()
		setPermissionStatus(status)
    if (status !== PermissionStatus.GRANTED) {
      return;
    }

    let existingCustomers = useCustomers.data?.result
		if (!existingCustomers) {
			existingCustomers = (await useCustomers.refetch()).data.result
		}

		const existingCustomerPhoneNumbers = existingCustomers?.map(customer => customer.phone)

    const { data } = await getContactsAsync({})
    setContacts(
    	data
    		.filter((contact) => filterContact(contact, existingCustomerPhoneNumbers))
    		.sort((a, b) => a.name?.localeCompare(b.name))
    		.map(contact => ({ ...contact, selected: false }))
		)
	}

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

	const importContacts = async () => {
		setUploading(true);
		const selectedContacts = contacts.filter(contact => contact.selected)
		const customers = selectedContacts.map(contact => {
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

	const toggleContact = (selectedContact: SelectableContact) => {
		setContacts(contacts => contacts.map(contact => {
			if (contact.id === selectedContact.id) {
				return { ...contact, selected: !contact.selected }
			}
			return contact
		}))
	}

	const handlePressAddContactsButton = () => {
		importContacts()
	}

	useEffect(() => {
		syncContacts()
	}, [])

	if (permissionStatus === PermissionStatus.DENIED) {
		return <EmptyStateView 
			title='You must allow access to your contacts.'
			subtitle='In order to do so, go to device settings.'
			actionTitle='Open Settings'
			onPressAction={() => Linking.openSettings()}
		/>
	}

 	if (useCustomers.isLoading || contacts === null) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }

  if (contacts?.length === 0) {
  	return <EmptyStateView title="All contacts have imported" />
  }

  const filteredContactsBySearch = search.trim().length > 0 ?
  	searchContacts<SelectableContact>(contacts, search) :
  	contacts
  const selectedContacts = contacts.filter(contact => contact.selected)

	return <ContainerView>
		<SearchBar
      platform="ios"
      placeholder="Search by name, email, or phone"
      onChangeText={setSearch}
      value={search}
    />
    <FlatList
    	data={filteredContactsBySearch}
    	keyExtractor={item => item.id}
    	renderItem={({ item }) => <ContactCell contact={item} onPress={() => toggleContact(item)} />}
    	contentContainerStyle={{flexGrow: 1}}
    	keyboardDismissMode="interactive"
    />
    <ButtonContainerView>
    	<DefaultButton
    		label={getImportButtonLabel(selectedContacts)}
    		disabled={selectedContacts.length === 0}
    		onPress={handlePressAddContactsButton}
    		loading={isUploading}
  		/>
    </ButtonContainerView>
	</ContainerView>
}

const PaddedActivityIndicator = styled.ActivityIndicator`
  padding: 12px;
`

const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  background-color: white;
`

const ButtonContainerView = styled.View`
	padding-horizontal: 16px;
	padding-vertical: 15px;
`

export default ImportCustomersScreen