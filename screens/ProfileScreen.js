import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Text,Button} from 'react-native-paper';

export default function ProfileScreen(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text>Name: Jane Doe</Text>
            <Text>Email: jane.doe@email.com</Text>
            <Button mode="contained" style={{marginTop:20}}>Logout</Button>
        </View>
    );
}
const styles=StyleSheet.create({
    container:{flex:1,justifyContent:'center',padding:20},
    title:{fontSize:24, marginBottom:20,textAlign:'center'},
    
});