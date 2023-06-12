import React, { Component } from 'react'
import { Text, StyleSheet, View, Pressable, Image, FlatList, Modal, Alert, Linking } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SplashScreen from './SplashScreen'
import ImagePicker from 'react-native-image-crop-picker';

import analytics from '@react-native-firebase/analytics'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                company: '',
                position: '',
                picture: ''
            },
            ItemModal: false,
            ValueModal: false,
            HeaderEditModal: false,
            ConnectModal: false,
            PreviewScreen: false,
            QRReaderModal: false,
            InputItem: '',
            InputValue: '',
            Empty: {
                name: 'Empty'
            },
            Email: {
                name: 'Email',
                picture: 'https://connect-app-images.s3.amazonaws.com/EmailIcon.png',
                value: ''
            },
            City: {
                name: 'City',
                picture: 'https://connect-app-images.s3.amazonaws.com/CityIcon.png',
                value: ''
            },
            Phone: {
                name: 'Phone',
                picture: 'https://connect-app-images.s3.amazonaws.com/PhoneIcon.png',
                value: ''
            },
            LinkedIn: {
                name: 'LinkedIn',
                picture: 'https://connect-app-images.s3.amazonaws.com/LinkedInLogo.png',
                value: ''
            },
            F6S: {
                name: 'F6S',
                picture: 'https://connect-app-images.s3.amazonaws.com/F6SLogo.png',
                value: ''
            },
            AngelList: {
                name: 'Angel List',
                picture: 'https://connect-app-images.s3.amazonaws.com/AngelListLogo.png',
                value: ''
            },
            ProductHunt: {
                name: 'Product Hunt',
                picture: 'https://connect-app-images.s3.amazonaws.com/ProductHuntLogo.png',
                value: ''
            },
            Instagram: {
                name: 'Instagram',
                picture: 'https://connect-app-images.s3.amazonaws.com/InstagramLogo.png',
                value: ''
            },
            Facebook: {
                name: 'Facebook',
                picture: 'https://connect-app-images.s3.amazonaws.com/FacebookLogo.png',
                value: ''
            },
            GitHub: {
                name: 'GitHub',
                picture: 'https://connect-app-images.s3.amazonaws.com/GitHubLogo.png',
                value: ''
            },
            SoundCloud: {
                name: 'SoundCloud',
                picture: 'https://connect-app-images.s3.amazonaws.com/SoundCloudLogo.png',
                value: ''
            },
            Medium: {
                name: 'Medium',
                picture: 'https://connect-app-images.s3.amazonaws.com/MediumLogo.png',
                value: ''
            },
            Twitter: {
                name: 'Twitter',
                picture: 'https://connect-app-images.s3.amazonaws.com/TwitterLogo.png',
                value: ''
            },
            Messenger: {
                name: 'Messenger',
                picture: 'https://connect-app-images.s3.amazonaws.com/MessengerLogo.png',
                value: ''
            },
            Snapchat: {
                name: 'Snapchat',
                picture: 'https://connect-app-images.s3.amazonaws.com/SnapchatLogo.png',
                value: ''
            },
            Pinterest: {
                name: 'Pinterest',
                picture: 'https://connect-app-images.s3.amazonaws.com/PinterestLogo.png',
                value: ''
            },
            Reddit: {
                name: 'Reddit',
                picture: 'https://connect-app-images.s3.amazonaws.com/RedditLogo.png',
                value: ''
            },
            YouTube: {
                name: 'YouTube',
                picture: 'https://connect-app-images.s3.amazonaws.com/YouTubeLogo.png',
                value: ''
            },
            Twitch: {
                name: 'Twitch',
                picture: 'https://connect-app-images.s3.amazonaws.com/TwitchLogo.png',
                value: ''
            },
            Quote: {
                name: 'Quote',
                picture: 'https://connect-app-images.s3.amazonaws.com/QuoteImage.png',
                value: ''
            },
            Custom: {
                name: 'Custom',
                picture: 'https://connect-app-images.s3.amazonaws.com/Custom.png',
                value: ''
            },
            BodyItems: [],
            ModalItems: [],
            dataLoaded: false
        }
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

        firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).onSnapshot((documentSnapshot) => {
            if (documentSnapshot.exists) {
                this.setState({
                    user: {
                        firstName: documentSnapshot.data().firstName,
                        lastName: documentSnapshot.data().lastName,
                        company: documentSnapshot.data().company,
                        position: documentSnapshot.data().position,
                        picture: documentSnapshot.data().picture
                    }
                })
                AsyncStorage.setItem('Company', documentSnapshot.data().company)
            }
        })
        this.setState({
            BodyItems: [
                this.state.Empty,
                this.state.Email,
            ],
            ModalItems: [
                this.state.Phone,
                this.state.City,
                this.state.LinkedIn,
                this.state.GitHub,
                this.state.Medium,
                this.state.Twitter,
                this.state.F6S,
                this.state.AngelList,
                this.state.ProductHunt,
                this.state.Instagram,
                this.state.Facebook,
                this.state.SoundCloud,
                this.state.YouTube,
                this.state.Twitch,
                this.state.Snapchat,
                this.state.Pinterest,
                this.state.Reddit,
                this.state.Messenger,
                this.state.Quote,
                this.state.Custom,
            ]
        })

        // put all the items that are in the firestore array into body array and remove from modal array
        await firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                documentSnapshot.data().items.forEach(value => {
                    this.setState(prevState => ({
                        BodyItems: [...prevState.BodyItems, value],
                        ModalItems: this.state.ModalItems.filter(a => a.name != value.name)
                    }))
                })
            }
        })

        this.setState({ dataLoaded: true })
    }

    AddItem = async (item, value) => {
        let selectedObject = this.state.ModalItems.find(a => a.name == item.name) // gets the selected item from the modal array
        let index = this.state.ModalItems.indexOf(selectedObject) // gets that item's index value
        selectedObject.value = value // make the selected object's value the entered value

        this.setState({ [item]: selectedObject })
        firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({
                    items: firestore.FieldValue.arrayUnion(selectedObject)
                })
            }
        })

        this.state.BodyItems.splice(1, 0, selectedObject) // put the selected item into body array
        if (item.name != 'Custom' || item.name != 'Quote') {
            this.state.ModalItems.splice(index, 1) // remove selected item from modal array
        }
    }

    DeleteItem = async (item) => {
        let selectedObject = this.state.BodyItems.find(a => a.name == item.name) // gets the selected item from the body array
        let index = this.state.BodyItems.indexOf(selectedObject) // gets that item's index value

        firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                // find the index of the selected object in firestore and use splice on it
                // let selectedObjectIndex = documentSnapshot.data().items.indexOf(selectedObject)
                // console.log(selectedObjectIndex)
                firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({
                    items: documentSnapshot.data().items.filter(item => item.name !== selectedObject.name)
                })
            }
        })
        selectedObject.value = '' // make the selected object's value an empty string
        this.setState({ [item]: selectedObject })

        this.state.ModalItems.splice(1, 0, selectedObject) // put the selected item into modal array
        this.state.BodyItems.splice(index, 1) // remove selected item from body array
    }

    PickProfilePicture = () => {
        const reference = storage().ref(`profile-pictures/${this.state.user.lastName}-${this.state.user.firstName}-profile-picture.png`)

        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            mediaType: 'photo',
            cropperStatusBarColor: '#000428'
        }).then(image => {
            if (image) {
                this.setState(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        picture: image.path
                    }
                }))
                const task = reference.putFile(this.state.user.picture)
                task.then(() => {
                    this.SaveProfilePicture()
                    Alert.alert('Success!!!', 'Your profile picture has been updated!')
                })
            }
        });
    }

    SaveProfilePicture = async () => {
        const url = await storage().ref(`profile-pictures/${this.state.user.lastName}-${this.state.user.firstName}-profile-picture.png`).getDownloadURL()

        firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).onSnapshot((documentSnapshot) => {
            if (documentSnapshot.exists) {
                firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({ picture: url })
            }
        })
    }

    KeyboardType = (item) => {
        if (item == 'Phone') {
            return 'phone-pad'
        } else if (item == 'Email') {
            return 'email-address'
        } else if (item == 'Custom') {
            return 'url'
        } else if (item == 'Twitter') {
            return 'twitter'
        } else {
            return 'default'
        }
    }

    ModalPlaceholderText = (item) => {
        if (item.name == 'Email') {
            return "What's your email?"
        } else if (item.name == 'Phone') {
            return "What's your phone number?"
        } else if (item.name == 'City') {
            return "Where are you located?"
        } else if (item.name == 'Custom') {
            return "What else would you like to share?"
        } else {
            return `What's your ${item.name} username?`
        }
    }

    render() {
        const {
            BodyItems,
            ModalItems,
            ItemModal,
            PreviewScreen,
            ValueModal,
            HeaderEditModal,
            ConnectModal,
            InputItem,
            InputValue,
            user,
            dataLoaded,
            QRReaderModal
        } = this.state

        if (dataLoaded == false) {
            return (
                <SplashScreen />
            )
        } else if (dataLoaded == true) {
            return (
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Pressable
                            style={{ position: 'absolute', top: '5%', right: '2%' }}
                            onPress={() => this.setState({ HeaderEditModal: true })}
                            >
                            <FontAwesome name={'edit'} color={'#FBFEF9'} size={30}  />
                        </Pressable>
                        <Avatar
                            size={'large'}
                            rounded={true}
                            source={(user.picture != '') ? { uri: user.picture } : { uri: 'https://connect-app-images.s3.amazonaws.com/PlaceholderProfile.png' }}
                        />
                        <Text style={styles.headerText}>
                            {user.position ? user.position : '[YOUR POSITION]'} at {user.company ? user.company : '[YOUR COMPANY]'}
                        </Text>
                    </View>

                    <FlatList
                        style={styles.bodyContainer}
                        data={BodyItems}
                        renderItem={({ item }) => {
                            if (item.name == 'Empty') {
                                return (
                                    <Pressable
                                        style={[
                                            styles.bodyItemContainer,
                                            { borderStyle: 'dashed', backgroundColor: '#000428', height: 50, borderWidth: 2, borderColor: '#000428' }
                                        ]}
                                        onPress={() => this.setState({ ItemModal: true })}>
                                        <Text style={styles.bodyItemText}>Add <FontAwesome name='plus-circle' size={20} color={'#FBFEF9'} /> </Text>
                                    </Pressable>
                                )
                            } else if (item.name == 'Email') {
                                return (
                                    <View style={styles.bodyItemContainer}>
                                        <Pressable
                                            style={{ position: 'absolute', alignSelf: 'flex-end', top: 5, right: 15 }}
                                            onPress={() => this.DeleteItem(item)}>
                                        </Pressable>
                                        <Image
                                            style={styles.bodyItemImage}
                                            source={{ uri: item.picture }}
                                        />
                                        <Text style={styles.bodyItemText}>{item.name}: {item.value}</Text>
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={styles.bodyItemContainer}>
                                        <Pressable
                                            style={{ position: 'absolute', alignSelf: 'flex-end', top: 5, right: 15 }}
                                            onPress={() => this.DeleteItem(item)}>
                                            <FontAwesome name={'trash-o'} color={'#FBFEF9'} size={20} />
                                        </Pressable>
                                        <Image
                                            style={styles.bodyItemImage}
                                            source={{ uri: item.picture }}
                                        />
                                        <Text style={styles.bodyItemText}>{item.name}: {item.value}</Text>
                                    </View>
                                )
                            }
                        }}
                    />

                    <Modal
                        visible={ItemModal}
                        transparent={true}
                        animationType={'fade'}>
                        <View style={styles.centeredView}>    
                            <View style={styles.modalView}>

                                <View
                                    style={{
                                        width: '100%',
                                        height: '90%',
                                        flex: 1,
                                        padding: 20
                                    }}
                                >
                                    <ScrollView
                                        style={{
                                            flex: 1
                                        }}
                                        contentContainerStyle={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            paddingBottom: '200%',
                                        }}
                                    >
                                        {
                                            ModalItems.map((item, index) => {
                                                return (
                                                    <View style={styles.modalItemContainer} key={index}>
                                                        <Image
                                                            source={{ uri: item.picture }}
                                                            style={styles.modalImages}
                                                        />
                                                        <Pressable
                                                            style={[
                                                                styles.modalButton,
                                                                { width: '100%' }
                                                            ]}
                                                            onPress={() => this.setState({
                                                                InputItem: item,
                                                                ItemModal: false,
                                                                ValueModal: true
                                                            })}
                                                        >
                                                            <Text style={styles.modalButtonText}>
                                                                {item.name}
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>

                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ ItemModal: false })}
                                        style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Close</Text>
                                    </Pressable>
                                </View>
    
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={ValueModal}
                        transparent={true}
                        animationType={'fade'}>

                        <View style={styles.centeredView}>

                            <View style={styles.modalView}>

                                <View style={{
                                    width: '100%',
                                    height: '90%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TextInput
                                        style={{
                                            width: '80%',
                                            height: '35%',
                                            borderRadius: 20,
                                            backgroundColor: '#000428',
                                            color: '#FBFEF9',
                                            fontWeight: '600',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            padding: '2%'
                                        }}
                                        placeholder={this.ModalPlaceholderText(InputItem)}
                                        placeholderTextColor={'#FBFEF9'}
                                        onEndEditing={(input) => {
                                            this.setState({ InputValue: input.nativeEvent.text, ValueModal: false, ItemModal: false })
                                            this.AddItem(InputItem, input.nativeEvent.text)
                                        }}
                                        keyboardType={this.KeyboardType(InputItem)}
                                    />
                                </View>
                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ ValueModal: false })}
                                        style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Close</Text>
                                    </Pressable>
                                </View>

                            </View>

                        </View>

                    </Modal>

                    <Modal
                        visible={HeaderEditModal}
                        transparent={true}
                        animationType={'fade'}>

                        <View style={styles.centeredView}>

                            <View style={[
                                styles.modalView,
                                { height: '80%' }
                            ]}>

                                <View style={{
                                    width: '100%',
                                    height: '90%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '5%'
                                    }}>
                                        <Avatar
                                            size={'xlarge'}
                                            rounded={true}
                                            source={{ uri: user.picture }}
                                        />
                                        <Pressable
                                            onPress={() => this.PickProfilePicture()}
                                            style={[
                                                styles.modalButton,
                                                { width: '75%', padding: '1%' }
                                            ]}>
                                            <Text style={styles.modalButtonText}>Update Profile Picture</Text>
                                        </Pressable>
                                    </View>
                                    <TextInput
                                        style={{
                                            width: '80%',
                                            height: '20%',
                                            borderRadius: 20,
                                            backgroundColor: '#000428',
                                            color: '#FBFEF9',
                                            fontWeight: '600',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            flexShrink: 1,
                                            marginBottom: '5%'
                                        }}
                                        placeholder={"Congrats!!\nWhat's your new company?"}
                                        placeholderTextColor={'#FBFEF9'}
                                        onEndEditing={(input) => {
                                            const userInput = input.nativeEvent.text
                                            this.setState(prevState => ({
                                                ...prevState,
                                                user: {
                                                    ...prevState.user,
                                                    company: userInput
                                                }
                                            }))
                                            firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({ company: userInput }).then(Alert.alert('Success!!', 'Your company has been updated!'))
                                        }}
                                    />
                                    <TextInput
                                        style={{
                                            width: '80%',
                                            height: '20%',
                                            borderRadius: 20,
                                            backgroundColor: '#000428',
                                            color: '#FBFEF9',
                                            fontWeight: '600',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            flexShrink: 10,
                                            marginTop: '5%'
                                        }}
                                        placeholder={"Congrats!!\nWhat's your new position?"}
                                        placeholderTextColor={'#FBFEF9'}
                                        onEndEditing={async (input) => {
                                            const userInput = input.nativeEvent.text
                                            this.setState(prevState => ({
                                                ...prevState,
                                                user: {
                                                    ...prevState.user,
                                                    position: userInput
                                                }
                                            }))
                                            firestore().collection('users').doc(`${this.state.user.lastName}, ${this.state.user.firstName}`).update({ position: userInput }).then(Alert.alert('Success!!', 'Your position has been updated!'))
                                        }}
                                    />
                                </View>
                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Pressable
                                        onPress={() => this.setState({ HeaderEditModal: false })}
                                        style={styles.modalButton}>
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

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1
    },

    // header container styles
    headerContainer: {
        width: '100%',
        height: '25%',
        backgroundColor: '#000428',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLinkContainer: {
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLinks: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        marginBottom: '10%'
    },
    headerLinkText: {
        fontWeight: '600',
        fontSize: 14,
        color: 'white',
        textAlign: 'center'
    },
    headerText: {
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        color: '#FBFEF9'
    },

    // body styles
    bodyContainer: {
        width: '100%',
        height: '75%',
        backgroundColor: '#FBFEF9',
        paddingTop: '2%',
        paddingBottom: '2%',
        display: 'flex',
        flexDirection: 'column'
    },
    bodyItemContainer: {
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000428',
        marginBottom: '5%',
        borderRadius: 20,
        marginLeft: '5%',
        padding: '2%',
        elevation: 10
    },
    bodyItemImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    bodyItemText: {
        fontSize: 18,
        color: '#FBFEF9',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: '2%'
    },

    // preview styles
    previewBodyContainer: {
        width: '100%',
        height: '70%',
        backgroundColor: '#FBFEF9',
        paddingTop: '2%',
        paddingBottom: '2%',
        display: 'flex',
        flexDirection: 'column'
    },
    previewItemContainer: {
        width: '45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000428',
        marginBottom: '5%',
        borderRadius: 20,
        marginLeft: '5%',
        padding: '2%'
    },
    previewItemImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    previewItemText: {
        fontSize: 16,
        color: '#FBFEF9',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: '2%'
    },

    // modal styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    modalImages: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    modalItemContainer: {
        width: '40%',
        height: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2%'
    },
    modalItemText: {
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