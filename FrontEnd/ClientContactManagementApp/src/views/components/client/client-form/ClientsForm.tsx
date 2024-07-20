import React, { useEffect, useState } from 'react';
import './ClientsForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { validateClientName } from '../../../../validation-functions/ValidationFunctions';
import ErrorMessage from '../../../../shared-components/error-message/ErrorMessage';

interface IProps {
  setCloseModal: (value: boolean) => void; // Function to close the modal passed as prop
}

const ClientsForm = observer(({ setCloseModal }: IProps) => {
  const { store, api } = useAppContext(); // Accessing MobX store and API context
  const [nameErrorMessage, setNameErrorMessage] = useState<string>(""); // State for name input error message
  const [client, setClient] = useState<IClient>({
    ...defaultClient,
    name: ""
  });

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setNameErrorMessage(""); // Clear previous error message
    const validationError = validateClientName(client); // Validate client name
    if (validationError) {
      setNameErrorMessage(validationError); // Set validation error message
      setClient({
        ...defaultClient,
        name: ""
      });
      return; // Exit early if validation fails
    }

    const $client: IClient = {
      id: 0,
      name: client.name,
      clientCode: ''
    };

    try {
      await api.client.create($client); // Call API to create client
      window.location.reload() // temporary UI fix
      onClose(); // Close the modal after successful submission
    } catch (error) {
      // Handle error (e.g., display error message)
    }
  };

  // Function to handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: value
    }));
  };

  // Function to close the modal
  const onClose = () => {
    setClient({ ...defaultClient }); // Reset client state
    store.client.clearSelected(); // Clear selected client in MobX store
    setCloseModal(false); // Close the modal by setting the state
  };

  // Effect to update client state when selected client changes in MobX store
  useEffect(() => {
    if (store.client.selected) {
      setClient(store.client.selected);
    }
  }, [store.client.selected]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {nameErrorMessage && <ErrorMessage errorMessage={nameErrorMessage} />} {/* Display error message if present */}
          <label htmlFor="name">Name:</label>
          <input
            className="uk-input"
            type="text"
            id="name"
            name="name"
            value={client.name}
            placeholder="Enter client name" // Placeholder text for input
            onChange={handleChange} // Handle input change
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Client
        </button>
      </form>
    </div>
  );
});

export default ClientsForm;
