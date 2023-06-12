import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet, Text, Pressable } from 'react-native'

import WelcomeScreen from './app/screens/Welcome'
import HomeScreen from './app/screens/Home'
import Connections from './app/screens/Connections';
import ConnectCard from './app/screens/ConnectCard';
import LogIn from './app/screens/LogIn';
import SignUp from './app/screens/SignUp';
import Settings from './app/screens/Settings';
import ForgotPassword from './app/screens/ForgotPassword';
import Connect from './app/screens/Connect'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import IonIcons from 'react-native-vector-icons/Ionicons'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MockComponent = () => <View style={{ flex: 1, width: '100%', height: '100%' }}></View>

class TabNav extends React.Component {
	render() {
		return (
			<Tab.Navigator
				initialRouteName={'Home'}
				screenOptions={{
					tabBarActiveBackgroundColor: '#0049E2',
					tabBarInactiveBackgroundColor: '#000428',
					tabBarLabelStyle: { fontFamily: 'Monsterrat-SemiBold', fontSize: 12, color: '#FBFEF9' },
					headerShown: false
				}}
			>
				<Tab.Screen
					name={'Home'}
					component={HomeScreen}
					options={{
						tabBarIcon: () => {
							return (
								<FontAwesome name={'home'} size={30} color={'#FBFEF9'} />
							)
						}
					}}
				/>
				<Tab.Screen
					name={'Connections'}
					component={Connections}
					options={{
						tabBarIcon: () => {
							return (
								<FontAwesome name={'group'} size={30} color={'#FBFEF9'} />
							)
						}
					}}
				/>				
				<Tab.Screen
					name={'Connect'}
					component={MockComponent}
					options={{
						tabBarIcon: () => {
							return (
								<View
									style={{
										position: 'absolute',
										bottom: 1,
										height: 75,
										width: 75,
										borderRadius: 50,
										backgroundColor: "#000428",
										borderColor: "#FBFEF9",
										borderWidth: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<View
										style={{
											height: 50,
											width: 50,
											borderRadius: 58,
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: "#000428",
										}}>
										<IonIcons name={'person-add'} size={30} color={'#FBFEF9'} />										
									</View>
								</View>
							)
						}
					}}
					listeners={({ navigation }) => ({
						tabPress: (e) => {
							e.preventDefault()
							navigation.navigate('ConnectModal')
						}
					})}
				/>
				<Tab.Screen
					name={'Card'}
					component={ConnectCard}
					options={{
						tabBarIcon: () => {
							return (
								<FontAwesome name={'id-card-o'} size={30} color={'#FBFEF9'} />
							)
						}
					}}
				/>
				<Tab.Screen
					name={'Settings'}
					component={Settings}
					options={{
						tabBarIcon: () => {
							return (
								<FontAwesome name={'gear'} size={30} color={'#FBFEF9'} />
							)
						}
					}}
				/>
			</Tab.Navigator>
		)
	}
}

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={'Welcome'}
				screenOptions={{
					headerShown: false
				}}
			>
				<Stack.Screen
					name={'Welcome'}
					component={WelcomeScreen}
				/>
				<Stack.Screen
					name={'Main Area'}
					component={TabNav}
				/>
				<Stack.Screen
					name={'Log In'}
					component={LogIn}
				/>
				<Stack.Screen
					name={'Sign Up'}
					component={SignUp}
				/>
				<Stack.Screen
					name={'Forgot Password'}
					component={ForgotPassword}
				/>
				<Stack.Screen
					name={'ConnectModal'}
					component={Connect}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function ModalScreen({ navigation }) {
	return (
		<View style={styles.centeredView}>
			<View style={styles.modalView}>
				<Text style={styles.modalText}>This is a modal!</Text>
				<Pressable style={styles.modalButton} onPress={() => navigation.goBack()} >
					<Text style={styles.modalButtonText}>Go Back</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
	modalButton: {
        width: '50%',
        padding: '2%',
        borderColor: '#000428',
        borderWidth: 2
    },
    modalButtonText: {
		fontWeight: '800',
        textAlign: 'center',
        color: '#000428',
        fontSize: 18
    },
    modalText: {
		fontWeight: '600',
        fontSize: 12,
        marginTop: '2%',
        color: '#000428'
    },
	modalView: {
        width: '90%',
        height: '60%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#FBFEF9',
        borderRadius: 20,
        elevation: 10,
    },
});