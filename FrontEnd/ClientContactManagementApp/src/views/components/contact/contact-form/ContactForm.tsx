import React, { useEffect, useState } from 'react';
import './ContactForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';


interface IProps {
  setCloseModal: (value: boolean) => void;
}

const ContactsForm = observer(({ setCloseModal }: IProps) => {
  const { store, api } = useAppContext();
  const [contact, setContact] = useState<IContact>({ ...defaultContact });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const $contact: IContact = {
      id: 0,
      name: contact.name,
      surname: contact.surname,
      email: contact.email
    }

    try {
      await api.contact.create($contact);
      store.contact.removeAll();
      await api.contact.getAll();
      onClose();
    } catch (error) {


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
            type="email"
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
