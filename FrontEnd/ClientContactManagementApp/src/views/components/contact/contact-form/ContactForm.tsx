import React, { useEffect, useState } from 'react';
import './ContactForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';
import { validateContact } from '../../../../validation-functions/ValidationFunctions';
import ErrorMessage from '../../../../shared-components/error-message/ErrorMessage';

interface IProps {
  setCloseModal: (value: boolean) => void;
}

const ContactsForm = observer(({ setCloseModal }: IProps) => {
  const { store, api } = useAppContext();
  const [contact, setContact] = useState<IContact>({ ...defaultContact });
  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the contact object
    const validationError = validateContact(contact);
    if (validationError) {
      setNameErrorMessage(validationError);
      return; // Exit early if validation fails
    }

    const $contact: IContact = {
      id: 0,
      name: contact.name || '',
      surname: contact.surname || '',
      email: contact.email || ''
    };

    try {
      await api.contact.create($contact);
      window.location.reload() // temporary UI fix
      onClose();
    } catch (error) {
      // Handle error state or display error message to the user
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
  };

  // Handle modal close
  const onClose = () => {
    setContact({ ...defaultContact });
    store.contact.clearSelected(); // Clear selected contact in MobX store
    setCloseModal(false);
  };

  // Effect to set contact when selected contact changes
  useEffect(() => {
    if (store.contact.selected) {
      setContact(store.contact.selected);
    }
  }, [store.contact.selected]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {nameErrorMessage && <ErrorMessage errorMessage={nameErrorMessage} />}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            className='uk-input'
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Surname:</label>
          <input
            className='uk-input'
            type="text"
            id="surname"
            name="surname"
            value={contact.surname}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            className='uk-input'
            type="text"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Contact
        </button>
      </form>
    </div>
  );
});

export default ContactsForm;
