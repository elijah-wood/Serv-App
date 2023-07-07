import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { SearchBar } from '@rneui/themed'
import { requestPermissionsAsync, getContactsAsync, PermissionStatus, Contact } from 'expo-contacts'
import { Linking } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import ContactCell, { SelectableContact } from '../components/ContactCell'
import DefaultButton from '../components/DefaultButton'
import { searchContacts } from '../utils/SearchContacts'
import { EmptyStateView } from '../components/EmptyStateView'
import LoadingView from './LoadingView'


type ImportContactListProps = {
  onImport: (contacts: SelectableContact[]) => void,
  isUploading: boolean,
  importButtonLabel: string | ((count: number) => string)
  filterContact?: (contact: Contact) => boolean
}


const ImportContactList = (props: ImportContactListProps) => {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState<SelectableContact[] | null>(null)
  const [permissionStatus, setPermissionStatus] = useState(PermissionStatus.UNDETERMINED)

  const syncContacts = async () => {
    const { status } = await requestPermissionsAsync()
    setPermissionStatus(status)
    if (status !== PermissionStatus.GRANTED) {
      return;
    }

    const { data } = await getContactsAsync({})
    setContacts(
      data
        .filter(props.filterContact ? props.filterContact : () => true)
        .sort((a, b) => a.name?.localeCompare(b.name))
        .map(contact => ({ ...contact, selected: false }))
    )
  }

  const toggleContact = (selectedContact: SelectableContact) => {
    setContacts(contacts => contacts.map(contact => {
      if (contact.id === selectedContact.id) {
        return { ...contact, selected: !contact.selected }
      }
      return contact
    }))
  }

  const handlePressImport = () => {
    const selectedContacts = contacts.filter(contact => contact.selected)
    props.onImport?.(selectedContacts)
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

  if (contacts === null) {
    return <LoadingView />
  }

  if (contacts?.length === 0) {
    return <EmptyStateView title="All contacts have imported" />
  }

  const filteredContactsBySearch = search.trim().length > 0 ?
    searchContacts<SelectableContact>(contacts, search) :
    contacts
  const selectedContacts = contacts.filter(contact => contact.selected)

  const buttonLabel = typeof props.importButtonLabel === 'string' ?
    props.importButtonLabel :
    props.importButtonLabel(selectedContacts.length)

  return <ContainerView>
    <SearchBar
      platform="ios"
      placeholder="Search by name, email, or phone"
      onChangeText={setSearch}
      value={search}
    />
    <FlashList
      estimatedItemSize={85}
      data={filteredContactsBySearch}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ContactCell contact={item} onPress={() => toggleContact(item)} />}
      keyboardDismissMode="interactive"
    />
    <ButtonContainerView>
      <DefaultButton
        label={buttonLabel}
        disabled={selectedContacts.length === 0}
        onPress={handlePressImport}
        loading={props.isUploading}
      />
    </ButtonContainerView>
  </ContainerView>
}

export default ImportContactList


const ContainerView = styled.View`
  height: 100%;
  width: 100%;
  background-color: white;
`

const ButtonContainerView = styled.View`
  padding-horizontal: 16px;
  padding-vertical: 15px;
`