import React, { useEffect, useState } from 'react';
import './ClientsForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';


interface IProps {
  setCloseModal: (value: boolean) => void;
}

const ClientsForm = observer(({ setCloseModal }: IProps) => {
  const { store, api } = useAppContext();
  const [client, setClient] = useState<IClient>({
    ...defaultClient,
    name: ""
 });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const $client: IClient = {
      id: 0,
      name: client.name,
      clientCode: ""
    }

    try {
      await api.client.create($client);
      await api.client.getAll();
      onClose();
    } catch (error) {


    }

  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: value
    }));
  };

  const onClose = () => {
    setClient({ ...defaultClient })
    store.client.clearSelected;
    setCloseModal(false)
  }

  useEffect(() => {
    if (store.client.selected) {
      setClient(store.client.selected);
    } else {

    }
  }, [store.client.selected])

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            className="input"
            type="text"
            id="name"
            name="name"
            value={client.name}
            placeholder="Enter client name" // Add a placeholder
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          Create Client
        </button>
      </form>
    </div>
  );
});

export default ClientsForm;
