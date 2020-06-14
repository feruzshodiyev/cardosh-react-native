import React, {Component} from 'react';
import Constants from 'expo-constants';

import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert, AsyncStorage, TouchableOpacity
} from 'react-native'
import {Container, Header, Content, Item, Input, Icon, Spinner, Toast, CheckBox, DatePicker, Label, Left, Button} from 'native-base';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';

import axios from 'axios';
import * as Font from "expo-font";
import moment from "moment";

const {width, height} = Dimensions.get("window");

const background = require("../../assets/images/Groupbg.png");
export default class SignupView extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isEmailValid: false,
            isEmailExists: false,
            isFirstNameFilled: false,
            isLastNameFilled: false,
            isDobFilled: false,
            isPasswordValid: false,
            isPasswordConfirmed: false,
            isPhoneNumFilled: false,
            isRegSuccess: false,
            isRegError: false,
            loading: false,
            loadingCheckEmail: false,

            fields: {
                'first_name': "",
                'last_name': "",
                'email': "",
                "dob": null,
                "gender": 1,
                'password': "",
                'phone_number': ''
            },
            loginFields: {
                'email': "",
                'password': ""
            }
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        this.setState({loading: false})
    }

    handleEmailChange = (text) => {
        this.setState({
            isEmailExists: false
        });
        if (text.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                loadingCheckEmail: true
            });

            //check is email already registered

            axios.get("http://api.cardosh.uz/v1/restapi/user/email/check/", {
                params: {
                    email: text
                }
            }).then(res => {
                this.setState({
                    loadingCheckEmail: false
                });
                if (res.data.message) {
                    this.setState({
                        isEmailExists: true,
                    });
                    // alert("Электронная почта уже зарегистрирована!");
                    Toast.show({
                        text: 'Электронная почта уже зарегистрирована!',
                        buttonText: "Окей",
                        duration: 6000
                    });
                } else {
                    this.setState(prevState => ({
                        isEmailValid: true,
                        fields: {
                            ...prevState.fields,
                            "email": text,
                        },
                        loginFields:{
                            ...prevState.loginFields,
                            "email": text,
                        }
                    }));
                }
            }).catch(err => {
                this.setState({
                    loadingCheckEmail: false
                });
                Toast.show({
                    text: 'Сожалею! Что-то пошло не так. Пожалуйста, попробуйте еще раз!',
                    buttonText: "Окей",
                    type: "danger"
                });
            });
        }
    };

    handleFirstNameChange = (text) => {
        if (text.length >= 3) {
            this.setState(prevState => ({
                isFirstNameFilled: true,
                fields: {
                    ...prevState.fields,
                    "first_name": text
                }
            }));
        } else {
            this.setState({
                isFirstNameFilled: false
            })
        }
    };

    handleLastNameChange = (text) => {
        if (text.length >= 3) {
            this.setState(prevState => ({
                isLastNameFilled: true,
                fields: {
                    ...prevState.fields,
                    "last_name": text
                }
            }));
        } else {
            this.setState({
                isLastNameFilled: false
            })
        }
    };

    handlePasswordChange = (text) => {
        if (text.length >= 6) {
            this.setState(prevState => ({
                isPasswordValid: true,
                fields: {
                    ...prevState.fields,
                    "password": text
                },
                loginFields: {
                    ...prevState.loginFields,
                    "password": text
                }
            }));
        } else {
            this.setState({
                isPasswordValid: false
            })
        }

    };

    handlePassConfirm = (text) => {

        if (this.state.fields.password === text) {
            this.setState({
                isPasswordConfirmed: true
            })
        } else {
            this.setState({
                isPasswordConfirmed: false
            })
        }

    };

    handleSubmit = () => {
        this.setState({
            loading: true
        });
        const {isEmailValid, isPhoneNumFilled, isFirstNameFilled, isLastNameFilled, isDobFilled, isPasswordValid, fields} = this.state;
        console.log(this.state.fields);

        if (isEmailValid && isPhoneNumFilled && isFirstNameFilled && isLastNameFilled && isDobFilled && isPasswordValid) {

            // send data for registering
            axios.post('http://api.cardosh.uz/v1/restapi/user/create/', fields
            ).then(response => {

                //handle success response
                Alert.alert(
                    'Регистрация успешна!',
                    'Нажмите ок чтобы продолжить.',
                    [
                        {text: 'OK', onPress: () => this.authorize()},
                    ],
                    {cancelable: false},
                );

                console.log(response);
                this.setState({
                    isRegSuccess: true,
                    loading: false
                });
            }).catch(error => {
                //handle error
                this.setState({
                    isRegError: true,
                    loading: false
                });
                console.log("this is error", error);
                alert("Произошло ошибка!")

            });

        }
    };

    authorize=()=>{
        this.setState({
            loading: true
        });
        axios.post("http://api.cardosh.uz/v1/restapi/login/", this.state.loginFields).then(res => {


            AsyncStorage.setItem("access", res.data.access, () => {
                AsyncStorage.getItem("access", (err, result) => {
                    if (err) {
                        Toast.show({
                            text: "Произошло ошибка!!",
                            buttonText: "Ok",
                            position: "top"
                        })
                    } else {
                        this.setState({
                            loading: false,
                        }, () => this.props.navigation.navigate('Home'));
// rooting to app

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
                type: "danger",
                position: "top"
            });
            this.props.navigation.navigate('Login')

        }).then(()=>{
            this.setState({
                loading: false
            });
        })
    };


    handlePhoneNum = (text) => {
        if (text.length >= 3) {
            this.setState(prevState => ({
                isPhoneNumFilled: true,
                fields: {
                    ...prevState.fields,
                    "phone_number": text
                }
            }));
        } else {

        }
    };


    handleDatePicker = (value) => {
        const dobStr = value.toString();
        const formattedDob = moment(dobStr).format("YYYY-MM-DD");
        this.setState(prevState => ({
            isDobFilled: true,
            fields: {
                ...prevState.fields,
                "dob": formattedDob
            }
        }));
    };
    handleMaleCheck = () => {
        this.setState(prevState => ({
            fields: {
                ...prevState.fields,
                "gender": 1
            }
        }));
    };
    handleFemaleCheck = () => {
        this.setState(prevState => ({
            fields: {
                ...prevState.fields,
                "gender": 2
            }
        }));
    };


    render() {
        const {navigate} = this.props.navigation;
        return (
            <Container style={{marginTop: Constants.statusBarHeight}}>

                <Content>

                    <ImageBackground
                        source={background}
                        style={[styles.container, styles.bg]}
                        resizeMode="cover"
                    >

                        <ProgressSteps
                            // activeStep={4}
                            borderWidth={2}>
                            <ProgressStep
                                nextBtnDisabled={!this.state.isEmailValid}
                                previousBtnText="Назад"
                                nextBtnText="Далее">
                                <View style={{alignItems: 'center'}}>
                                    <View style={styles.headerTitleView}>
                                        <Text style={styles.titleViewText}>Введите ваше эл. почту</Text>
                                    </View>
                                    <Item rounded
                                          error={this.state.isEmailExists}
                                          style={{
                                              backgroundColor: "#f6f6f6",
                                              paddingLeft: 10,
                                              marginBottom: 20,
                                              marginTop: 50
                                          }}>
                                        <Icon
                                            style={{color: '#ff6600'}}
                                            active name='mail'/>
                                        <Input
                                            placeholder="Эл. почта"
                                            onChangeText={(text) => this.handleEmailChange(text)}/>
                                    </Item>

                                    {this.state.loadingCheckEmail ? <Spinner/> : null}
                                    {this.state.isEmailExists ?
                                        <Text>Электронная почта уже зарегистрирована!</Text> : null}

                                    {/*<Text>Пожалуйста авторизуйтес или ввидите другю Эл. почту!</Text>*/}
                                            <View style={styles.signin}>
                                                <Text style={styles.greyFont}>Уже зарегистрированы?</Text>
                                                <TouchableOpacity
                                                    onPress={()=>this.props.navigation.navigate('Login')}
                                                    style={{marginTop: 20}}
                                                    >
                                                    <Text style={{fontWeight: 'bold', color: '#2673f6', fontSize: 20}}>Вход</Text>
                                                </TouchableOpacity>
                                            </View>

                                </View>
                            </ProgressStep>
                            <ProgressStep
                                nextBtnText="Далее"
                                previousBtnText="Назад"
                                nextBtnDisabled={!this.state.isPhoneNumFilled}
                            >
                                <View style={{alignItems: 'center'}}>
                                    <View style={styles.headerTitleView}>
                                        <Text style={styles.titleViewText}>Введите ваш номер телефона</Text>
                                    </View>
                                    <Item rounded
                                          style={{
                                              backgroundColor: "#f6f6f6",
                                              paddingLeft: 10,
                                              marginBottom: 20,
                                              marginTop: 50
                                          }}>
                                        <Icon
                                            style={{color: '#ff6600'}}
                                            active
                                            name='ios-phone-portrait'/>
                                        <Input
                                            defaultValue={this.state.fields.phone_number}
                                            keyboardType='numeric'
                                            placeholder="(__) 123 4567"
                                            onChangeText={(text) => this.handlePhoneNum(text)}/>
                                    </Item>
                                </View>
                            </ProgressStep>
                            <ProgressStep
                                nextBtnDisabled={!(this.state.isFirstNameFilled && this.state.isLastNameFilled && this.state.isDobFilled)}
                                nextBtnText="Далее"
                                previousBtnText="Назад">
                                <View style={{alignItems: 'center'}}>
                                    <View style={styles.headerTitleView}>
                                        <Text style={styles.titleViewText}>Введите ваша имя и фамилия</Text>
                                    </View>
                                    <Item rounded
                                          style={{
                                              backgroundColor: "#f6f6f6",
                                              paddingLeft: 10,
                                              marginBottom: 20,
                                              marginTop: 30
                                          }}>
                                        <Icon
                                            style={{color: '#ff6600'}}
                                            active
                                            name='ios-person'/>
                                        <Input
                                            placeholder="Имя"
                                            onChangeText={(text) => this.handleFirstNameChange(text)}/>
                                    </Item>
                                    <Item rounded
                                          style={{backgroundColor: "#f6f6f6", paddingLeft: 10, marginBottom: 20}}>
                                        <Icon
                                            style={{color: '#ff6600'}}
                                            active
                                            name='ios-person'/>
                                        <Input
                                            placeholder="Фамилия"
                                            onChangeText={(text) => this.handleLastNameChange(text)}/>
                                    </Item>

                                    <View style={styles.headerTitleView}>
                                        <Text style={styles.titleViewText}>Укажите ваш пол</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
                                        <CheckBox onPress={this.handleMaleCheck}
                                                  checked={this.state.fields.gender === 1} color='#ff6600'
                                                  style={{marginRight: 20}}/>
                                        <Text>Мужчина</Text>

                                        <CheckBox onPress={this.handleFemaleCheck}
                                                  checked={this.state.fields.gender === 2} color='#ff6600'
                                                  style={{marginLeft: 30, marginRight: 20}}/>
                                        <Text>Женшина</Text>
                                    </View>
                                    <View style={{marginTop: 20}}>
                                        <Text style={styles.titleViewText}>Когда вы родились?</Text>
                                    </View>
                                    <View style={styles.datePick}>
                                        <Icon
                                            style={{color: '#ff6600', marginTop: 7}}
                                            active
                                            name="calendar"/>
                                        <DatePicker
                                            value={this.state.fields.dob}
                                            timeZoneOffsetInMinutes={undefined}
                                            modalTransparent={false}
                                            animationType={"slide"}
                                            androidMode={"spinner"}
                                            placeHolderText="Укажите дату"
                                            textStyle={{color: "green"}}
                                            placeHolderTextStyle={{color: "#2420d3"}}
                                            onDateChange={this.handleDatePicker}
                                            disabled={false}
                                        />
                                    </View>


                                </View>
                            </ProgressStep>
                            <ProgressStep
                                previousBtnDisabled={this.state.loading}
                                onSubmit={this.handleSubmit}
                                nextBtnDisabled={!(this.state.isPasswordConfirmed && this.state.isPasswordValid)||this.state.loading}
                                previousBtnText="Назад"
                                finishBtnText="Закончить">
                                <View style={{alignItems: 'center'}}>
                                    <View style={styles.headerTitleView}>
                                        <Text style={styles.titleViewText}>Придумайте пароль</Text>
                                    </View>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: '#f65726'
                                    }}>
                                        Минимум 6 знаков!</Text>

                                    <Item rounded
                                          style={{
                                              backgroundColor: "#f6f6f6",
                                              paddingLeft: 10,
                                              marginBottom: 20,
                                              marginTop: 30
                                          }}>
                                        <Icon
                                            style={{color: this.state.isPasswordConfirmed ? 'green' : '#ff6600'}}
                                            active
                                            name={this.state.isPasswordConfirmed ? 'ios-unlock' : 'ios-lock'}/>
                                        <Input
                                            disabled={this.state.loading}
                                            secureTextEntry={true}
                                            placeholder="Введите пароль"
                                            onChangeText={(text) => this.handlePasswordChange(text)}/>
                                    </Item>
                                    <Item rounded
                                          style={{
                                              backgroundColor: "#f6f6f6",
                                              paddingLeft: 10,
                                              marginBottom: 20,
                                              marginTop: 30
                                          }}>
                                        <Icon
                                            style={{color: this.state.isPasswordConfirmed ? 'green' : '#ff6600'}}
                                            active
                                            name={this.state.isPasswordConfirmed ? 'ios-unlock' : 'ios-lock'}/>
                                        <Input
                                            disabled={!this.state.isPasswordValid || this.state.loading}
                                            secureTextEntry={true}
                                            placeholder="Подтверждите пароль"
                                            onChangeText={(text) => this.handlePassConfirm(text)}/>
                                    </Item>
                                    {this.state.loading ? <Spinner color='red' /> : null}
                                </View>
                            </ProgressStep>
                        </ProgressSteps>


                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    datePick: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        backgroundColor: '#fbf6ff',
        paddingLeft: 15,
        borderColor: '#7a7679',
        borderRadius: 50,
        borderStyle: 'solid',
        borderWidth: 1
    },
    container: {
        flex: 1,
    },
    bg: {
        width,
        height
    },

    headerTitleView: {
        backgroundColor: 'transparent',
        marginTop: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    titleViewText: {
        fontSize: 20,
        color: '#ca5021',
    },
    signin: {
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    greyFont: {
        color: '#3f3227',

    }
});
