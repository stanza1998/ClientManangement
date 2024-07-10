import { createContext, useContext } from "react";
import AppStore from "../EndPoints/stores/AppStore";
import AppApi from "../EndPoints/apis/AppApi";


// Context to contain device width
export const DeviceWidthContext = createContext(0);

interface AppContextType {
    store: AppStore;
    api: AppApi;
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContextType;
};

export const AppContext = createContext<null | AppContextType>(null);