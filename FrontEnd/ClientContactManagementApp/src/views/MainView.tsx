import { observer } from "mobx-react-lite";
import { useAppContext } from "../context/Context";
import { useEffect, useState } from "react";
import TabComponent from "../shared-components/tabs/Tab"; 
import Clients from "./components/client/clients/Clients"; 
import Contacts from "./components/contact/Contacts"; 
import Loader from "../shared-components/loaders/system-loaders/SystemLoader"; 

export const MainView = observer(() => {
    const { store, api } = useAppContext(); // Accessing MobX store and API context from custom hook
    const [loading, setLoading] = useState(false); // State to manage loading state
    const clients = store.client.all.map((c) => ({ ...c.asJson })); // Mapping clients from MobX store
    const contacts = store.contact.all.map((c) => ({ ...c.asJson })); // Mapping contacts from MobX store

    const tabs = [
        { label: 'Clients', content: <Clients clients={clients} /> }, // Clients tab with Clients component
        { label: 'Contacts', content: <Contacts contacts={contacts} /> }, // Contacts tab with Contacts component
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true); // Set loading state to true

            // Fetch data using API calls
            await Promise.all([
                api.client.getAll(), // Fetch all clients
                api.contact.getAll() // Fetch all contacts
            ]);

            setLoading(false); // Set loading state to false after data is fetched
        };

        loadData(); // Invoke the loadData function on component mount
    }, []);

    return (
        <>
            {loading && <Loader />} {/* Show Loader component while loading */}
            {!loading && <TabComponent tabs={tabs} />} {/* Show TabComponent with tabs once data is loaded */}
        </>
    );
});
