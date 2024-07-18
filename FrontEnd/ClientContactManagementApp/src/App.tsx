import { useEffect, useState } from 'react';
import './App.css'
import AppApi from './EndPoints/apis/AppApi';
import AppStore from './EndPoints/stores/AppStore';
import { AppContext } from './context/Context';
import { MainView } from './views/MainView';
import { useAuth } from './context/AuthContext';
import LoginRegister from './logged-out/LoginRegister';

const App: React.FC = () => {
  const store = new AppStore();
  const api = new AppApi(store);
  const { isAuthenticated } = useAuth();
  console.log("🚀 ~ isAuthenticated:", isAuthenticated)


  return (
    <AppContext.Provider value={{ store, api }}>

      <div className='App'>

        {isAuthenticated ? <MainView /> : <LoginRegister />}
      </div>
    </AppContext.Provider>
  );
};

export default App
