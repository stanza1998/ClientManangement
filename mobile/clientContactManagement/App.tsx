import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './views/loggedOut/Login';
import MainView from './views/loggedIn/MainView';

export default function App() {
  return (
    <View style={styles.container}>

      <MainView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
