import { useEffect, useState } from 'react';
import './App.css'
import AppApi from './EndPoints/apis/AppApi';
import AppStore from './EndPoints/stores/AppStore';
import { AppContext } from './context/Context';
import { MainView } from './views/MainView';
import Loader from './shared-components/loaders/system-loaders/SystemLoader';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const store = new AppStore();
  const api = new AppApi(store);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // 6 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{ store, api }}>
      <div className='App'>
        {loading ? <Loader /> : <MainView />}
      </div>
    </AppContext.Provider>
  );
};

export default App
