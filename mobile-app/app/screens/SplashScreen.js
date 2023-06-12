import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={require('../assets/DrivenseLogoNoBg.png')}
                    style={styles.logo}
                />
                <LinearGradient
                    style={styles.linearGradientBg}
                    colors={['#000428', '#0049E2']}
                    start={{ x: 0.0, y: 0.50}}
                    end={{ x: 0.50, y: 1.00 }}>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    linearGradientBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
    },
    logo: {
        width: '50%',
        resizeMode: 'contain'
    }
})

export default SplashScreen;