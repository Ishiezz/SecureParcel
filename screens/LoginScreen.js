import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Text,Button,TextInput} from 'react-native-paper';

export default function LoginScreen({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>SecureParcel Login</Text>
            <TextInput label="Email" style={styles.input}/>
            <TextInput label="Password" secureTextEntry style={styles.input}/>
            <Button mode="contained" onPress={()=>navigation.replace('Home')}>Login</Button>
        </View>
    );
}
const styles=StyleSheet.create({
    container:{flex:1,justifyContent:'center',padding:20},
    title:{fontSize:24, marginBottom:20,textAlign:'center'},
    input:{marginBottom:15},
});