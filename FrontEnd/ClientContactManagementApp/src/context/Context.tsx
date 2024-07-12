import { createContext, useContext } from "react";
import AppStore from "../EndPoints/stores/AppStore";
import AppApi from "../EndPoints/apis/AppApi";

// Context to contain device width
export const DeviceWidthContext = createContext(0); // Consider updating this to manage device width

interface AppContextType {
    store: AppStore;
    api: AppApi;
}

// Custom hook to access AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context as AppContextType;
};

// AppContext initialized with null or AppContextType
export const AppContext = createContext<null | AppContextType>(null);
