import React from 'react';
import {View,StyleSheet,ScrollView} from 'react-native';
import {Text,Card,Button} from 'react-native-paper';
export default function HomeScreen({navigation}){
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Welcome to SecureParcel</Text>
            <Card style={styles.card}>
                <Card.Title title="Locker #101" subtitle="2 Packages waiting"/>
                <Card.Content>
                    <Text>Last delivery: 2 hrs ago</Text>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={()=>navigation.navigate('Locker')}>Open Locker</Button>
                </Card.Actions>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Locker #102" subtitle="Empty"/>
                <Card.Content>
                    <Text>Last delivery:Yesterday</Text>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={()=>navigation.navigate('Locker')}>Open Locker</Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}