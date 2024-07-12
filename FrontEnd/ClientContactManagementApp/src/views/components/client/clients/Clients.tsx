import { observer } from 'mobx-react-lite';
import './Clients.css';
import { IClient } from '../../../../EndPoints/models/Client';
import { useEffect, useState } from 'react';
import Modal from '../../../../shared-components/Modal';
import ClientsForm from '../client-form/ClientsForm';
import { useAppContext } from '../../../../context/Context';
import NoDataMessage from '../../../../shared-components/NoDataMessage';
import LinkClientContactForm from '../link-client-contact-form/LinkClientContactForm';
import { getAllLinkedData } from '../../../../helper-functions/GetAllLinkedData';
import ViewClientContactForm from '../client-contact-link-component/ViewClientContactForm';
import { getNumberOfContacts } from './GetNumberOfContacts';
import Toolbar from '../../../../shared-components/ToolBar';


interface IProps {
  clients: IClient[];
}

const Clients = observer(({ clients }: IProps) => {
  const { store, api } = useAppContext();
  const [contactCounts, setContactCounts] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenView, setIsModalOpenView] = useState(false);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    store.client.clearSelected();
  };

  const openCreateModalView = () => {
    setIsModalOpenView(true);
  };

  const closeCreateModalView = () => {
    setIsModalOpenView(false);
    store.client.clearSelected();
  };

  const onCreate = () => {
    openCreateModal();
  }

  const onViewContact = (client: IClient) => {
    store.client.select(client);
    openCreateModalView();
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
    async function fetchAllContactLengths() {
      const counts: any = {};
      for (const client of clients) {
        counts[client.id] = await getNumberOfContacts(client.id);
      }
      setContactCounts(counts);
    }

    fetchAllContactLengths();
  }, [clients]);



  

  const leftItems = [<div key="1">List Of Clients</div>];
  const centerItems = [<div></div>];
  const rightItems = [<div key="1">
    <button className="btn btn-primary" onClick={onCreate}>Create</button>
  </div>];



  return (

    <div className="clients-container">
      <div style={{ marginBottom: "20px" }}>
        <Toolbar leftItems={leftItems} centerItems={centerItems} rightItems={rightItems} />
      </div>




      {clients.length === 0 && <NoDataMessage message={'No client(s) found'} />}

      {clients.length > 0 &&
        <table className="clients-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Client Code</th>
              <th style={{ textAlign: "center" }}># Linked contacts</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                {/* <td>{client.id}</td> */}
                <td>{client.name}</td>
                <td>{client.clientCode}</td>
                <td style={{ textAlign: "center" }}>
                  {contactCounts[client.id] !== undefined ? contactCounts[client.id] : 'Loading...'}
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => onViewContact(client)}>Details</button>
                  <button className="btn btn-danger" onClick={() => onDelete(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2>Create Client</h2>
        <ClientsForm setCloseModal={setIsModalOpen} />
        <button className="btn btn-danger" onClick={closeCreateModal}>Close Modal</button>
      </Modal>
      <Modal isOpen={isModalOpenView} onClose={closeCreateModalView}>
        <h2>Client View</h2>
        <ViewClientContactForm setCloseModal={setIsModalOpenView} />
        <button className="btn btn-danger" onClick={closeCreateModalView}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Clients;
