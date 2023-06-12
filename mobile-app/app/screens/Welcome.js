import React, { Component } from 'react'
import { 
    Text,
    StyleSheet,
    View,
    Image,
    Pressable,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import auth from '@react-native-firebase/auth'

const imageWidth = Dimensions.get("window").width
const slideHeight = imageWidth * 0.60 // 60%

const slideContent = [
    {
        Image: 'https://connect-app-images.s3.amazonaws.com/Welcome+Screen+Slide+1.png',
        Title: 'Show off your socials',
        Caption: 'Link your various social media accounts into one central app for efficient Connecting.'
    },
    {
        Image: 'https://connect-app-images.s3.amazonaws.com/Welcome+Screen+Slide+2.png',
        Title: 'Share QR codes',
        Caption: 'With one qr code\nmake unlimited connections'
    },
    {
        Image: 'https://connect-app-images.s3.amazonaws.com/Welcome+Screen+Slide+3.png',
        Title: 'Connect with friends and coworkers',
        Caption: "Don't let an opportunity pass, by forgetting someones information. Store it in one location."
    },
    {
        Image: 'https://connect-app-images.s3.amazonaws.com/Welcome+Screen+Slide+4.png',
        Title: 'Enjoy Connecting!',
    }
]

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 0
        }
    }

    componentDidMount = () => {
        auth().onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('Main Area')
            } else if (!user) {
                this.props.navigation.navigate('Welcome')
            }
        })
    }

    slideChange = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
        if (slide !== this.state.active) {
            this.setState({ active: slide })
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
                <View style={{ width: '100%', height: '10%', alignItems: 'center' }}>
                    <Image source={require('../assets/DrivenseLogoNoBg.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                </View>

                <View style={{
                    width: '100%',
                    height: '70%',
                    marginTop: '5%',
                    marginBottom: '2%'
                }}>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled={true}
                        onScroll={this.slideChange}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        showsHorizontalScrollIndicator={false}
                        >
                        {
                            slideContent.map(( item, index ) => (
                                <View key={index + 0.03} style={{ width: imageWidth, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Image
                                        key={index}
                                        source={{ uri: item.Image }}
                                        style={{ width: imageWidth, height: '75%', resizeMode: 'contain' }}
                                    />
                                    <Text key={index + 0.1} style={styles.slideTitle}>{item.Title}</Text>
                                    <Text key={index + 0.2} style={styles.slideCaption}>{item.Caption}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <View style={{width: '100%', flexDirection: 'row', position: 'absolute', bottom: 0, justifyContent: 'center'}}>
                        {
                            slideContent.map(( i, k ) => (
                                <Text key={k} style={k == this.state.active ? styles.pagingText : styles.pagingActiveText}>⬤</Text>
                            ))
                        }
                    </View>
                </View>

                <View style={{
                    width: '100%',
                    height: '20%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Pressable
                        style={[
                            styles.button,
                            { marginRight: '2%' }
                        ]}
                        onPress={() => this.props.navigation.navigate('Sign Up')}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.button,
                            { marginLeft: '2%' }
                        ]}
                        onPress={() => this.props.navigation.navigate('Log In')}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '45%',
        borderColor: '#FBFEF9',
        borderWidth: 2,
        padding: '2%'
    },
    buttonAlt: {
        width: '45%',
        padding: '2%',
        backgroundColor: '#FBFEF9',
        borderRadius: 20
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '800',
        color: '#FBFEF9',
        fontSize: 20
    },
    buttonTextAlt: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        color: '#000428'
    },
    container: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    linearGradientBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
    },
    pagingText: {
        color: '#0049E2',
        fontSize: imageWidth / 30,
        marginLeft: '2%',
        marginRight: '2%'
    },
    pagingActiveText: {
        color: '#000428',
        fontSize: imageWidth / 30,
        marginLeft: '2%',
        marginRight: '2%'
    },
    slideCaption: {
        fontSize: 16,
        color: '#FBFEF9',
        fontWeight: '600',
        textAlign: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '2%'
    },
    slideTitle: {
        fontSize: 20,
        color: '#FBFEF9',
        fontWeight: '800',
        textAlign: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '5%'
    },
    slideImage: {
        width: '100%',
        height: Dimensions.get('window') * 100 / 60,
    },
})
