import { observer } from "mobx-react-lite";
import { useAppContext } from "../context/Context";
import { useEffect, useState } from "react";
import TabComponent from "../shared-components/Tab";
import Clients from "./components/client/clients/Clients";
import Contacts from "./components/contact/Contacts";
import Loader from "../shared-components/loaders/system-loaders/SystemLoader";

export const MainView = observer(() => {
    const { store, api } = useAppContext();
    const [loading, setLoader] = useState(false);
    const clients = store.client.all.map((c) => { return c.asJson })
    const contacts = store.contact.all.map((c) => { return c.asJson })

    const tabs = [
        { label: 'Clients', content: <Clients clients={clients} /> },
        { label: 'Contacts', content: <Contacts contacts={contacts} /> },
    ];



    useEffect(() => {
        const LoadData = async () => {
            setLoader(true);
            await Promise.all([
                api.client.getAll(),
                api.contact.getAll()
            ])
            setLoader(false);
        }
        LoadData();
    }, [])


    return (
        <>
            {loading && <Loader />}
            {!loading && <TabComponent tabs={tabs} />}
        </>
    )
})