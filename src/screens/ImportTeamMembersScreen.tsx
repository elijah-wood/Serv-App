import { RouteProp } from '@react-navigation/native';
import { Contact } from 'expo-contacts';
import React, { useEffect, useMemo, useState } from 'react'
import { RootStackParamList } from '../../App';
import { Member } from '../api/UseCustomers';
import UseUploadMembers from '../api/UseUploadMembers';
import { SelectableContact } from '../components/ContactCell';
import ImportContactList from '../components/ImportContactList';
import { formatPhoneNumber } from '../utils/FormatPhoneNumber';

type ImportTeamMembersScreenRouteProp = RouteProp<RootStackParamList, 'ImportTeamMembersScreen'>

type ImportTeamMembersScreenProps = {
	route: ImportTeamMembersScreenRouteProp
}

const ImportTeamMembersScreen = (props: ImportTeamMembersScreenProps) => {
	const useUploadMembers = UseUploadMembers()
	const members = props.route?.params?.members ?? []
	const phoneNumbers: string[] = useMemo(() => {
		return members.map(member => member.User.phone)
	}, [members])

	const [isUploading, setUploading] = useState(false)

	useEffect(() => {
		switch (useUploadMembers.status) {
		case 'success':
			setUploading(false)
    case 'error':
    	setUploading(false)
		default:
			break
		}
	}, [useUploadMembers.status])

	const handleImport = (contacts: SelectableContact[]) => {
		setUploading(true)
		const members = contacts.map(contact => {
			let member = {
				first_name: contact.firstName,
				last_name: contact.lastName,
				email: contact.emails?.[0].email,
				phone: formatPhoneNumber(contact?.phoneNumbers?.[0].number)
			}
			return member
		});
		useUploadMembers.mutate(members)
		setUploading(false)
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

	return <ImportContactList
		filterContact={filterContact}
		onImport={handleImport}
		importButtonLabel={getImportButtonLabel}
		isUploading={isUploading}
	/>;
}


const getImportButtonLabel = (count: number): string => {
	if (count === 1) {
		return `Add ${count} Team Member`
	}
	if (count > 1) {
		return `Add ${count} Team Members`
	}
	return 'Add Team Members'
}


export default ImportTeamMembersScreen