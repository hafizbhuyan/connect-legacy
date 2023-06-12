import React, { Component } from 'react'
import { Text, StyleSheet, View, Pressable, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import analytics from '@react-native-firebase/analytics'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SplashScreen from './SplashScreen'

export default class LogIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            dataLoaded: false
        }
        this.passwordRef = React.createRef()
    }

    componentDidMount = async () => {
        await AsyncStorage.getItem('First Name').then(nameValue => {
            if (nameValue) {
                this.setState({ name: nameValue })
            }
        })
        this.setState({ dataLoaded: true })
    }

    EmailLogin = async () => {
        try {
            const firebaseUserCredential = await auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Wrong email', "That email doesn't match our records, please try again.");
                    this.props.navigation.navigate('Log In')
                }
                if (error.code === 'auth/invalid-password') {
                    Alert.alert('Wrong password', "That password doesn't match our records, please try again.")
                    this.props.navigation.navigate('Log In')
                }
            })

            if (firebaseUserCredential != null && firebaseUserCredential != undefined) {
                this.props.navigation.navigate('Main Area')
                analytics().logLogin({ method: `Email Login by ${this.state.name}` })
            }
        } catch (e) {
            this.props.navigation.navigate('Log In')
            if (e == 'Error: [auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.') {
                Alert.alert('Login Error', "The email or password you entered didn't match our records, please try again.")
            }
            console.log(e)
        }
    }

    SaveToLocalStorage = async () => {
        await firestore().collection('users').where("email", "==", this.state.email).limit(1).get().then((documentSnapshot) => {
            documentSnapshot.docs.map(user => {
                AsyncStorage.setItem('First Name', user.data().firstName)
                AsyncStorage.setItem('Last Name', user.data().lastName)
                AsyncStorage.setItem('Email', user.data().email)
            })
        })
    }

    render() {
        if (this.state.dataLoaded == false) {
            return (
                <SplashScreen />
            )
        } else if (this.state.dataLoaded == true) {
            return (
                <View style={styles.container}>
                    <LinearGradient
                        style={styles.linearGradientBg}
                        colors={['#000428', '#004E92']}
                        start={{ x: 0.0, y: 0.50}}
                        end={{ x: 0.50, y: 1.00 }}>
                    </LinearGradient>
                    <Text style={{
                        fontSize: 20,
                        color: '#FBFEF9',
                        fontWeight: '800',
                        textAlign: 'center'
                    }}>
                        {(this.state.name) ? `Welcome back ${this.state.name}!` : `Welcome back!`}
                    </Text>
                    <TextInput
                        placeholder={'Email'}
                        placeholderTextColor={'#000428'}
                        style={styles.input}
                        keyboardType={'email-address'}
                        returnKeyType={'next'}
                        onEndEditing={(input) => {
                            const text = input.nativeEvent.text
                            if (text != '' && text != null && text != undefined) {
                                this.setState({ email: input.nativeEvent.text })
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
                                this.setState({ password: input.nativeEvent.text })
                            }
                        }}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            this.SaveToLocalStorage().then(() => this.EmailLogin())
                        }}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>

                    <Text style={(this.state.name != undefined || this.state.name != null) ? {
                        marginTop: '5%',
                        padding: '5%',
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#FBFEF9'
                    } : { display: 'none' } }>
                        Forgot your password or trouble logging in?
                    </Text>
                    <Pressable
                        style={(this.state.name != undefined || this.state.name != null) ? {
                            width: '50%',
                            padding: '2%',
                            marginBottom: '5%',
                            borderBottomColor: '#FBFEF9',
                            borderBottomWidth: 2
                        } : { display: 'none' } }
                        onPress={() => this.props.navigation.navigate('Forgot Password')}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Welcome')}>
                        <Text style={styles.buttonText}>
                            <FontAwesome name={"caret-left"} size={20} color={'#FBFEF9'} /> Go Back
                        </Text>
                    </Pressable>
                </View>
            )
        }
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
        fontWeight: '600',
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
        fontWeight: '800',
    }
})
