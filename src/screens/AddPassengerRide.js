import React from 'react';
import {
    // Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    AsyncStorage,
    ImageBackground,
    Dimensions, KeyboardAvoidingView
} from 'react-native';
import Modal from "react-native-modal";
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
    Textarea
} from "native-base";
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from 'axios';
import NumericInput from 'react-native-numeric-input';

import Constants from 'expo-constants';
import moment from 'moment';

import InputAoutocompleteModal from '../components/InputAutocompleteModal';

const background = require("../assets/images/Groupbg.png");

const {width, height} = Dimensions.get("window");

class AddPassengerRide extends React.Component {
    static navigationOptions = {
        title: 'Оставить заявку',
        titleColor: '#6a130e',
        headerStyle: {
            backgroundColor: '#ffd1a7',

        },
        headerTintColor: '#6a130e',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#6a130e'
        },
    };

    constructor(props) {
        super(props);
        this.state = {

            offerTripFields: {
                'passenger': null,
                'fromm': "",
                'to': "",
                'peopleNumber': 1,
                'description': "",
                'fromID': "",
                'toID': "",
                "active_until": null
            },
            time: "",
            date: "",
            isDateVisible: false,
            showTime: false,
            modalVisible: {modal: null, visible: false},
            txtModal: false,
            txtAreaTmp: "",
            loadingModalVis: false,
            loading: false,
            sendError: false,
            sendSuccess: false


        }
    }

    componentDidMount() {
        AsyncStorage.getItem("access", (err, res) => {

            axios.get("http://api.cardosh.uz/v1/restapi/current_user/", {
                headers: {
                    'Authorization': 'Bearer ' + res
                }
            }).then(response => {
                this.setState(prevState => ({
                    offerTripFields: {
                        ...prevState.offerTripFields,
                        "passenger": response.data.id,
                    }
                }));
            }).catch(reason => {
                Alert.alert(
                    'Ошибка интернета!',
                    'У вас нет соеденения с сервером.',
                    [
                        {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
                    ],
                    { cancelable: false }
                )
            })
        })
    }

    showDatePicker = () => {
        this.setState({
            isDateVisible: true
        })
    };


    hideDatePicker = () => {
        this.setState({
            isDateVisible: false
        })
    };



    handleDate1Picker = (val) => {


        const formattedDate = moment(val).format("YYYY-MM-DD");

        this.setState({
            date: formattedDate
        }, ()=>{

            if (this.state.time && this.state.date){
                this.mergeDateAndTime();
            }
            this.hideDatePicker()
        });


    };


    mergeDateAndTime=()=>{

        const dateTime = this.state.date+' '+this.state.time;

        console.log('date time: ', dateTime);

        this.setState(prevState => ({
            offerTripFields: {
                ...prevState.offerTripFields,
                "active_until": dateTime,
            }
        }));
    };

    showTimePicker = () => {
        this.setState({
            showTime: true
        })
    };

    handleTimePicker = (val) => {
        // console.log(moment(val).format("HH:mm"));
        const formattedTime = moment(val).format("HH:mm");

        this.setState({
            time: formattedTime
        }, ()=>{
            if (this.state.time && this.state.date){
                this.mergeDateAndTime();
            }
            this.hideTimePicker();
        })

    };

    hideTimePicker = () => {
        this.setState({
            showTime: false
        })
    };


    openModal = (modal) => {
        this.setState({
            modalVisible: {modal: modal, visible: true}
        })
    };

    closeModal = () => {
        this.setState({
            modalVisible: {modal: null, visible: false}
        })
    };


    handleSelectTo = (data) => {

        this.setState(prevState => ({
            offerTripFields: {
                ...prevState.offerTripFields,
                'to': data.description,
                'toID': data.place_id,
            },

        }));
        this.closeModal();
    };

    handleSelectFrom = (data) => {
        console.log(data);
        this.setState(prevState => ({
            offerTripFields: {
                ...prevState.offerTripFields,
                'fromm': data.description,
                'fromID': data.place_id
            }
        }));
        this.closeModal()
    };

    handlePassengerNum = (value) => {
        this.setState(prevState => ({
            offerTripFields: {
                ...prevState.offerTripFields,
                'peopleNumber': value,
            }
        }), () => console.log("num", this.state.offerTripFields))
    };



    handleSendFields = () => {

        const fields = this.state.offerTripFields;
        console.log('fields: ', JSON.stringify(fields));


        if (fields.fromm && fields.to && fields.active_until && fields.peopleNumber > 0) {

            let formData = new FormData();

            formData.append('passenger', fields.passenger);
            formData.append('fromm', fields.fromm);
            formData.append('to', fields.to);
            formData.append('peopleNumber', fields.peopleNumber);
            formData.append('description', fields.description);
            formData.append('fromID', fields.fromID);
            formData.append('toID', fields.toID);
            formData.append('active_until', fields.active_until);


            this.setState({
                loadingModalVis: true,
                loading: true,
                sendSuccess: false,
                sendError: false
            });
            axios.post('http://api.cardosh.uz/v1/restapi/ride/create/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer '+localStorage.getItem(ACCESS_TOKEN)
                }

            }).then(res => {
                console.log(res);
                this.setState({
                    loading: false,
                    sendSuccess: true
                })
// handle success
            }).catch(err => {
                console.log(err);
               this.setState({
                   loading: false,
                   sendError: true
               })

            })
        } else {
            alert("Все поля не заполнены!")
        }
    };

    openTextAreaModal=()=>{
        this.setState({
            txtModal: true
        })
    };

    closeTextAreaModal=()=>{
        this.setState({
            txtModal: false
        })
    };

    handleTextArea=(text)=>{
        this.setState({
            txtAreaTmp: text
        })
    };

    handleDescription = () => {
        this.setState(prevState => ({
            offerTripFields: {
                ...prevState.offerTripFields,
                'description': this.state.txtAreaTmp,
            }
        }), () => this.closeTextAreaModal())
    };

    closeLoadingModal=()=>{
        this.setState({
            loadingModalVis: false,
            sendError: false

        })
    };
    closeAfterSuccess=()=>{
        this.setState({
            loadingModalVis: false,
            sendSuccess: false

        }, ()=>this.props.navigation.navigate('Home'))
    };


    render() {

        const date = moment(this.state.date).format('DD.MM.YYYY')

        return (

            <ImageBackground
                source={background}
                style={[styles.bg]}
                resizeMode="cover"
            >

                <View style={{paddingTop: Constants.statusBarHeight}}>
                    <Button
                        transparent
                        style={styles.buttonStyle2}

                        onPress={() => this.openModal(1)}
                    >
                        <Icon style={{color: '#ff4c0c', fontSize: 30}} type={'Entypo'} name="location-pin"/>
                        <Text style={{color: '#62200a'}}>
                            {this.state.offerTripFields.fromm ? this.state.offerTripFields.fromm : "Откуда?"}
                        </Text>
                        <Icon style={{color: '#ff4c0c'}} type={'Feather'} name="chevrons-right"/>
                    </Button>


                    <View
                        style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: 300,
                            borderBottomColor: '#ff9759',
                            borderBottomWidth: 1,
                        }}
                    />
                    <InputAoutocompleteModal
                        title="Где бы вы хотели, чтобы вас забрали?"
                        modalVisible={this.state.modalVisible.modal === 1 && this.state.modalVisible.visible}
                        destination="Например: Ташкент"
                        onClose={() => this.closeModal()}
                        handleValue={(data) => this.handleSelectFrom(data)}
                    />


                    <Button
                        transparent
                        style={styles.buttonStyle2}
                        onPress={() => this.openModal(2)}
                    >

                        <Icon style={{color: '#ff4c0c', fontSize: 30}} type={'Entypo'} name="location-pin"/>
                        <Text style={{color: '#62200a'}}>
                            {this.state.offerTripFields.to ? this.state.offerTripFields.to : "Куда?"}
                        </Text>
                        <Icon style={{color: '#ff4c0c'}} type={'Feather'} name="chevrons-left"/>
                    </Button>

                    <InputAoutocompleteModal
                        title="Где бы вы хотели, чтобы вас высадили?"
                        modalVisible={this.state.modalVisible.modal === 2 && this.state.modalVisible.visible}
                        destination="Например: Шахрисабз"
                        onClose={() => this.closeModal()}
                        handleValue={(data) => this.handleSelectTo(data)}
                    />
                </View>



                <View style={styles.dateTimeCont}>

                    <TouchableOpacity
                        style={styles.timePic}
                        onPress={this.showDatePicker}
                    >
                        <Text style={styles.btnText}>{this.state.date ? date: 'Дата'} </Text><Icon style={styles.btnText} type={"AntDesign"} name='calendar'/>

                    </TouchableOpacity>

                    <DateTimePicker
                        isVisible={this.state.isDateVisible}
                        onConfirm={this.handleDate1Picker}
                        onCancel={this.hideDatePicker}
                        mode={'date'}
                    />

                    <TouchableOpacity
                        style={styles.timePic}
                    onPress={this.showTimePicker}
                    >
                        <Text style={styles.btnText}>{this.state.time ? this.state.time : 'Время'}</Text><Icon style={styles.btnText} name='md-time'/>

                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={this.state.showTime}
                        is24Hour={true}
                        onConfirm={this.handleTimePicker}
                        onCancel={this.hideTimePicker}
                        mode={'time'}
                        display={"spinner"}
                    />
                </View>

                <View style={{paddingTop: 40}}>
                    <Text style={{marginLeft:'auto', marginRight: 'auto', color:'#62200a'}}>Число пассажиров</Text>
                    <View style={styles.numericInputstyle}>
                        <NumericInput
                            onChange={(value) => this.handlePassengerNum(value)}
                            rounded
                            initValue={1}
                            rightButtonBackgroundColor='#ff6600'
                            rightButtonTextColor='#fff'
                            leftButtonBackgroundColor='#ff6600'
                            iconStyle={{color: '#fff'}}
                            textColor='#ff6600'
                            totalWidth={120}
                            totalHeight={45}
                            iconSize={40}
                        />

                    </View>

                    <View>
                        <View style={{  flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 20}}>
                            <Icon style={{color: '#62200a', fontSize: 25}} type={'AntDesign'} name="infocirlceo"/>
                            <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize:15}}> Дополнительно:</Text>
                        </View>
                        <TouchableOpacity
                            onPress={this.openTextAreaModal}
                            style={{width: '90%', minHeight: 50, maxHeight: 150, backgroundColor:'#ff883c', padding:10, borderRadius:20,marginLeft: 'auto',
                            marginRight: 'auto',}}>
                            <Text style={{color:'white'}}>
                                {this.state.offerTripFields.description ? this.state.offerTripFields.description : 'Указать подробнее информацию'}
                            </Text>
                        </TouchableOpacity>
                        <Modal
                            isVisible={this.state.txtModal}
                            animationIn={'zoomInDown'}
                            animationOut={'zoomOutUp'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={1000}
                            backdropTransitionOutTiming={1000}
                        >
                            <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, }}>
                                <View style={{  flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Icon style={{color: '#62200a', fontSize: 25}} type={'AntDesign'} name="infocirlceo"/>
                                    <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize:15}}> Дополнительно:</Text>
                                </View>
                                <Textarea
                                    defaultValue={this.state.offerTripFields.description}
                                    onChangeText={(text => this.handleTextArea(text))}
                                    rowSpan={5}
                                    bordered
                                    placeholder={"Укажите, например:\n- место отправления и прибытия;\n - возможность взять багаж;"} />
                                <View style={{justifyContent: 'space-around',
                                    alignItems: 'center',flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        onPress={this.closeTextAreaModal}
                                        style={{width: 'auto', padding: 20}}>
                                        <Text style={{color: '#009fff'}}>Закрыть</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.handleDescription}
                                        style={{width: 'auto', padding: 20}}>
                                        <Text style={{color: '#009fff'}}>Ok</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>



                        </Modal>
                    </View>

                    <View style={{width: 200, marginRight: 'auto', marginLeft: 'auto', marginTop: 30}}>
                        <Button
                            onPress={this.handleSendFields}
                            block style={{borderRadius: 20}}>
                            <Text>Оформить</Text>
                        </Button>
                    </View>

                    <Modal
                        isVisible={this.state.loadingModalVis}
                    >
                        {this.state.loading ? <Spinner/> : null}

                        {this.state.sendError ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, }}>
                            <View style={{  flexDirection: 'row',
                                marginLeft: 'auto',
                                marginRight: 'auto'}}>
                                <Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'} name="error-outline"/>
                                <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize:20}}>Ошибка интернета</Text>
                            </View>
                            <View style={{
                                marginLeft: 'auto',
                                marginRight: 'auto'}}>
                                <Text style={{marginTop: 15}}>У вас нет соеденения с сервером.</Text>
                            </View>

                            <View style={{justifyContent: 'space-around',
                                alignItems: 'center',flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={this.closeLoadingModal}
                                    style={{width: 'auto', padding: 20}}>
                                    {/*<Text style={{color: '#009fff'}}>Закрыть</Text>*/}
                                    <Icon style={{color: '#009fff'}}  name="close"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.handleSendFields}
                                    style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                    {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                    <Icon style={{color: '#009fff'}} name="ios-redo"/>
                                </TouchableOpacity>
                            </View>

                        </View> : null}

                        {
                            this.state.sendSuccess ?
                                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, }}>
                                    <View style={{  flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'}}>
                                        <Icon style={{color: '#00d3a3', fontSize: 35}} type={'MaterialIcons'} name="check-circle"/>
                                        <Text style={{color: '#00d3a3', marginTop: 5, marginLeft: 5, fontSize:20}}>Успешно сохранен!</Text>
                                    </View>
                                    <View style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'}}>
                                        <Text style={{marginTop: 15}}>Ваша заявква успешно сохранен.</Text>
                                    </View>

                                    <View style={{justifyContent: 'space-around',
                                        alignItems: 'center',flexDirection: 'row'}}>
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

                </View>



            </ImageBackground>


        );
    }
}

const styles = {
    dateTimeCont: {
        flexDirection: 'row',
        paddingTop: 40,
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    timePic: {
        width: '48%',
        maxWidth: 300,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ff6600',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 20
    },
    btnText: {
      color: 'white',
      fontWeight: 'bold'
    },
    bg: {
        flex: 1,
        width,
        height,
    },
    calendarStyle: {
        width: '80%',
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    buttonStyle: {
        marginTop: 30,
        backgroundColor: '#ff6600',
        borderRadius: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 12,
        paddingBottom: 12,
        width: '80%'
    },
    buttonStyle2: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 12,
        paddingBottom: 12,
        width: 350
    },
    inputStyle: {
        width: '60%',
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    numericInputstyle: {
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    numberOfPassengersStyle: {
        color: '#545454',
        fontSize: 20,
        marginTop: 10,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto'

    }


};

export default AddPassengerRide;

