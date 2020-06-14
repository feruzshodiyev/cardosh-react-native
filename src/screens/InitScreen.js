import React, {Component} from 'react';
import {Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import {Container, Header, Left, Body, Right, Button, Icon, Title, Content, Text} from 'native-base';

const background = require("../assets/images/Groupbg.png");
const {width, height} = Dimensions.get("window");

class InitScreen extends Component {


    render() {
        return (
            <ImageBackground
                source={background}
                style={[styles.container, styles.bg]}
                resizeMode="cover"
            >
            <Container style={{backgroundColor: "transparent"}}>

                    <Content>
                        <Button
                            rounded
                            onPress={()=>this.props.navigation.navigate('Login')}
                            style={{marginTop:200}}
                            block>
                            <Text> Войти </Text>
                        </Button>

                        <Button
                            rounded
                            onPress={()=>this.props.navigation.navigate('Signup')}
                            style={{marginTop:100}}
                            block>
                            <Text> Зарегистрироваться</Text>
                        </Button>
                    </Content>


            </Container>
            </ImageBackground>
        );
    }
}

let styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bg: {
        width,
        height
    },


});

export default InitScreen;