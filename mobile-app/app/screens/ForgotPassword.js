import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
            enteredEmail: '',
            userEmail: '',
            emailSent: false
		};
	}

    componentDidMount = async () => {
        await AsyncStorage.getItem('Email').then(value => this.setState({ userEmail: value }))
    }

    SendEmail = async () => {
        if (this.state.userEmail == this.state.enteredEmail) {
            await auth().sendPasswordResetEmail(this.state.enteredEmail, {
                
            })
        } else if (this.state.userEmail != this.state.enteredEmail) {
            Alert.alert('Incorrect email', "The email you entered doesn't match the one connected to your account. Please try again.")
        }
    }

	render() {
		return (
			<View style={styles.container}>
                <LinearGradient
                    style={styles.linearGradientBg}
                    colors={['#000428', '#004E92']}
                    start={{ x: 0.0, y: 0.50}}
                    end={{ x: 0.50, y: 1.00 }}>
                </LinearGradient>
                <Text style={(this.state.emailSent == false) ? {
                    fontWeight: '600',
                    fontSize: 18,
                    color: '#FBFEF9',
                    padding: '5%',
                    textAlign: 'center'
                } : { display: 'none' } }>
                    Enter your email and we will send you a link to reset your password.
                </Text>
                <Text style={(this.state.emailSent == true) ? {
                    fontWeight: '600',
                    fontSize: 18,
                    color: '#FBFEF9',
                    padding: '5%',
                    textAlign: 'center'
                } : { display: 'none' } }>
                    An email with instructions on resetting your password has been sent.
                    Make sure to check your spam if you can't find it.
                </Text>
				<TextInput
                    style={(this.state.emailSent == false) ? styles.input : { display: 'none' }}
                    placeholder={'Email for your account'}
                    placeholderTextColor={'#000428'}
                    keyboardType={'email-address'}
                    onEndEditing={(input) => {
                        this.setState({ enteredEmail: input.nativeEvent.text })
                    }}
                />
                <Pressable
                    style={(this.state.emailSent == false) ? styles.button : { display: 'none' }}
                    onPress={() => this.SendEmail()}>
                    <Text style={styles.buttonText}>
                        <FontAwesome name={"refresh"} size={20} color={'#FBFEF9'} /> Reset
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Log In')}>
                    <Text style={styles.buttonText}>
                        <FontAwesome name={"caret-left"} size={20} color={'#FBFEF9'} /> Go Back
                    </Text>
                </Pressable>
			</View>
		)
	}
}

const styles = StyleSheet.create({
    button: {
        width: '40%',
        padding: '2%',
        marginTop: '5%',
        borderColor: '#FBFEF9',
        borderWidth: 2
    },
    buttonText: {
        color: '#FBFEF9',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600'
    },
	container: {
        width: '100%',
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linearGradientBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
    },
	input: {
        width: '75%',
        backgroundColor: '#FBFEF9',
        marginTop: '5%',
        padding: '5%',
        fontWeight: '600',
        fontSize: 16
    }
})