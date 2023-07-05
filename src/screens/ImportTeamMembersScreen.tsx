import { RouteProp } from '@react-navigation/native';
import { Contact } from 'expo-contacts';
import React, { useMemo, useState } from 'react'
import { RootStackParamList } from '../../App';
import { SelectableContact } from '../components/ContactCell';
import ImportContactList from '../components/ImportContactList';
import { formatPhoneNumber } from '../utils/FormatPhoneNumber';

type ImportTeamMembersScreenRouteProp = RouteProp<RootStackParamList, 'ImportTeamMembersScreen'>

type ImportTeamMembersScreenProps = {
	route: ImportTeamMembersScreenRouteProp
}

const ImportTeamMembersScreen = (props: ImportTeamMembersScreenProps) => {
	const members = props.route?.params?.members ?? [];
	const phoneNumbers: string[] = useMemo(() => {
		return members.map(member => member.User.phone);
	}, [members]);

	const [isUploading, setUploading] = useState(false)

	const handleImport = (contacts: SelectableContact[]) => {
		setUploading(true)
		
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
