import React, {Component} from 'react';
import {AsyncStorage, FlatList, TouchableOpacity, View} from "react-native";
import axios from 'axios';
import {
    Content,
    Icon,
    Spinner,
    Container,
    Header,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text,
    Button
} from "native-base";
import {} from 'native-base';
import Modal from "react-native-modal";

const defolt = require("../assets/images/default.png");


class OffersForRide extends Component {

    static navigationOptions = {
        title: 'Предложения к данной заявке',
    };


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingModalVis: false,
            sendSuccess: false,
            sendError: false,
            loadError: false,
            requests: null,
            preview: false,
            selectedItem: {},
            dealError: false,
            token: ''
        }
    }

    componentDidMount() {
        this.getReqList();

        AsyncStorage.getItem("access").then(res => {

            this.setState({
                token: res
            });
        });
    }


    getReqList = () => {
        this.showLoadingModal();
        const {params} = this.props.navigation.state;
        const itemId = params.itemId;

        this.setState({
            loading: true,
        });

        axios.get(`http://api.cardosh.uz/v1/restapi/${itemId}/request/list/`).then(res => {
            this.setState({
                requests: res.data,
            }, this.closeLoadingModal);
            console.log(res)
        }).catch(err => {
            this.showError();
        })
    };

    dealRide = (id) => {
        this.showLoadingModal();
        axios.put(`http://api.cardosh.uz/v1/restapi/${id}/request/deal/`).then(res => {

            this.setState({
                loading: false,
                dealSuccess: true
            });
            this.getReqList();
        }).catch(err => {

            this.setState({
                loading: false,
                dealError: true,
            });
            console.log(err)
        })
    };

    closeLoadingModal = () => {
        this.setState({
            loadingModalVis: false,
            loading: false,
            sendError: false,


        })
    };


    showLoadingModal = () => {
        this.setState({
            loadingModalVis: true,
            loading: true,
            sendError: false,
            preview: false

        })
    };

    closeAfterSuccess = () => {
        this.setState({
            loadingModalVis: false,
            sendSuccess: false

        })
    };

    closeAfterSuccessDeny = () => {
        this.setState({
            loadingModalVis: false,
            sendSuccess: false
        }, () => this.getReqList())
    };

    showError = () => {
        this.setState({
            loading: false,
            sendError: true

        })
    };

    showPreview = (item) => {

        console.log('item: ', item);
        this.setState({
            loadingModalVis: true,
            preview: true,
            selectedItem: item
        });

        if (!item.is_viewed) {
            axios.put(`http://api.cardosh.uz/v1/notifications/clean/${item.id}/request/`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token
                }
            }).then(res => {
                console.log(res);

            }).catch(err => {
                console.log(err);
            })
        }
    };

    hidePreview = () => {
        this.setState({
            loadingModalVis: false,
            preview: false
        })
    };

    showSuccess = () => {
        this.setState({
            loading: false,
            sendSuccess: true

        })
    };

    render() {

        const Items = (props) => {
            const item = props.item;
            const driver = item.driverID;
            const car = driver.car;

            return (
                <ListItem avatar onPress={() => this.showPreview(item)}>
                    <Left>
                        <Thumbnail source={driver.profile_image ? {uri: driver.profile_image} : defolt}/>
                    </Left>
                    <Body>
                        <Text>{driver.first_name + "  " + driver.last_name}</Text>
                        <Text note>Предлагаемая цена: {item.price}</Text>
                        <Text note>Автомобиль: {car.brand + " " + car.car_model}</Text>
                    </Body>
                    <Right>
                        {!item.is_viewed ? <Text style={{color: "#cc300f", fontSize: 10}}>Новое!</Text> : null}
                        {item.is_dealed ? <Text style={{color: "#33cc33", fontSize: 10}}>Принято!</Text> : null}

                    </Right>
                </ListItem>
            )

        };

        return (
            <View style={{flex: 1}}>

                {this.state.requests ?
                    this.state.requests.length > 0 ? <FlatList
                            // ListHeaderComponent={<Text style={{
                            //     marginLeft: 'auto',
                            //     marginRight: 'auto'
                            // }}>{this.state.requests.length} pred</Text>}
                            data={this.state.requests}
                            renderItem={({item}) => <Items item={item}/>}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{flexGrow: 1}}
                        /> :
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#ff6600', marginTop: 50}}>Нет предложений!</Text>
                        </View> : null
                }

                <Modal
                    isVisible={this.state.loadingModalVis}
                >
                    {this.state.loading ? <Spinner/> : null}

                    {this.state.sendError ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'} name="error-outline"/>
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
                                onPress={() => this.getReqList()}
                                style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                <Icon style={{color: '#009fff'}} name="ios-redo"/>

                            </TouchableOpacity>
                        </View>

                    </View> : null}

                    {this.state.dealError ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'} name="error-outline"/>
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
                        </View>

                    </View> : null}

                    {this.state.preview ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            {/*<Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'} name="error-outline"/>*/}
                            <Text style={{
                                color: '#62200a',
                                marginTop: 5,
                                marginLeft: 5,
                                fontSize: 20
                            }}>{this.state.selectedItem.driverID.first_name + " " + this.state.selectedItem.driverID.last_name}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{marginTop: 15}}>Цена: </Text>
                            <Text style={{marginTop: 15}}>{this.state.selectedItem.price}</Text>
                        </View>
                        {this.state.selectedItem.is_dealed === true ?

                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}>
                                <Text style={{marginTop: 15}}>Тел: </Text>
                                <Text style={{marginTop: 15}}>{this.state.selectedItem.driverID.phone_number}</Text>
                            </View> : <View style={{
                                flexDirection: 'row',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}>
                                <Text style={{marginTop: 15, fontSize: 10, color: '#ff6600'}}>Тел. номер будет виден для
                                    принятых заявок!</Text>
                            </View>
                        }


                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{marginTop: 15, color: '#ff6600'}}>Автомобиль: </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{}}>Марка: </Text>
                            <Text style={{}}>{this.state.selectedItem.driverID.car.brand}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{}}>Модел: </Text>
                            <Text style={{}}>{this.state.selectedItem.driverID.car.car_model}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{}}>Модел: </Text>
                            <Text style={{}}>{this.state.selectedItem.driverID.car.color}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Text style={{}}>Гос. номер: </Text>
                            <Text style={{}}>{this.state.selectedItem.driverID.car.gov_number}</Text>
                        </View>


                        <View style={{
                            justifyContent: 'space-around',
                            alignItems: 'center', flexDirection: 'row'
                        }}>
                            <TouchableOpacity
                                onPress={this.hidePreview}
                                style={{width: 'auto', padding: 20}}>
                                <Text style={{color: '#009fff'}}>Закрыть</Text>
                                {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                            </TouchableOpacity>

                            {this.state.selectedItem.is_dealed === null ?
                                <TouchableOpacity
                                    onPress={() => this.dealRide(this.state.selectedItem.id)}
                                    style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                    <Text style={{color: '#009fff'}}>Принять</Text>
                                    {/*<Icon style={{color: '#009fff'}} name="ios-redo"/>*/}

                                </TouchableOpacity> : null
                            }

                        </View>

                    </View> : null}


                    {this.state.dealSuccess ?
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
                                <Text style={{marginTop: 15}}>Вы приняли предложение!</Text>
                            </View>

                            <View style={{
                                justifyContent: 'space-around',
                                alignItems: 'center', flexDirection: 'row'
                            }}>
                                <TouchableOpacity
                                    onPress={this.closeAfterSuccessDeny}
                                    style={{width: 'auto', padding: 20}}>
                                    <Text style={{color: '#009fff'}}>Закрыть</Text>
                                    {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                                </TouchableOpacity>
                            </View>

                        </View> : null
                    }

                </Modal>
            </View>
        );
    }
}

export default OffersForRide;