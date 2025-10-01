import  React from 'react';
// import { Provider as PaperProvider} from 'react-native-paper';
// import AppNavigator from './navigation/AppNavigator';
import {View,Text,styleSheet} from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SecureParcel is getting started</Text>
    </View>
   
  );
}
const styles=StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center'},
  text:{fontSize:24, fontWeight:'bold'},

});