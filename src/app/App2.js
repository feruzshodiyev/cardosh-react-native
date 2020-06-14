import React from 'react';
import {AppRegistry, AsyncStorage, StyleSheet, View, Text, Image} from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
import * as Font from "expo-font";
import {AppLoading, SplashScreen} from 'expo';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const slides2 = [
    {
        key: 'somethun',
        title: 'CARDOSH',
        text: 'Куда угодно. Откуда угодно',
        icon: 'md-pin',
        colors: ['#fff9c4', '#ffa450'],
    },
    {
        key: 'somethun1',
        title: 'Просто',
        text:
            'Среди миллионов попутчиков вы легко найдете тех, кто рядом и кому с вами в пути.',
        icon: 'md-paper-plane',
        colors: ['rgba(167,177,255,0.45)', '#ffa450'],
    },
    {
        key: 'somethun2',
        title: 'Без хлопот',
        text: 'Добирайтесь до места назначения без пересадок.В поездках с попутчиками не надо беспокоиться об очередях и часах, проведенных в ожидании на станции',
        icon: 'ios-car',
        colors: ['rgba(140,216,226,0.38)', '#ffa450'],
    },
];

class App2 extends React.Component {
    constructor(props) {
        super(props);
        SplashScreen.preventAutoHide();
        this.state = {
            isReady: false,
        };
    }

    componentDidMount() {
        this._bootstrapAsyc().catch(err => {
            this.props.navigation.navigate("Auth");
        });

    }


    _bootstrapAsyc = async () => {
        const token = await AsyncStorage.getItem("access");

        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        });

        if (token) {
            this.props.navigation.navigate('App');
        } else {
            this.setState({
                isReady: true
            })
        }


    };

    on_Done_all_slides = () => {
        this.props.navigation.navigate('Auth');
    };

    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{backgroundColor: 'transparent'}}
                />
            </View>
        );
    };

    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{backgroundColor: 'transparent'}}
                />
            </View>
        );
    };

    _renderItem = ({item, dimensions}) => (
        <LinearGradient
            style={[
                styles.mainContent,
                dimensions,
            ]}
            colors={item.colors}
            start={{x: 0, y: 0.1}}
            end={{x: 0.1, y: 1}}
        >
            <Ionicons
                style={{backgroundColor: 'transparent'}}
                name={item.icon}
                size={200}
                color="white"
            />
            <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        </LinearGradient>
    );

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    onError={console.warn}
                />
            );

        }

        return (
            <AppIntroSlider
                slides={slides2}
                renderItem={this._renderItem}
                renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}
                onDone={this.on_Done_all_slides}
            />


        );


    }
}


const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: 320,
        height: 320,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default App2;

AppRegistry.registerComponent('cardosh', () => App2);