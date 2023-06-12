import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import analytics from '@react-native-firebase/analytics'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signUpStep: 0,
			errorScreen: false,
			companyName: '',
			companyCode: '',
			errorMessage: ''
		};
		this.person = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        }
        this.lastNameRef = React.createRef()
		this.emailRef = React.createRef()
        this.passwordRef = React.createRef()
	}

	FindCompanyOrganization = (nameToSearch) => {
		firestore().collection('companies').where('name', '==', nameToSearch).get().then(
			companySnapshot => {
				if (companySnapshot.docs.length > 0) {
					this.setState({ companyName: companySnapshot.docs[0].data().name, signUpStep: 1 })
				} else {
					this.setState({
						errorMessage: 'We couldnt find that company or organization. Please try again or contact your companys point of contact.',
						errorScreen: true,
						signUpStep: -1
					})
				}
			}
		)
	}

	MatchCode = (enteredCode) => {
		firestore().collection('companies').where('code', '==', enteredCode).get().then(
			companySnapshot => {
				if (companySnapshot.docs.length > 0) {
					this.setState({ signUpStep: 2 })
				} else {
					this.setState({ 
						errorMessage: 'Those codes didnt match. Please try again or contact your companys point of contact.',
						errorScreen: true,
						signUpStep: -2
					})
				}
			}
		)
	}

	CreateAccount = async () => {
		try {
			const firebaseUserCredential = await auth().createUserWithEmailAndPassword(
				this.person.email, this.person.password
			).then(() => {
				firestore().collection('users').doc(`${this.person.lastName}, ${this.person.firstName}`).get().then((documentSnapshot) => {
					if (!documentSnapshot.exists) {
						firestore().collection('users').doc(`${this.person.lastName}, ${this.person.firstName}`).set({
							firstName: this.person.firstName,
							lastName: this.person.lastName,
							email: this.person.email,
							company: this.state.companyName,
							picture: 'https://connect-app-images.s3.amazonaws.com/PlaceholderProfile.png',
							pointOfContact: false,
							items: [],
							connections: [],
							accountCreated: firestore.Timestamp.now(),
							qrCodesSent: 0,
							cardBgColor: '#FBFEF9',
							cardTextColor: '#000428',
							cardTopText: `${this.person.firstName} ${this.person.lastName}`,
							cardMiddleText: `[POSITION] at ${this.state.companyName}`,
							cardBottomText: `${this.person.email}`
						})
					}
				})
			})

			AsyncStorage.setItem('First Name', this.person.firstName)
			AsyncStorage.setItem('Last Name', this.person.lastName)
			AsyncStorage.setItem('Email', this.person.email)
			AsyncStorage.setItem('Company', this.state.companyName)
	
			if (firebaseUserCredential !== null && firebaseUserCredential !== undefined) {
				this.props.navigation.navigate('Main Area')
				console.log(firebaseUserCredential)
				analytics().logSignUp({method: `${this.person.firstName} ${this.person.lastName} joined ${this.state.companyName}`})
			}
		} catch(e) {
			this.props.navigation.navigate('Sign Up')
			Alert.alert('There was an error with signing up', `Please try again. If errors continue, please send a message to support@drivense.com.`)
		}
	}

	render() {
		const {
			signUpStep,
			companyName,
			errorScreen,
			errorMessage,
			companyCode
		} = this.state

		if (signUpStep === 0 && errorScreen === false) {
			return (
				<View style={styles.container}>
					<Text style={styles.text}>
						Before we start, please enter the name of your company or organization.
					</Text>
					<TextInput
						placeholder={"Example: Drivense"}
						placeholderTextColor={'gray'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'done'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.setState({ companyName: text })
							}
						}}
					/>
					<Pressable
						style={styles.button}
						onPress={() => {
							this.FindCompanyOrganization(companyName)
						}}
					>
						<Text style={styles.buttonText}>
							Get Started
						</Text>
					</Pressable>
				</View>
			);
		} else if (signUpStep === 1 && errorScreen === false) {
			return (
				<View style={styles.container}>
					<Text style={styles.text}>
						We found {companyName}! {'\n'}
						Please enter the company code
					</Text>
					<TextInput
						placeholder={"Code"}
						placeholderTextColor={'gray'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'done'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.setState({ companyCode: text })
							}
						}}
					/>
					<Pressable
						style={styles.button}
						onPress={() => this.MatchCode(companyCode)}
					>
						<Text style={styles.buttonText}>
							Match Codes
						</Text>
					</Pressable>
				</View>
			)
		} else if (signUpStep === 2 && errorScreen === false) {
			return (
				<View style={styles.container}>
					<Text style={styles.buttonText}>
						Please create your account!
					</Text>

					<TextInput
						placeholder={'First Name'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.firstName = input.nativeEvent.text
								this.lastNameRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.lastNameRef}					
						placeholder={'Last Name'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.lastName = input.nativeEvent.text
								this.emailRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.emailRef}
						placeholder={'Email'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.email = input.nativeEvent.text
								this.passwordRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.passwordRef}
						placeholder={'Password'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						secureTextEntry={true}
						keyboardType={'default'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.password = input.nativeEvent.text
							}
						}}
					/>
					<Pressable
						style={styles.button}
						onPress={() => {
							this.CreateAccount()
						}} >
						<Text style={styles.buttonText}>
							Start Connecting! <FontAwesome name={"angle-right"} size={20} color={'#FBFEF9'} />
						</Text>
					</Pressable>
				</View>
			)
		} else if (signUpStep === 3 && errorScreen === false) {
			return (
				<View style={styles.container}>
					<Text style={styles.buttonText}>
						Please create your account
					</Text>

					<TextInput
						placeholder={'First Name'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.firstName = input.nativeEvent.text
								this.lastNameRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.lastNameRef}					
						placeholder={'Last Name'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.lastName = input.nativeEvent.text
								this.emailRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.emailRef}
						placeholder={'Email'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						keyboardType={'default'}
						returnKeyType={'next'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.email = input.nativeEvent.text
								this.passwordRef.current.focus()
							}
						}}
					/>
					<TextInput
						ref={this.passwordRef}
						placeholder={'Password'}
						placeholderTextColor={'#000428'}
						style={styles.input}
						secureTextEntry={true}
						keyboardType={'default'}
						onEndEditing={(input) => {
							const text = input.nativeEvent.text
							if (text != '' && text != null && text != undefined) {
								this.person.password = input.nativeEvent.text
							}
						}}
					/>
					<Pressable
						style={styles.button}
						onPress={() => {
							this.CreateAccount()
						}} >
						<Text style={styles.buttonText}>
							Start Connecting! <FontAwesome name={"angle-right"} size={20} color={'#FBFEF9'} />
						</Text>
					</Pressable>
				</View>
			)
		}

		else if (signUpStep === -1 && errorScreen === true) {
			return (
				<View style={styles.container}>
					<Text style={styles.text}>
						{errorMessage}
					</Text>

					<Pressable
						style={styles.button}
						onPress={() => this.setState({
							signUpStep: 0,
							errorMessage: '',
							errorScreen: false
						})}
					>
						<Text style={styles.buttonText}>
							<FontAwesome name={'rotate-right'} size={20} color={'#FBFEF9'} /> Try Again
						</Text>
					</Pressable>
				</View>
			)
		}
		else if (signUpStep === -2 && errorScreen === true) {
			return (
				<View style={styles.container}>
					<Text style={styles.text}>
						{errorMessage}
					</Text>

					<Pressable
						style={styles.button}
						onPress={() => this.setState({
							signUpStep: 1,
							errorMessage: '',
							errorScreen: false
						})}
					>
						<Text style={styles.buttonText}>
							<FontAwesome name={'rotate-right'} size={20} color={'#FBFEF9'} /> Try Again
						</Text>
					</Pressable>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
    button: {
        width: '50%',
        borderColor: '#FBFEF9',
        borderWidth: 2,
        padding: '2%',
        marginTop: '5%'
    },
    buttonText: {
        color: '#FBFEF9',
        fontSize: 18,
        textAlign: 'center',
		fontWeight: '600',
    },
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: '#000428',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
        width: '75%',
        backgroundColor: '#FBFEF9',
        marginTop: '5%',
        padding: '5%',
		fontWeight: '800',
    },
	text: {
        fontSize: 18,
		fontWeight: '800',
        color: '#FBFEF9',
        textAlign: 'center',
        padding: '2%'
    }
});