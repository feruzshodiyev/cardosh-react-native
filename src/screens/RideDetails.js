import React, {Component} from 'react';
import {
    AsyncStorage,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,

    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import {TextInputMask} from "react-native-masked-text";
import {Madoka} from "react-native-textinput-effects";
import Modal from "react-native-modal";

import axios from "axios";
import Constants from 'expo-constants';
import moment from "moment";
import localization from 'moment/locale/ru';

moment.locale('ru', localization);

const background = require("../assets/images/Groupbg.png");

const {width, height} = Dimensions.get("window");
import {
    Container,
    Content,
    Button,
    Icon,
    Text,
    Header,
    Left,
    Body,
    Title,
    Right,
    List,
    Item,
    Spinner,
    Toast,
    Thumbnail
} from "native-base";

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

class RideDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: '',

            loading: false,
            loadingModalVis: false,
            sendSuccess: false,
            sendError: false,
            noCar: false
        }
    }


    offerPrice = () => {


        const {params} = this.props.navigation.state;

        const token = params.token;
        const userId = params.userId;

        const item = params.item;

        const price = this.state.price;


        let formData = new FormData();
        formData.append("price", price + 'сум');
        formData.append("passengerID", item.id);


        if (price) {

            this.setState({
                loading: true,
                loadingModalVis: true,
            });

            axios.get("http://api.cardosh.uz/v1/restapi/" + userId + "/user/car/").then(res => {
                if (res.data.car !== null) {
                    axios.post("http://api.cardosh.uz/v1/restapi/request/make/", formData, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }).then(res => {
                        console.log(res)

                        this.setState({
                            sendSuccess: true,
                            loading: false,
                        })

                    }).catch(err => {
                        console.log(err)
                        this.setState({
                            sendError: true,
                            loading: false,
                        })

                    })
                } else {
                    this.setState({
                        loading: false,
                        noCar: true
                    })

                }
            }).catch(err => {
                this.setState({
                    sendError: true,
                    loading: false,
                })
            });
        } else {
            Toast.show({
                text: "Вы не указали цену!!",
                buttonText: "Окей",
                position: "top",
                duration: 7000,
                type: "danger"
            })
        }


    };

    redirectToAddCar = () => {
        const {params} = this.props.navigation.state;
        const token = params.token;
        const userId = params.userId;

        this.props.navigation.navigate('MyCar', {
            userId: userId,
            token: token
        });

        this.closeLoadingModal()
    };


    closeLoadingModal = () => {
        this.setState({
            loadingModalVis: false,
            sendError: false,
            noCar: false

        })
    };

    closeAfterSuccess = () => {
        this.setState({
            loadingModalVis: false,
            sendSuccess: false
        });

        this.props.navigation.goBack();
    };

    render() {
        const {navigation} = this.props;
        const item = navigation.state.params.item;

        const date = item.active_until;

        const time1 = moment(date).format("HH:mm");

        const date1 = moment(date).format("llll").split("г.,")[0] + 'г.';

        return (

            <ImageBackground
                source={background}
                style={[styles.bg,]}
                resizeMode="cover"
            >

                <Container style={{backgroundColor: "transparent"}}>


                    <Content>
                        <KeyboardAvoidingView style={styles.container} behavior="height" keyboardVerticalOffset={60}>
                            <KeyboardAwareScrollView>

                                {/*<Text style={{fontWeight: 'bold', marginLeft: 20, color: '#ff6600', fontSize: 25, marginTop: 10}}>Заявка пасажира</Text>*/}
                                <View
                                    style={styles.modalHdr}
                                >
                                    <Icon style={{color: '#ff4c0c'}} type={'Entypo'} name="location-pin"/>
                                    <Text style={{color: '#ab350c', fontWeight: 'bold'}}>
                                        {item.fromm}
                                    </Text>
                                    <Icon style={{color: '#0fbe73', marginRight: 10, marginLeft: 10}} type={'Feather'}
                                          name="chevrons-right"/>
                                    <Text style={{color: '#ab350c', fontWeight: 'bold'}}>
                                        {item.to}
                                    </Text>
                                    <Icon style={{color: '#ff4c0c'}} type={'Entypo'} name="location-pin"/>

                                </View>

                                <View
                                    style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: 300,
                                        borderBottomColor: '#ff9759',
                                        borderBottomWidth: 1,
                                    }}
                                />


                                <View style={[{width: '80%'}, styles.modalHdr]}>
                                    <Icon style={{color: '#62200a', fontSize: 30}} type={'AntDesign'} name="calendar"/>
                                    <Text style={{
                                        color: '#62200a',
                                        marginLeft: 10,
                                        marginTop: 5,
                                        fontSize: 15
                                    }}>{date1}</Text>
                                    <Icon style={{color: '#62200a', fontSize: 30, position: 'absolute', right: 50}}
                                          type={'Ionicons'} name="md-time"/>
                                    <Text style={{
                                        color: '#62200a',
                                        marginLeft: 10,
                                        marginTop: 5,
                                        fontSize: 15,
                                        position: 'absolute',
                                        right: 0
                                    }}>{time1}</Text>
                                </View>

                                <View style={[{width: '80%'}, styles.modalHdr]}>
                                    {item.passenger.profile_image ?
                                        <Thumbnail source={{uri: item.passenger.profile_image}}/> :
                                        <Icon style={{color: '#62200a', fontSize: 50}} type={'Ionicons'}
                                              name="ios-person"/>
                                    }

                                    <Text style={{
                                        color: '#62200a',
                                        marginTop: 10,
                                        marginLeft: 20,
                                        fontSize: 20
                                    }}>{item.passenger.first_name + " " + item.passenger.last_name}</Text>
                                </View>
                                <View style={[{width: '80%'}, styles.modalHdr]}>
                                    <Icon style={{color: '#62200a', fontSize: 50}} type={'MaterialCommunityIcons'}
                                          name="seatbelt"/>
                                    <Text style={{
                                        color: '#62200a',
                                        marginTop: 10,
                                        marginLeft: 20,
                                        fontSize: 20
                                    }}>{item.peopleNumber} место(а)</Text>
                                </View>

                                <View style={[styles.modalHdr]}>
                                    <Icon style={{color: '#62200a', fontSize: 25}} type={'AntDesign'}
                                          name="infocirlceo"/>
                                    <Text style={{
                                        color: '#62200a',
                                        marginTop: 5,
                                        marginLeft: 5,
                                        fontSize: 15
                                    }}> Дополнительно:</Text>
                                </View>
                                <View style={{
                                    width: '80%',
                                    minHeight: 50,
                                    backgroundColor: '#eac795',
                                    padding: 10,
                                    borderRadius: 20,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}>
                                    <Text>{item.description}
                                    </Text>
                                </View>
                                <View style={[{width: '80%'}, styles.modalHdr]}>
                                    <Icon style={{color: '#62200a', fontSize: 30}} type={'FontAwesome'} name="money"/>
                                    <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize: 15}}> Укажите
                                        цену:</Text>
                                </View>

                                <View>

                                    <View style={{
                                        width: '80%', marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}>
                                        <TextInputMask
                                            type={'money'}
                                            options={{
                                                precision: 0,
                                                separator: ' ',
                                                delimiter: ' ',
                                                unit: '',
                                                suffixUnit: ''
                                            }}

                                            customTextInput={Madoka}
                                            customTextInputProps={{
                                                style: {width: '100%', marginBottom: 10},
                                                label: 'сум'
                                            }}
                                            value={this.state.price}
                                            onChangeText={text => {
                                                this.setState({
                                                    price: text
                                                })
                                            }}
                                        />
                                    </View>

                                    <Button
                                        warning
                                        onPress={() => this.offerPrice()}
                                        style={{
                                            justifyContent: 'center',
                                            borderRadius: 20,
                                            width: 300,
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}>
                                        <Text uppercase={false}>Предложите свою поездку</Text></Button>


                                </View>


                            </KeyboardAwareScrollView>
                        </KeyboardAvoidingView>

                        <Modal
                            isVisible={this.state.loadingModalVis}
                        >
                            {this.state.loading ? <Spinner/> : null}

                            {this.state.sendError ?
                                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'}
                                              name="error-outline"/>
                                        <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize: 20}}>Ошибка
                                            интернета</Text>
                                    </View>
                                    <View style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Text style={{marginTop: 15}}>У вас нет соеденения с сервером.</Text>
                                    </View>

                                    <View style={{
                                        justifyContent: 'space-around',
                                        alignItems: 'center', flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity
                                            onPress={this.closeLoadingModal}
                                            style={{width: 'auto', padding: 20}}>
                                            {/*<Text style={{color: '#009fff'}}>Закрыть</Text>*/}
                                            <Icon style={{color: '#009fff'}} name="close"/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.offerPrice()}
                                            style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                            {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                            <Icon style={{color: '#009fff'}} name="ios-redo"/>
                                        </TouchableOpacity>
                                    </View>

                                </View> : null}

                            {this.state.noCar ?
                                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Icon style={{color: '#ffa662', fontSize: 35}} type={'MaterialIcons'}
                                              name="error-outline"/>
                                        <Text style={{color: '#ffa662', marginTop: 5, marginLeft: 5, fontSize: 20}}>Нет
                                            машины!</Text>
                                    </View>
                                    <View style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Text style={{marginTop: 15}}>У нас нет данных о вашей машине.</Text>
                                    </View>

                                    <View style={{
                                        justifyContent: 'space-around',
                                        alignItems: 'center', flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity
                                            onPress={this.closeLoadingModal}
                                            style={{width: 'auto', padding: 20}}>
                                            {/*<Text style={{color: '#009fff'}}>Закрыть</Text>*/}
                                            <Icon style={{color: '#009fff'}} name="close"/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.redirectToAddCar()}
                                            style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                            <Text style={{color: '#009fff'}}>добавить машину</Text>
                                            {/*<Icon style={{color: '#009fff'}} name="ios-redo"/>*/}
                                        </TouchableOpacity>
                                    </View>

                                </View> : null}

                            {this.state.sendSuccess ?
                                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Icon style={{color: '#00d3a3', fontSize: 35}} type={'MaterialIcons'}
                                              name="check-circle"/>
                                        <Text style={{color: '#00d3a3', marginTop: 5, marginLeft: 5, fontSize: 20}}>Успешно
                                            сохранен!</Text>
                                    </View>
                                    <View style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Text style={{marginTop: 15}}>Вы успешно предложоили вашу поездку.</Text>
                                    </View>

                                    <View style={{
                                        justifyContent: 'space-around',
                                        alignItems: 'center', flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity
                                            onPress={this.closeAfterSuccess}
                                            style={{width: 'auto', padding: 20}}>
                                            <Text style={{color: '#009fff'}}>Закрыть</Text>
                                            {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                                        </TouchableOpacity>
                                    </View>

                                </View> : null
                            }

                        </Modal>

                    </Content>


                </Container>

            </ImageBackground>

        );
    }
}

const styles = {
    modalHdr: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20

    },
    resultsStyle: {
        marginTop: 10,
        borderRadius: 20,
        width: 380,
        height: 70,
        backgroundColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        display: 'flex',
    },
    topbarStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: Constants.statusBarHeight
    },
    searchViewStyle: {
        marginTop: 20,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    textStyle: {
        fontSize: 20,
    },
    buttonStyle: {
        marginTop: 20,
        backgroundColor: '#ff6600',
        borderRadius: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 12,
        paddingBottom: 12,
        width: '70%'
    },

    buttonStyle2: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 350
    },

    searchfieldStyle: {
        marginTop: 30

    },
    bg: {
        flex: 1,
        width,
        height,
    },
};

export default RideDetails;