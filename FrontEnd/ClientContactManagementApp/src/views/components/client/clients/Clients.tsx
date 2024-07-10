import { observer } from 'mobx-react-lite';
import './Clients.css';
import { IClient } from '../../../../EndPoints/models/Client';
import { useEffect, useState } from 'react';
import Modal from '../../../../shared-components/Modal';
import ClientsForm from '../client-form/ClientsForm';
import { useAppContext } from '../../../../context/Context';
import NoDataMessage from '../../../../shared-components/NoDataMessage';
import LinkClientContactForm from '../Link-client-contact-form/LinkClientContactForm';
import { getAllLinkedData } from '../../../../helper-functions/GetAllLinkedData';


interface IProps {
  clients: IClient[];
}

const Clients = observer(({ clients }: IProps) => {
  const { store, api } = useAppContext();




  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLink, setIsModalOpenLink] = useState(false);
  const [isModalOpenView, setIsModalOpenView] = useState(false);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
  };
  const openCreateModalLink = () => {
    setIsModalOpenLink(true);
  };

  const closeCreateModalLink = () => {
    setIsModalOpenLink(false);
  };

  const onCreate = () => {
    openCreateModal();
  }
  const onLinkContact = (client: IClient) => {
    store.client.select(client);
    openCreateModalLink();
  }


  const onDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this client?");

    if (isConfirmed) {
      try {
        await api.client.delete(id);
        await api.client.getAll();

      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };



  useEffect(() => {
    const loadData = async () => {
      const linkedData = await getAllLinkedData(clients);
      console.log("🚀 ~ loadData ~ linkedData:", linkedData)

    }
    loadData()
  })


  return (

    <div className="clients-container">
      <div>
        <h4>List Of Clients</h4>
        <button onClick={onCreate}>Create</button>
      </div>

      {clients.length === 0 && <NoDataMessage message={'No client(s) found'} />}

      {clients.length > 0 &&
        <table className="clients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Client Code</th>
              <th style={{ textAlign: "center" }}># Linked contacts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.clientCode}</td>
                <td style={{ textAlign: "center" }}>34</td>
                <td>
                  {/* <button onClick={() => onEdit(client)} >Edit</button> */}
                  <button >View linked to contact</button>
                  <button onClick={() => onLinkContact(client)}>link to contact</button>
                  <button onClick={() => onDelete(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2>Create Client</h2>
        <ClientsForm setCloseModal={setIsModalOpen} />
        <button onClick={closeCreateModal}>Close Modal</button>
      </Modal>
      <Modal isOpen={isModalOpenLink} onClose={closeCreateModalLink}>
        <h2>Create Client</h2>
        <LinkClientContactForm setCloseModal={setIsModalOpenLink} />
        <button onClick={closeCreateModalLink}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Clients;
