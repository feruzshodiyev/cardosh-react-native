import React, {Component} from 'react';
import {Button, Container, Content, Form, Icon, Input, Item, Label, Radio, Row, Spinner} from "native-base";
import {AsyncStorage, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import axios from "axios";

class MyCar extends Component {

    static navigationOptions = {
        title: 'Мой автомобиль',
    };

    constructor(props){
        super(props);
        this.state={
            brand: '',
            car_model: '',
            color: '',
            gov_number: '',
            owner_id: null,

            loading: false,
            loadingModalVis: false,
            sendSuccess: false,
            sendError: false,
            loadError: false,
            hasCar: false,
            token: ''
        }
    }


    componentDidMount() {
        const {params} = this.props.navigation.state;
        const userId = params.userId;
        const token = params.token;
        console.log('userId: ', userId);
        this.setState({
            owner_id: userId,
            token: token
        }, ()=>this.loadInitial());


    }

    loadInitial=()=>{
        this.setState({
            loading: true,
            loadingModalVis: true,
            sendSuccess: false,
            sendError: false,
            loadError: false
        });
        console.log('id: ', this.state.owner_id);

        axios.get( `http://api.cardosh.uz/v1/restapi/user/detail/${this.state.owner_id}/`).then(res => {
            console.log(res.data);
            const user = res.data;
            const car = user.car;
            if (car){
                this.setState({
                    brand: car.brand,
                    car_model: car.car_model,
                    color: car.color,
                    gov_number: car.gov_number,
                    hasCar: true
                })
            }
            this.setState({
                loading: false,
                loadingModalVis: false,
            })
        }).catch(err => {
            console.log(err);

            this.setState({
                loading: false,
                loadError: true
            });
        })
    };

    handleSubmitCar = () => {

        this.setState({
            loading: true,
            loadingModalVis: true,
            sendSuccess: false,
            sendError: false
        });

        const userId = this.state.id;

        let formdata = new FormData();

        formdata.append('brand', this.state.brand);
        formdata.append('car_model', this.state.car_model);
        formdata.append('color', this.state.color);
        formdata.append('gov_number', this.state.gov_number);
        formdata.append('owner_id', this.state.owner_id);

        console.log('token: ',this.state.token);
        if (this.state.hasCar){
            axios.put(`http://api.cardosh.uz/v1/restapi/manage/car/`, formdata, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    loading: false,
                    sendSuccess: true,
                })

            }).catch(err => {
                console.log(err);
                this.setState({
                    loading: false,
                    sendError: true,
                })
            })
        } else {
            axios.post(`http://api.cardosh.uz/v1/restapi/manage/car/`, formdata, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    loading: false,
                    sendSuccess: true,
                })

            }).catch(err => {
                console.log(err);
                this.setState({
                    loading: false,
                    sendError: true,
                })
            })
        }

    };

    changeBrand = (text) => {
        this.setState({
            brand: text
        })
    };

    changeCarModel = (text) => {
        this.setState({
            car_model: text
        })
    };

    changeColor = (text) => {
        this.setState({
            color: text
        })
    };

    changeGovNum = (text) => {
        this.setState({
            gov_number: text
        })
    };

    closeLoadingModal=()=>{
        this.setState({
            loadingModalVis: false,
            sendError: false,
            loadError: false

        })
    };

    closeAfterSuccess=()=>{
        this.setState({
            loadingModalVis: false,
            sendSuccess: false

        })
    };



    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Марка</Label>
                            <Input onChangeText={text => this.changeBrand(text)}
                                   defaultValue={this.state.brand}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Модель</Label>
                            <Input onChangeText={text => this.changeCarModel(text)}
                                   defaultValue={this.state.car_model}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Цвет</Label>
                            <Input onChangeText={text => this.changeColor(text)} defaultValue={this.state.color}/>
                        </Item>

                        <Item stackedLabel>
                            <Label>Гос. номер</Label>
                            <Input onChangeText={text => this.changeGovNum(text)}
                                   defaultValue={this.state.gov_number}/>
                        </Item>

                    </Form>
                    <Button
                        onPress={() => this.handleSubmitCar()}
                        style={{width: 200, marginTop: 50, marginRight: 'auto', marginLeft: 'auto'}} block
                        warning><Text> Сохранить </Text></Button>


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
                                    onPress={() => this.handleSubmitCar()}
                                    style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                    {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                    <Icon style={{color: '#009fff'}} name="ios-redo"/>
                                </TouchableOpacity>
                            </View>

                        </View> : null}

                        {this.state.loadError ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, }}>
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
                                    onPress={() => this.loadInitial()}
                                    style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                    {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                    <Icon style={{color: '#009fff'}} name="ios-redo"/>
                                </TouchableOpacity>
                            </View>

                        </View> : null}

                        {this.state.sendSuccess ?
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
                                    <Text style={{marginTop: 15}}>Ваши данные успешно сохранен.</Text>
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
                </Content>
            </Container>
        );
    }
}

export default MyCar;