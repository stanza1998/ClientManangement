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
  const [nameErrorMessage, setNameErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the contact object
    const validationError = validateContact(contact);
    if (validationError) {
      setNameErrorMessage(validationError)
      setContact({
        ...defaultContact,
        name: "",
        surname: "",
        email: ""

      })
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
      store.contact.removeAll();
      await api.contact.getAll();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      // Handle error state or display error message to the user
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prevClient => ({
      ...prevClient,
      [name]: value
    }));
  };

  const onClose = () => {
    setContact({ ...defaultContact })
    store.contact.clearSelected;
    setCloseModal(false)
  }

  useEffect(() => {
    if (store.contact.selected) {
      setContact(store.contact.selected);
    } else {

    }
  }, [store.contact.selected])

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {nameErrorMessage && <ErrorMessage errorMessage={nameErrorMessage} />}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={contact.surname}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          Create Contact
        </button>
      </form>
    </div>
  );
});

export default ContactsForm;
