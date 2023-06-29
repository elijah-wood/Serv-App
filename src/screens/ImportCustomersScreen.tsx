import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { SearchBar } from '@rneui/themed'
import { requestPermissionsAsync, getContactsAsync, PermissionStatus } from 'expo-contacts'
import { DeviceEventEmitter, FlatList } from 'react-native'
import UseCustomers, { Customer } from '../api/UseCustomers'
import ContactCell, { SelectableContact } from '../components/ContactCell'
import DefaultButton from '../components/DefaultButton'
import { searchContacts } from '../utils/SearchContacts'
import UseUploadCustomers from '../api/UseUploadCustomers'
import { useNavigation } from '@react-navigation/native'

const ImportCustomersScreen = () => {
	const useCustomers = UseCustomers()
	const useUploadCustomers = UseUploadCustomers()
	const navigation = useNavigation()

	const [search, setSearch] = useState('')
	const [contacts, setContacts] = useState<SelectableContact[] | null>(null)
	const [isUploading, setUploading] = useState(false);

	const syncContacts = async () => {
		if (!useCustomers.data) {
			await useCustomers.refetch();
		}
		// const existingCustomers = useCustomers.data;
		const { status } = await requestPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      // TODO show message about contacts permissions
      return;
    }
    const { data } = await getContactsAsync({});
    setContacts(
    	data
    		.sort((a, b) => a.name.localeCompare(b.name))
    		.map(contact => ({ ...contact, selected: false }))
		);
	}

	useEffect(() => {
		console.log(JSON.stringify(useUploadCustomers.data));
		switch (useUploadCustomers.status) {
		case 'success':
			setUploading(false);
			DeviceEventEmitter.emit("event.refetchCustomers")
      navigation.goBack()
    case 'error':
    	setUploading(false);
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
				email: contact?.emails?.[0].email,
				phone: '+15416923156'
			} as Customer

			console.log(JSON.stringify(contact.phoneNumbers))

			return customer
		});
		console.log(customers);
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

 	if (useCustomers.isLoading || !contacts) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
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
    		label={selectedContacts.length > 0 ? `Add ${selectedContacts.length} contacts` : `Add contacts`}
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