import './App.css'
import AppApi from './EndPoints/apis/AppApi';
import AppStore from './EndPoints/stores/AppStore';
import { AppContext } from './context/Context';
import { MainView } from './views/MainView';

const App = () => {
  const store = new AppStore();
  const api = new AppApi(store);

  return (
    <AppContext.Provider value={{ store, api }}>
      <div className='App'>
        <MainView />
      </div>
    </AppContext.Provider>
  )
}

export default App
