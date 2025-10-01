import React from 'react';
import {View,StyleSheet} from 'react-native';
import{Text,Button,Card} from 'react-native-paper';
export default function LockerScreen(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Locker Details</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <Text>Package #1</Text>
                    <Text>Status: Ready for pickup</Text>
                </Card.Content>
                <Card.Actions>
                    <Button>Mark as Collected</Button>
                </Card.Actions>
            </Card>
            <Card style={styles.card}>
            <Card.Content>
                <Text>Package #2</Text>
                <Text>Status: Ready for pickup</Text>
            </Card.Content>
            <Card.Actions>
                <Button>Mark as collected</Button>
            </Card.Actions>
            </Card>
        </View>
    );
}
const styles=StyleSheet.create({
    container:{flex:1,padding:20},
    title:{fontSize:24,marginBottom:20, textAlign:'center'},
    card:{marginBottom:15},
});