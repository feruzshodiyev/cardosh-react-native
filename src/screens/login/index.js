import React, {Component} from 'react';
import Constants from 'expo-constants';


import axios from "axios";

import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    Dimensions,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import * as Font from 'expo-font';
import {Container, Header, Content, Item, Input, Icon, Button, Spinner, Toast} from 'native-base';

const {width, height} = Dimensions.get("window");

const background = require("../../assets/images/Groupbg.png");
const mark = require("../../assets/images/logo.png");

class LoginScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            err: false,
            emailErr: false,
            passwordErr: false
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        })
        this.setState({ loading: false })
    }



    handleEmail = (text) => {
        if (text.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                email: text,
                emailErr: false
            });
        }
    };

    handlePassword = (text) => {
        this.setState({
            password: text,
            passwordErr: false

        })
    };


    sendData = () => {
        const {navigate} = this.props.navigation;

        if (this.state.email !== "" && this.state.password !== "") {
            this.setState({
                loading: true
            });
            const formData = new FormData();
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            axios.post("http://api.cardosh.uz/v1/restapi/login/", formData).then(res => {


                AsyncStorage.setItem("access", res.data.access, () => {
                    AsyncStorage.getItem("access", (err, result) => {
                        if (err) {
                            Toast.show({
                                text: "Произошло ошибка!!",
                                buttonText: "Ok"
                            })
                        } else {
                            this.setState({
                                loading: false,
                            }, () => navigate('Home'));

                        }
                    })
                });

            }).catch(err => {
                this.setState({
                    loading: false
                });

                    Toast.show({
                        text:'Сожалею! Что-то пошло не так. Пожалуйста, попробуйте еще раз!',
                        buttonText: "Ok",
                        type: "danger"
                    });

            }).then(()=>{
                this.setState({
                    loading: false
                });
            })
        } else {
            if (!this.state.email) {
                this.setState({
                    emailErr: true
                })
            }
            if (!this.state.password){
                this.setState({
                    passwordErr: true
                })
            }
        }


    };


    render() {
        const {navigate} = this.props.navigation;
        return (
            <Container>
                <Content>
                    <View style={styles.container}>
                        <ImageBackground source={background} style={styles.background} resizeMode="cover">
                            <View style={styles.markWrap}>
                                <Image source={mark} style={styles.mark} resizeMode="contain"/>
                            </View>


                            <Item rounded
                                  error={this.state.emailErr}
                                  style={{backgroundColor: "#f6f6f6", paddingLeft: 10, marginBottom: 20}}>
                                <Icon
                                    style={{color: '#ff6600'}}
                                    active name='mail'/>

                                <Input
                                    placeholder="Эл. почта"
                                    onChangeText={(text) => this.handleEmail(text)}/>
                            </Item>

                            <Item rounded last
                                  error={this.state.passwordErr}
                                  style={{backgroundColor: "#f6f6f6", paddingLeft: 10,}}>
                                <Icon
                                    style={{color: '#ff6600'}}
                                    active name='lock'/>
                                <Input
                                    secureTextEntry={true}
                                    placeholder="Пароль"
                                    onChangeText={(text) => this.handlePassword(text)}/>
                            </Item>


                            <TouchableOpacity activeOpacity={.5}>
                                <View>
                                    <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                                </View>
                            </TouchableOpacity>


                            {this.state.loading ? <Spinner/> :
                                this.state.success ? <Text style={styles.forgotPasswordText}>Success!!!</Text> :

                                    <TouchableOpacity activeOpacity={.5} onPress={() => this.sendData()}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>Войти</Text>
                                        </View>
                                    </TouchableOpacity>}

                            <View style={styles.container}>
                                <View style={styles.signupWrap}>
                                    <Text style={styles.accountText}>Еще нет аккаунта?</Text>
                                    <TouchableOpacity activeOpacity={.5} onPress={() => navigate('Signup')}>
                                        <View>
                                            <Text style={styles.signupLinkText}>зарегистрируйтесь</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </Content>

            </Container>
        )
            ;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    },
    markWrap: {
        flex: 1,
        paddingVertical: 30,
    },
    mark: {

        width: '70%',
        height: null,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: "center",
        justifyContent: "center",
        flex: 1,

    },
    background: {
        width,
        height,
    },
    button: {
        backgroundColor: "#ff6600",
        paddingVertical: 20,
        borderRadius: 20,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
    },
    forgotPasswordText: {
        color: "#2c7dd8",
        backgroundColor: "transparent",
        textAlign: "right",
        paddingRight: 15,
        paddingTop: 15
    },
    signupWrap: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    accountText: {
        color: "#18191f"
    },
    signupLinkText: {
        color: "#2c7dd8",
        marginLeft: 5,
    }
});

export default LoginScreen;