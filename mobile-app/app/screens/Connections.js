import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, Image, Pressable, Modal, Alert, Linking, Platform } from 'react-native'
import { SearchBar, Avatar } from 'react-native-elements'
import SplashScreen from './SplashScreen'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import Mailer from 'react-native-mail'
import Maps from 'react-native-open-maps'
import filter from 'lodash.filter'

export default class Connections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userEmail: '',
            firstName: '',
            modalVisible: false,
            connections: [],
            searchArray: [],
            selectedProfile: 0,
            dataLoaded: false,
            searchQuery: ''
        }
    }

    componentDidMount = async () => {
        let userFirstName = ''
        let userLastName = ''

        await AsyncStorage.getItem('First Name').then(value => {
            userFirstName = value
            this.setState({ firstName: value })
        })
        await AsyncStorage.getItem('Last Name').then(value => userLastName = value)
        await AsyncStorage.getItem('Email').then(value => this.setState({ userEmail: value }))

        firestore().collection('users').doc(`${userLastName}, ${userFirstName}`).onSnapshot(userDocumentSnapshot => {
            if (userDocumentSnapshot.exists) {
                let data = userDocumentSnapshot.data().connections

                data.forEach(item => {
                    let connectionFirstName = item.substring(item.indexOf(',') + 1, item.indexOf('(')).trim()
                    let connectionLastName = item.substring(0, item.indexOf(',')).trim()
                    firestore().collection('users').doc(`${connectionLastName}, ${connectionFirstName}`).onSnapshot(connectionDocumentSnapshot => {
                        if (connectionDocumentSnapshot.exists) {
                            let person = {
                                firstName: connectionFirstName,
                                lastName: connectionLastName,
                                email: connectionDocumentSnapshot.data().email,
                                position: connectionDocumentSnapshot.data().position,
                                company: connectionDocumentSnapshot.data().company,
                                picture: connectionDocumentSnapshot.data().picture,
                                items: connectionDocumentSnapshot.data().items,
                                totalConnections: connectionDocumentSnapshot.data().totalConnections,
                                hasAccount: connectionDocumentSnapshot.data().hasAccount
                            }
                            this.setState({ connections: [...this.state.connections, person] })
                            this.setState({ searchArray: [...this.state.searchArray, person] })
                        } else if (!connectionDocumentSnapshot.exists) {
                            
                        }
                    })
                })
            }
        })

        this.setState({ dataLoaded: true })
    }

    renderHeader = () => {
        return (
            <SearchBar
                round={false}
                placeholder={"Find a Connection"}
                placeholderTextColor={'#FBFEF9'}
                value={this.state.searchQuery}
                onChangeText={search => this.HandleSearch(search)}
                inputStyle={{color: '#FBFEF9', fontWeight: '600',}}
                inputContainerStyle={{ backgroundColor: '#000428' }}
                containerStyle={{ backgroundColor: '#000428' }}
                searchIcon={{ color: '#FBFEF9' }}
            />
        );
    }

    HandleSearch = (searchItem) => {
        this.setState({
            searchQuery: searchItem,
            connections: this.state.searchArray.filter(connection => {
                    const fullName = `${connection.firstName} ${connection.lastName}`
                    return fullName.includes(searchItem)
                })
        })
    }

    HandleEmail = (person, reason) => {
        if (reason == 'Message') {
            Mailer.mail({
                subject: `${this.state.firstName} would love to Connect with you!!`,
                recipients: [person.email],
                body: `<h4>Hi ${person.firstName},</h4>\n\n<p>[Make an introduction or reconnect, but make the message short!]</p>`,
                isHTML: true
            }, (error, event) => {
                Alert.alert(error, event)
            })
        } else if (reason == 'Invite') {
            Mailer.mail({
                subject: `${this.state.firstName} is inviting you to join Drivense Connect!!`,
                recipients: [person.email],
                body: `<h4>Hi ${person.firstName}, \n\nWe'd love to have you join ${this.state.firstName} on Drivense Connect and take your networking to the next level!!</h4>`,
                isHTML: true
            },(error, event) => {
                Alert.alert(error, event)
            })
        }
    }

    OpenItem = (item) => {
        // LinkedIn
        if (item.name == 'LinkedIn') {
            Linking.openURL(`https://www.linkedin.com/in/${item.value}`)
        }
        
        // Twitter
        else if (item.name == 'Twitter') {
            Linking.openURL(`http://twitter.com/${item.value}`)
        }

        // GitHub
        else if (item.name == 'GitHub') {
            Linking.openURL(`https://github.com/${item.value}`)
        }
        
        // Instagram
        else if (item.name == 'Instagram') {
            Linking.openURL(`https://www.instagram.com/${item.value}`)
        }
        
        // Snapchat
        else if (item.name == 'Snapchat') {
            Linking.openURL(`https://www.snapchat.com/add/${item.value}`)
        }

		// F6S
		else if (item.name == 'F6S') {
			Linking.openURL(`https://www.f6s.com/${item.value}`)
		}

		// Angel List
		else if (item.name == 'Angel List') {
			Linking.openURL(`https://www.angel.co/company/${item.value}`)
		}

		// Product Hunt
		else if (item.name == 'Product Hunt') {
			Linking.openURL(`https://www.producthunt.com/@${item.value}`)
		}
        
        // Facebook
        else if (item.name == 'Facebook') {
            Linking.openURL(`https://www.facebook.com/${item.value}`)
        }

        // SoundCloud
        else if (item.name == 'SoundCloud') {
            Linking.openURL(`https://www.soundcloud.com/${item.value}`)
        }

        // Medium
        else if (item.name == 'Medium') {
            Linking.openURL(`https://www.medium.com/@${item.value}`)
        }

        // Messenger
        else if (item.name == 'Messenger') {
            Linking.openURL(`https://www.m.me/${item.value}`)
        }

        // Pinterest
        else if (item.name == 'Pinterest') {
            Linking.openURL(`https://www.pinterest.com/${item.value}`)
        }

        // Reddit
        else if (item.name == 'Reddit') {
            Linking.openURL(`https://www.reddit.com/user/${item.value}`)
        }

        // YouTube
        else if (item.name == 'YouTube') {
            Linking.openURL(`https://www.youtube.com/${item.value}`)
        }

        // Custom
        else if (item.name == 'Custom') {
            Linking.openURL(item.value)
        }

		// Twitch
		else if (item.name == 'Twitch') {
			Linking.openURL(`https://www.twitch.tv/${item.value}`)
		}

        // City
        else if (item.name == 'City') {
            Maps({
                mapType: 'satellite',
                provider: (Platform.OS == 'android') ? 'google' : 'apple',
                query: item.value
            })
        }

        // Phone
        else if (item.name == 'Phone') {
            Linking.openURL(`tel:${item.value}`)
        }
	}

    render() {
        const {
            connections,
            modalVisible,
            selectedProfile,
            dataLoaded
        } = this.state

        if (dataLoaded == false) {
            return (
                <SplashScreen />
            )
        } else if (dataLoaded == true) {
            if (connections.length < 1) {
                return (
                    <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LinearGradient
                            style={styles.linearGradientBg}
                            colors={['#000428', '#004E92']}
                            start={{ x: 0.0, y: 0.50}}
                            end={{ x: 0.50, y: 1.00 }}>
                        </LinearGradient>                    
                        <Text style={{ fontSize: 30, color: '#FBFEF9', textAlign: 'center', fontWeight: '600' }}>
                            Nothing yet, start making those connections!
                        </Text>
                    </View>
                )
            } else {
                return (
                    <View style={{width: '100%', height: '100%', flex: 1}}>
                        <FlatList
                            ListHeaderComponent={this.renderHeader}
                            keyExtractor={(item, index) => item.lastName + item.firstName}
                            data={connections}
                            style={{width: '100%', height: '100%', flex: 1}}
                            renderItem={({item, index}) => {
                                if (item.hasAccount == true) {
                                    return (
                                        <View style={styles.listItemContainer}>
                                            <Avatar
                                                size={'xlarge'}
                                                rounded={true}
                                                source={(item.picture != '') ? { uri: item.picture } : { uri: 'https://connect-app-images.s3.amazonaws.com/PlaceholderProfile.png' }}
                                                avatarStyle={{ resizeMode: 'center' }}
                                            />
                                            <Text style={styles.listItemText} key={index}>
                                                {item.firstName} {item.lastName}
                                            </Text>
                                            {/* <Text style={[
                                                styles.listItemText,
                                                { fontFamily: 'Montserrat-Medium', fontSize: 18 }
                                            ]}>{item.position} at {item.company}</Text> */}
                
                                            <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                                                <Pressable
                                                    style={styles.listItemButton}
                                                    onPress={() => {
                                                        this.setState({ 
                                                            modalVisible: true,
                                                            selectedProfile: index
                                                        })}
                                                    }>
                                                    <Text style={styles.listItemButtonText}>{item.firstName}'s Profile</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    )
                                } else if (item.hasAccount == false) {
                                    return (
                                        <View style={styles.listItemContainer}>
                                            <Text style={styles.listItemText}>{item.firstName} {item.lastName}</Text>
                
                                            <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                                                <Pressable
                                                    style={styles.listItemButton}
                                                    onPress={() => this.HandleEmail(item, 'Invite')}>
                                                    <Text style={styles.listItemButtonText}>
                                                        Invite {item.firstName} to create an account!
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                        />

                        <Modal
                            animationType={'fade'}
                            transparent={true}
                            visible={modalVisible}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{
                                        width: '100%',
                                        height: '90%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Text style={styles.modalText}>{connections[selectedProfile].position} at {connections[selectedProfile].company}</Text>
                                        <Text style={styles.modalText}>{connections[selectedProfile].totalConnections} Connections</Text>
                                        <FlatList
                                            style={{
                                                width: '100%',
                                                height: '70%',
                                                backgroundColor: '#FBFEF9',
                                                marginTop: '2%',
                                                marginBottom: '2%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                            keyExtractor={(item, index) => item.lastName + item.name}
                                            data={connections[selectedProfile].items}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <Pressable
                                                        onPress={() => this.OpenItem(item)}
                                                        style={styles.modalItemContainer}>
                                                        <Image
                                                            style={styles.modalImages}
                                                            source={{ uri: item.picture }}
                                                        />
                                                        <Text style={styles.modalItemText}>{item.name}: {item.value}</Text>
                                                    </Pressable>
                                                )
                                            }}
                                        />
                                    </View>

                                    <View style={{ width: '100%', height: '10%', display: 'flex', flexDirection: 'row' }}>
                                        <Pressable
                                            style={[
                                                styles.modalButton,
                                                { marginRight: '2%' }
                                            ]}
                                            onPress={() => this.HandleEmail(connections[selectedProfile], 'Message')}>
                                            <Text style={styles.modalButtonText}>Email {connections[selectedProfile].firstName}</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[
                                                styles.modalButton,
                                                { marginLeft: '2%' }
                                            ]}
                                            onPress={() => this.setState({ modalVisible: false })}>
                                            <Text style={styles.modalButtonText}>Close</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    linearGradientBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
    },
    
    listItemButton:{
        width: '75%',
        padding: '2%',
        marginTop: '2%',
        marginBottom: '2%',
        borderWidth: 2,
        borderColor: '#FBFEF9',
        shadowColor: '#000428', // make this the person's company color
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowOpacity: 5,
        shadowRadius: 20,
        elevation: 10
    },
    listItemButtonText: {
        fontSize: 18,
        color: '#FBFEF9',
        fontWeight: '600',
        textAlign: 'center'
    },
    listItemContainer: {
        width: '90%',
        marginLeft: '5%',
        marginTop: '2%',
        marginBottom: '2%',
        backgroundColor: '#000428',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000428', // make this the person's company color
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowOpacity: 5,
        shadowRadius: 20,
        elevation: 10
    },
    listItemText: { 
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        color: '#FBFEF9',
        padding: '2%'
    },

    // styles for modals
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalImages: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    modalItemContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000428',
        marginBottom: '2%',
        borderRadius: 20,
        padding: '2%',
        marginLeft: '10%'
    },
    modalItemText: {
        fontWeight: '800',
        fontSize: 16,
        marginTop: '2%',
        color: '#FBFEF9'
    },
    modalButton: {
        width: '50%',
        padding: '2%',
        borderColor: '#000428',
        borderWidth: 2,
        justifyContent: 'center'
    },
    modalButtonText: {
        fontWeight: '600',
        textAlign: 'center',
        color: '#000428',
        fontSize: 18
    },
    modalText: {
        textAlign: 'center',
        color: '#000428',
        fontSize: 16,
        fontWeight: '800',
    },
    modalView: {
        width: '80%',
        height: '80%',
        margin: 10,
        backgroundColor: '#FBFEF9',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5%'
    },
})
