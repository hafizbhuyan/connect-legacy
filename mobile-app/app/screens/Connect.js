import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Contacts from 'react-native-contacts';

import analytics from '@react-native-firebase/analytics'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';

export default class Connect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: 'Hello World',
            QRReaderModal: false,
            ConnectModal: false,
			user: {
                firstName: '',
                lastName: '',
                email: '',
                company: '',
                position: '',
                picture: ''
            },
		};
        this.viewRef = React.createRef()
	}

	componentDidMount = async () => {
		await AsyncStorage.getItem('First Name').then(firstNameValue => {
            this.setState(prevState => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    firstName: firstNameValue
                }
            }))
        })
        await AsyncStorage.getItem('Last Name').then(lastNameValue => {
            this.setState(prevState => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    lastName: lastNameValue
                }
            }))
        })
        await AsyncStorage.getItem('Email').then(emailValue => {
            this.setState(prevState => ({
                ...prevState,
                Email: {
                    ...prevState.Email,
                    value: emailValue
                },
                user: {
                    ...prevState.user,
                    email: emailValue
                }
            }))
        })
	}

	ShareQRCode = async () => {
        const uri = await captureRef(this.viewRef, {
            format: 'png',
            quality: 0.95
        })
        Share.open({
            title: `Connect with ${this.state.user.firstName}`,
            message: `${this.state.user.firstName} would like to connect with you!`,
            url: uri,
            subject: `${this.state.user.firstName} would like to Connect with you!`,
            email: this.state.user.email,
            failOnCancel: true
        }).then(response => {
            if (response.success) {
                Alert.alert('Success!', "Your QR code is on its way")
                firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({
                    qrCodesSent: firestore.FieldValue.increment(1)
                })
                analytics().logShare({
                    content_type: 'QR Code',
                    item_id: `${this.state.user.lastName}-${this.state.user.lastName}`,
                    method: 'User chosen method'
                })
            } else {
                Alert.alert('Error', "Something went wrong, please try again")
            }
        })
    }

    ReadQRCode = async (e) => {
        const firstName = e.data.substring(e.data.indexOf('-') + 1, e.data.indexOf('&'))
        const lastName = e.data.substring(e.data.indexOf('=') + 1, e.data.indexOf('-'))

        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()

        await firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({
                    connections: firestore.FieldValue.arrayUnion(`${lastName}, ${firstName} (Connected on ${month}/${day}/${year})`),
                    totalConnections: firestore.FieldValue.increment(1)
                })
            }
        })

        await firestore().collection('users').doc(`${lastName}, ${firstName}`).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                firestore().collection('users').doc(`${lastName}, ${firstName}`).update({
                    connections: firestore.FieldValue.arrayUnion(`${this.state.user.lastName}, ${this.state.user.firstName} (Connected on ${month}/${day}/${year})`),
                    totalConnections: firestore.FieldValue.increment(1)
                })
            }
        })

        Alert.alert('Success!!', `You've connected with ${firstName}`)
        this.setState({ QRReaderModal: false })

        Linking.openURL(e.data)
    }

	render() {
		return (
			<View style={styles.centeredView}>
				<View style={styles.modalView}>

					<View
						ref={this.viewRef}
						style={{
							width: '75%',
							height: '70%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							elevation: 10,
							backgroundColor: '#000428'
					}}>
						<Text style={{
							color: '#FBFEF9',
							fontSize: 16,
							textAlign: 'center',
							marginBottom: '2%',
							fontWeight: '800'
						}}
						>
							Connect with {this.state.user.firstName} {'\n'}
							{this.state.user.position} at {this.state.user.company}
						</Text>
						<QRCode
							value={`https://www.drivense.com/profile?name=${this.state.user.lastName}-${this.state.user.firstName}&qrCode=true`}
							size={175}
							quietZone={10}
						/>
						<Text style={{
							color: '#FBFEF9',
							fontSize: 14,
							textAlign: 'center',
							marginTop: '2%',
							fontWeight: '600'
						}}>
							Created by Drivense
						</Text>
					</View>
					<View style={{
						width: '100%',
						height: '20%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<Pressable
							onPress={() => this.setState({ ConnectModal: false, QRReaderModal: true })}
							style={[
								styles.modalButton,
								{ width: '40%', marginRight: '2%' }
							]}>
							<Text style={styles.modalButtonText}>Read</Text>
						</Pressable>
						<Pressable
							onPress={() => this.ShareQRCode()}
							style={[
								styles.modalButton,
								{ width: '40%', marginLeft: '2%' }
							]}>
							<Text style={styles.modalButtonText}>Share</Text>
						</Pressable>
					</View>

					<Pressable style={styles.modalButton} onPress={() => this.props.navigation.goBack()} >
						<Text style={styles.modalButtonText}>Go Back</Text>
					</Pressable>
				</View>

				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.QRReaderModal}>
					<View style={styles.centeredView}>
						<View style={[
							styles.modalView,
							{ flexDirection: 'column' }
						]}>
							<QRCodeScanner
								onRead={this.ReadQRCode}
							/>
							<Pressable
								style={{
									width: '50%',
									padding: '2%',
									borderColor: '#FBFEF9',
									borderWidth: 2
								}}
								onPress={() => {
									this.setState({ QRReaderModal: false })
								}}>
								<Text style={{
									fontWeight: '800',
									textAlign: 'center',
									color: '#FBFEF9',
									fontSize: 18
								}}>Close</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
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