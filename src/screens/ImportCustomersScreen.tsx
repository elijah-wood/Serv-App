import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { SearchBar } from '@rneui/themed'
import { requestPermissionsAsync, getContactsAsync, PermissionStatus } from 'expo-contacts'
import { FlatList } from 'react-native'
import UseCustomers from '../api/UseCustomers'
import ContactCell, { SelectableContact } from '../components/ContactCell'
import DefaultButton from '../components/DefaultButton'

const searchContacts = (contacts: SelectableContact[], search: string): SelectableContact[] => {
	return contacts.filter(contact => {
  	const searchString = search.trim().toLowerCase();
  	
  	if (contact.name.toLowerCase().includes(searchString)) {
  		return true;
  	}
  	
  	if (contact.phoneNumbers) {
  		const phoneNumbers = contact.phoneNumbers.map(p => p.digits).join(',')
  		if (phoneNumbers.includes(searchString)) {
  			return true;
  		}
  	}

  	if (contact.emails) {
			const emails = contact.emails.map(p => p.email).join(',')
  		if (emails.includes(searchString)) {
  			return true;
  		}
  	}

  	return false;
  })
}

const ImportCustomersScreen = () => {
	const useCustomers = UseCustomers()
	const [search, setSearch] = useState('');
	const [contacts, setContacts] = useState<SelectableContact[] | null>(null);

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
    setContacts(data.map(contact => ({ ...contact, selected: false })));
	}

	const toggleContact = (selectedContact: SelectableContact) => {
		setContacts(contacts => contacts.map(contact => {
			if (contact.id === selectedContact.id) {
				return { ...contact, selected: !contact.selected }
			}
			return contact
		}))
	};

	useEffect(() => {
		syncContacts()
	}, []);

 	if (useCustomers.isLoading || !contacts) {
    return (
      <ContainerView>
          <PaddedActivityIndicator/>
      </ContainerView>
    )
  }

  const filteredContactsBySearch = search.trim().length > 0 ?
  	searchContacts(contacts, search) :
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