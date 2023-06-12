import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Modal, Linking } from 'react-native';
import auth from '@react-native-firebase/auth'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Mailer from 'react-native-mail'
import firestore from '@react-native-firebase/firestore'

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			AccountModal: false,
			NotificationsModal: false,
			PrivacySecurityModal: false,
			FAQModal: false,
			email: '',
			firstName: '',
			lastName: ''
		};
	}

	componentDidMount = async() => {
		await AsyncStorage.getItem('Email').then(value => this.setState({ email: value }))
		await AsyncStorage.getItem('First Name').then(value => this.setState({ firstName: value }))
		await AsyncStorage.getItem('Last Name').then(value => this.setState({ lastName: value }))
	}

	SignOut = () => {
		auth().signOut().then(() => this.props.navigation.navigate('Welcome')).then(Alert.alert('You have been signed out.'))
	}

	HandleEmail = () => {
		Mailer.mail({
			subject: `Support request from ${this.state.firstName}`,
			recipients: ['support@drivense.com'],
			body: `<p>[What can we help you with?]</p>`,
			isHTML: true
		}, (error, event) => {
			Alert.alert(error, event)
		})
    }

	DeleteAccount = () => {
		Alert.alert('Are you sure', 'Confirm that you want to delete your account. This will remove all data you have with us.', [
			{
				text: 'Confirm',
				onPress: () => {
					firestore().collection('users').doc(`${this.state.lastName}, ${this.state.firstName}`).delete()
					.then(() => auth().currentUser.delete()
					.then(() => {
						AsyncStorage.clear()
						this.props.navigation.navigate('Welcome')
						Alert.alert('Your account has been deleted.')
					}))
				},
				style: 'cancel'
			},
			{
				text: 'Cancel',
				onPress: () => this.props.navigation.navigate('Home'),
				style: 'destructive'
			}
		])
	}

	render() {
		const {
			AccountModal,
			NotificationsModal,
			PrivacySecurityModal,
			FAQModal,
			email
		} = this.state

		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 20, color: '#000428', fontWeight: '800', textAlign: 'center' }}>Settings</Text>
				{/* <Pressable
					onPress={() => Linking.openURL(`https://www.drivense.com/profile?name=${this.state.user.lastName}-${this.state.user.firstName}&preview=true`)}
					style={styles.button}>
					<MaterialCommunityIcons name={'account'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Preview</Text>
				</Pressable> */}
				<Pressable
					onPress={() => this.setState({ AccountModal: true })}
					style={styles.button}>
					<MaterialCommunityIcons name={'account'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Account</Text>
				</Pressable>
				<Pressable
					onPress={() => this.HandleEmail()}
					style={styles.button}>
					<MaterialCommunityIcons name={'email'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Contact Us</Text>
				</Pressable>
				<Pressable
					onPress={() => this.setState({ NotificationsModal: true })}
					style={styles.button}>
					<Ionicons name={'notifications'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Notifications</Text>
				</Pressable>
				<Pressable
					onPress={() => this.setState({ PrivacySecurityModal: true })}
					style={styles.button}>
					<MaterialCommunityIcons name={'security'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Security and Privacy</Text>
				</Pressable>
				{/* <Pressable
					onPress={() => this.setState({ FAQModal: true })}
					style={styles.button}>
					<FontAwesome name={'question-circle'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>FAQ</Text>
				</Pressable> */}
				<Pressable
					onPress={() => Linking.openURL('https://www.drivense.com/terms-and-conditions')}
					style={styles.button}>
					<Foundation name={'page-doc'} size={30} color={'#000428'} style={styles.icon} />						
					<Text style={styles.buttonText}>Terms and Conditions</Text>
				</Pressable>
				<Pressable
					onPress={() => Linking.openURL('https://www.drivense.com/privacy-policy')}
					style={styles.button}>
					<Foundation name={'page-doc'} size={30} color={'#000428'} style={styles.icon} />						
					<Text style={styles.buttonText}>Privacy Policy</Text>
				</Pressable>
				<Pressable
					onPress={() => this.DeleteAccount()}
					style={styles.button}>
					<MaterialCommunityIcons name={'delete'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Delete Account</Text>
				</Pressable>
				<Pressable
					onPress={() => this.SignOut()}
					style={styles.button}>
					<MaterialCommunityIcons name={'exit-run'} size={30} color={'#000428'} style={styles.icon} />
					<Text style={styles.buttonText}>Sign Out</Text>
				</Pressable>

				<Modal
					visible={AccountModal}
					transparent={true}
					animationType={'fade'}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2%' }}>
								<Text style={styles.modalText}>Email used with this accont: {email}</Text>
								{/* <Text style={styles.modalText}>Subscription Plan: You are using our free tiered plan</Text> */}
								<Text style={styles.modalText}>
									As we grow and deploy more updates, information about your account will be available here for your convenience.
								</Text>
							</View>

							<View style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<Pressable
									style={styles.modalButton}
									onPress={() => this.setState({ AccountModal: false })}>
									<Text style={styles.modalButtonText}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					visible={NotificationsModal}
					transparent={true}
					animationType={'fade'}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={styles.modalText}>
									As we grow and deploy more updates, you will be able to control how and how often you get notifications here.
								</Text>
							</View>

							<View style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<Pressable
									style={styles.modalButton}
									onPress={() => this.setState({ NotificationsModal: false })}>
									<Text style={styles.modalButtonText}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					visible={PrivacySecurityModal}
					transparent={true}
					animationType={'fade'}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={styles.modalText}>
									As we grow and deploy more updates, you will be able to control your security and privacy settings here.
								</Text>
							</View>

							<View style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<Pressable
									style={styles.modalButton}
									onPress={() => this.setState({ PrivacySecurityModal: false })}>
									<Text style={styles.modalButtonText}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				{/* <Modal
					visible={FAQModal}
					transparent={true}
					animationType={'fade'}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={styles.modalText}>
									Q:
									A:
								</Text>
							</View>

							<View style={{ width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<Pressable
									style={styles.modalButton}
									onPress={() => this.setState({ FAQModal: false })}>
									<Text style={styles.modalButtonText}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal> */}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		width: '75%',
		borderColor: '#000428',
		borderWidth: 2,
		padding: '2%',
		marginTop: '2%'
	},
	buttonText: {
		color: '#000428',
		fontSize: 18,
		fontWeight: '800',
		textAlign: 'center'
	},
	container: {
		width: '100%',
		height: '100%',
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FBFEF9'
	},
	icon: {
		position: 'absolute',
		top: '25%'
	},
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
})

export default Settings;
