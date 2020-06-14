import React from 'react';
import {AsyncStorage, Text, TouchableOpacity, View} from 'react-native';
import {
    Container,
    Header,
    Footer,
    Content,
    Form,
    Item,
    Label,
    Input,
    Row,
    Radio,
    Left,
    Button,
    Spinner, Icon
} from "native-base"

import axios from 'axios';
import Modal from "react-native-modal";

class Profile extends React.Component {
    static navigationOptions = {
        title: 'Мои персональные данные',
    };

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            dob: '',
            phone_number: '',
            gender: 1,
            id: null,
            token: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("user").then(result => {

            const user = JSON.parse(result);
            console.log('user: ', user);
            this.setState({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                dob: user.dob,
                phone_number: user.phone_number,
                gender: user.gender,
                id: user.id,

                loadingModalVis: false,
                loading: false,
                sendError: false,
                sendSuccess: false
            })
        }).catch(err => {
            console.log(err)
        });

        AsyncStorage.getItem('access').then(res => {
            console.log('access: ', res)
            this.setState({
                token: res
            })
        }).catch(err => {

        });

    }

    handleSubmitGeneral = () => {

        this.setState({
            loading: true,
            loadingModalVis: true,
            sendSuccess: false,
            sendError: false
        });

        const userId = this.state.id;

        let formdata = new FormData();

        formdata.append('first_name', this.state.first_name);
        formdata.append('last_name', this.state.last_name);
        formdata.append('email', this.state.email);
        formdata.append('phone_number', this.state.phone_number);
        formdata.append('gender', this.state.gender);

console.log('token: ',this.state.token);
        axios.put(`http://api.cardosh.uz/v1/restapi/user/${userId}/update/`, formdata, {
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
    };

    changeFirstName = (text) => {
        this.setState({
            first_name: text
        })
    };

    changeLastName = (text) => {
        this.setState({
            last_name: text
        })
    };

    changeEmail = (text) => {
        this.setState({
            email: text
        })
    };

    changePhoneNum = (text) => {
        this.setState({
            phone_number: text
        })
    };

    changeGender = (num) => {
        this.setState({
            gender: num
        })
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

        })
    };


    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Имя</Label>
                            <Input onChangeText={text => this.changeFirstName(text)} disabled
                                   defaultValue={this.state.first_name}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Фамилия</Label>
                            <Input onChangeText={text => this.changeLastName(text)}
                                   defaultValue={this.state.last_name}/>
                        </Item>
                        <Item stackedLabel>
                            <Label>Эл. почта</Label>
                            <Input onChangeText={text => this.changeEmail(text)} defaultValue={this.state.email}/>
                        </Item>

                        <Item stackedLabel>
                            <Label>Моб. телефон</Label>
                            <Input onChangeText={text => this.changePhoneNum(text)}
                                   defaultValue={this.state.phone_number}/>
                        </Item>

                        <Item stackedLabel last>
                            <Label>Пол</Label>
                            <Row style={{paddingTop: 10}}>
                                <Row>
                                    <Text>Мужчина</Text>
                                    <Radio
                                        onPress={() => this.changeGender(1)}
                                        selected={this.state.gender === 1}
                                    />
                                </Row>

                                <Row>
                                    <Text>Женщина</Text>
                                    <Radio
                                        onPress={() => this.changeGender(2)}
                                        selected={this.state.gender === 2}
                                    />
                                </Row>
                            </Row>
                        </Item>
                    </Form>
                    <Button
                        onPress={() => this.handleSubmitGeneral()}
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
                                    onPress={() => this.handleSubmitGeneral()}
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

export default Profile;