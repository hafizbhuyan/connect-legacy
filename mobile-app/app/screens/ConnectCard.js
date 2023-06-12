import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert,  } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mailer from 'react-native-mail'

export default class ConnectCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userFirstName: '',
            userLastName: '',
            cardBgColor: '#FBFEF9',
            cardTextColor: '#000428',
            logo: 'https://connect-app-images.s3.amazonaws.com/DrivenseLogoNoBg.png',
            cardTextOne: '',
            cardTextTwo: '',
            cardTextThree: '',
        };
    }

    componentDidMount = async () => {
        let firstName = ''
        let lastName = ''

        await AsyncStorage.getItem('First Name').then(value => {
            this.setState({ userFirstName: value })
            firstName = value
        })
        await AsyncStorage.getItem('Last Name').then(value => {
            this.setState({ userLastName: value })
            lastName = value
        })

        await AsyncStorage.getItem('Card Background Color').then(async (value) => {
            if (!!value) {
                this.setState({ cardBgColor: value })
            } else {
                await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        this.setState({
                            cardBgColor: documentSnapshot.data().cardTopText
                        })
                    }
                })
            }
        })
        await AsyncStorage.getItem('Card Text Color').then(async (value) => {
            if (!!value) {
                this.setState({ cardTextColor: value })
            } else {
                await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        this.setState({
                            cardTextColor: documentSnapshot.data().cardTopText
                        })
                    }
                })
            }
        })
        await AsyncStorage.getItem('Card Top Text').then(async (value) => {
            if (!!value && value !== this.state.cardTextOne) {
                this.setState({ cardTextOne: value })
            } else {
                await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        this.setState({
                            cardTextOne: documentSnapshot.data().cardTopText
                        })
                    }
                })
            }
        })
        await AsyncStorage.getItem('Card Middle Text').then(async (value) => {
            if (!!value && value !== this.state.cardTextTwo) {
                this.setState({ cardTextTwo: value })
            } else {
                await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        this.setState({
                            cardTextTwo: documentSnapshot.data().cardMiddleText
                        })
                    }
                })
            }
        })
        await AsyncStorage.getItem('Card Bottom Text').then(async (value) => {
            if (!!value && value !== this.state.cardTextThree) {
                this.setState({ cardTextThree: value })
            } else {
                await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        this.setState({
                            cardTextThree: documentSnapshot.data().cardBottomText
                        })
                    }
                })
            }
        })
    }

    HandleEmail = () => {
		Mailer.mail({
			subject: `New card order from ${this.state.userFirstName}`,
			recipients: ['support@drivense.com'],
			body: `<p>${this.state.userFirstName} is requesting a new card with the following design.\n<img src='https://connect-app-images.s3.amazonaws.com/DrivenseLogoNoBg.png' /></p>`,
			isHTML: true
		}, (error, event) => {
			Alert.alert(error, event)
		})
    }

    render() {
        const {
            cardBgColor,
            cardTextColor,
            cardTextOne,
            cardTextTwo,
            cardTextThree,
            logo,
        } = this.state

        return (
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.text}>See your card!</Text>
                    <View 
                        style={[
                            styles.cardContainer,
                            { backgroundColor: cardBgColor }
                        ]}
                    >
                        <Image
                            source={{ uri: logo }}
                            resizeMode={'contain'}
                            style={{
                                width: '10%',
                                height: '10%',
                                left: '45%',
                                top: '5%'
                            }}
                        />
                        <Text style={[
                            styles.cardText,
                            { 
                                color: cardTextColor,
                                fontSize: 22
                            }
                        ]}>{cardTextOne}</Text>
                        <View
                            style={{
                                width: '75%',
                                height: '1%',
                                backgroundColor: cardTextColor,
                                display: 'flex'
                            }}
                        />
                        <Text style={[
                            styles.cardText,
                            { color: cardTextColor }
                        ]}>{cardTextTwo}</Text>
                        <Text style={[
                            styles.cardText,
                            { color: cardTextColor }
                        ]}>{cardTextThree}</Text>
                    </View>

                    <Text style={styles.text}>
                        We are only offering one layout right now.{'\n'}
                        But you can customize the text, background color and text color.{'\n'}
                        When you are done, take a screenshot, send it using the button below, and we will build and ship your new cards asap!
                    </Text>
                </View>

                <Text style={styles.text}>Style It</Text>
                <View style={styles.bottomSection}>
                    <TextInput
                        style={styles.input}
                        placeholder={`Replace top text`}
                        onEndEditing={async (input) => {
                            const text = input.nativeEvent.text

                            if (!!text) {
                                this.setState({ cardTextOne: text })
                                await firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).get().then(documentSnapshot => {
                                    if (documentSnapshot.exists) {
                                        firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).update({
                                            cardTopText: text
                                        })
                                    }
                                })
                                AsyncStorage.setItem('Card Top Text', text)
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={`Replace middle text`}
                        onEndEditing={async (input) => {
                            const text = input.nativeEvent.text

                            if (!!text) {
                                this.setState({ cardTextTwo: text })
                                await firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).get().then(documentSnapshot => {
                                    if (documentSnapshot.exists) {
                                        firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).update({
                                            cardMiddleText: text
                                        })
                                    }
                                })
                                AsyncStorage.setItem('Card Middle Text', text)
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={`Replace bottom text`}
                        onEndEditing={async (input) => {
                            const text = input.nativeEvent.text

                            if (!!text) {
                                this.setState({ cardTextThree: text })
                                await firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).get().then(documentSnapshot => {
                                    if (documentSnapshot.exists) {
                                        firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).update({
                                            cardBottomText: text
                                        })
                                    }
                                })
                                AsyncStorage.setItem('Card Bottom Text', text)
                            }
                        }}
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder={'Replace background color'}
                        onEndEditing={async (input) => {
                            const text = input.nativeEvent.text

                            if (text !== undefined && text !== "") {
                                this.setState({ cardBgColor: text })
                                await firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).get().then(documentSnapshot => {
                                    if (documentSnapshot.exists) {
                                        firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).update({
                                            cardBgColor: text
                                        })
                                    }
                                })
                                AsyncStorage.setItem('Card Background Color', text)
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'Replace card text color'}
                        onEndEditing={async (input) => {
                            const text = input.nativeEvent.text

                            if (text !== undefined && text !== "") {
                                this.setState({ cardTextColor: text })
                                await firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).get().then(documentSnapshot => {
                                    if (documentSnapshot.exists) {
                                        firestore().collection('users').doc(`${this.state.userLastName}, ${this.state.userFirstName}`).update({
                                            cardTextColor: text
                                        })
                                    }
                                })
                                AsyncStorage.setItem('Card Text Color', text)
                            }
                        }}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={() => this.HandleEmail()}
                    >
                        <Text style={styles.buttonText}>
                            Get It!
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
		width: '75%',
		borderColor: '#FBFEF9',
		borderWidth: 2,
		padding: '2%',
		marginTop: '2%'
	},
	buttonText: {
		color: '#FBFEF9',
		fontSize: 18,
		textAlign: 'center'
	},
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000428'
    },
    text: {
        fontSize: 12,
        color: '#FBFEF9',
        textAlign: 'center',
        padding: '2%'
    },
    topSection: {
        width: '100%',
        height: '45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        height: '55%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    input: {
        width: '45%',
        backgroundColor: '#FBFEF9',
        marginTop: '2%',
        paddingTop: '5%',
        paddingBottom: '5%',
        margin: '2%',
    },
    layoutImage: {
        width: '50%',
        height: '25%',
        marginBottom: '2%',
    },
    layoutText: {
        fontSize: 16,
        color: '#000428',
        textAlign: 'center'
    },

    // card styles
    cardContainer: {
        width: '75%',
        height: '50%',
        borderRadius: 20,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        margin: '2%'
    },

    // modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
	modalButton: {
        width: '50%',
        padding: '2%',
        borderColor: '#000428',
        borderWidth: 2,
        marginTop: '5%'
    },
    modalButtonText: {
        textAlign: 'center',
        color: '#000428',
        fontSize: 18
    },
    modalText: {
        fontSize: 12,
        marginTop: '2%',
        color: '#000428'
    },
    modalView: {
        width: '90%',
        height: '60%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFEF9',
        borderRadius: 20,
        elevation: 10,
    },
});