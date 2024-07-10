import { observer } from "mobx-react-lite";
import { useAppContext } from "../context/Context";
import { useEffect } from "react";
import TabComponent from "../shared-components/Tab";
import Clients from "./components/client/clients/Clients";
import Contacts from "./components/contact/Contacts";
import ClientContact from "./components/client-contact/ClientContacts";

export const MainView = observer(() => {
    const { store, api } = useAppContext();

    const clients = store.client.all.map((c) => { return c.asJson })
    const contacts = store.contact.all.map((c) => { return c.asJson })

    const tabs = [
        { label: 'Clients', content: <Clients clients={clients} /> },
        { label: 'Contacts', content: <Contacts contacts={contacts} /> },
        { label: 'Client-Contacts', content: <ClientContact /> },
    ];



    useEffect(() => {
        const LoadData = async () => {
            await Promise.all([
                api.client.getAll(),
                api.contact.getAll()
            ])
        }
        LoadData();
    }, [])


    return (
        <div>
            <TabComponent tabs={tabs} />
        </div>
    )
})