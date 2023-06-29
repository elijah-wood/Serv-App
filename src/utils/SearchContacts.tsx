import { Contact } from "expo-contacts";

export function searchContacts<T extends Contact>(contacts: T[], search: string): T[] {
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