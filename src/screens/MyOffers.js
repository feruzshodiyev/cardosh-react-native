import React, {Component} from 'react';

import {
    Container,
    Header,
    Tabs,
    Tab,
    Content,
    Text,
    Left,
    Body,
    Button,
    Icon,
    Spinner,
    Thumbnail,
    Badge
} from 'native-base';
import {AsyncStorage, Dimensions, FlatList, ImageBackground, TouchableOpacity, View} from "react-native";


const background = require("../assets/images/Groupbg.png");
const {width, height} = Dimensions.get("window");
import Constants from 'expo-constants';
import Modal from "react-native-modal";
import moment from "moment";
import axios from 'axios';


const defolt = require("../assets/images/default.png");

class MyOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            loading: false,
            loadingModalVis: false,
            loadError: false,
            showDetails: false,
            selectedItem: null
        }
    }


    componentDidMount() {

        this.init()

    }


    init = () => {
        this.setState({
            loading: true,
            loadingModalVis: true,
        });

        const {params} = this.props.navigation.state;
        const token = params.token;

        axios.get("http://api.cardosh.uz/v1/restapi/accepted/list/driver/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            console.log(res);
            this.setState({
                dataList: res.data,
            }, () => this.closeLoadingModal())
        }).catch(err => {
            this.showError()
        })
    };


    closeLoadingModal = () => {
        this.setState({
            loadingModalVis: false,
            loading: false,
            loadError: false,
            showDetails: false,

        })
    };


    showError = () => {
        this.setState({
            loading: false,
            loadError: true
        })
    };

    showdetails = (item) => {

        const {params} = this.props.navigation.state;
        const token = params.token;

        this.setState({
            loadingModalVis: true,
            loading: false,
            showDetails: true,
            selectedItem: item
        });

        if (!item.dealed_viewed){
            axios.put(`http://api.cardosh.uz/v1/notifications/clean/${item.id}/accepted/request/`, {}, {
                headers: {
                    "Authorization" : "Bearer "+token
                }
            }).then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    };

    render() {
        let date1 = '';
        let time1 = '';
        if (this.state.selectedItem) {
            const item = this.state.selectedItem;

            const date = item.passengerID.active_until;
            //
            date1 = moment(date).format("llll").split("г.,")[0]
            time1 = moment(date).format("HH:mm");
        }


        const ResultMapper = (props) => {
            const item = props.item;

            const date = item.passengerID.active_until;
            //
            const date1 = moment(date).format("llll").split("г.,")[0]
            const time1 = moment(date).format("HH:mm");

            return (
                <View style={styles.resultsStyle}>
                    <View style={{
                        backgroundColor: '#ff8818',
                        width: 15,
                        height: '100%',
                        borderBottomLeftRadius: 20,
                        borderTopLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    </View>
                    <View style={{
                        // flexDirection: "row",
                        width: 290,
                        marginRight: 'auto',
                        marginLeft: 10,
                    }}>
                        <View style={{flexDirection: "row", marginRight: 'auto', marginLeft: 'auto'}}>
                            <Text style={{fontWeight: 'bold', color: '#ff4c0c'}}>{item.passengerID.fromm}</Text>
                            <Icon style={{color: '#1cffc9'}} type={'Feather'} name="chevrons-right"/>
                            <Text style={{fontWeight: 'bold', color: '#ff4c0c'}}>{item.passengerID.to}</Text>
                        </View>
                        <View
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: 150,
                                borderBottomColor: '#ff9759',
                                borderBottomWidth: 1,
                            }}
                        />

                        <View style={[{
                            marginTop: 7,
                            flexDirection: 'row',
                            // marginLeft: 'auto',
                            // marginRight: 'auto',
                        }]}>
                            <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="calendar"/>
                            <Text style={{color: '#62200a', fontSize: 15}}>{date1} г.</Text>
                            <Icon style={{color: '#62200a', fontSize: 20, marginLeft: 10}} type={'Ionicons'}
                                  name="md-time"/>
                            <Text style={{color: '#62200a', fontSize: 15}}>{time1}</Text>
                        </View>
                        <View style={{}}>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#62200a'
                            }}>{item.passengerID.peopleNumber} пассажир</Text>
                        </View>

                        <View style={{flexDirection: 'row', width: '96%'}}>
                            <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="infocirlceo"/>
                            <Text style={{color: '#62200a', fontSize: 11}}> {item.passengerID.description}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => this.showdetails(item)}
                        style={{
                            backgroundColor: 'rgba(133,170,188,0.19)',
                            width: 50,
                            right: 0,
                            position: 'absolute',
                            height: '100%',
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {!item.dealed_viewed ?
                            <Text style={{
                                position: 'absolute',
                                transform: [{rotate: '50deg'}],
                                top: 10,
                                right: 0,
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#036340'
                            }}>
                                новый!
                            </Text> : <Text style={{position: 'absolute'}}/>}
                        <Icon style={{fontWeight: 'bold', color: '#ff4c0c'}} type={"FontAwesome5"}
                              name={"angle-right"}/>
                    </TouchableOpacity>
                </View>)
        };


        const Tab1 = () => {
            return (
                <Content style={{backgroundColor: "transparent"}}>
                    {this.state.dataList.length > 0 ? <FlatList
                        // ListHeaderComponent={<Text style={{
                        //     marginLeft: 'auto',
                        //     marginRight: 'auto'
                        // }}>{this.state.active.length} заявки</Text>}
                        data={this.state.dataList}
                        renderItem={({item}) => <ResultMapper item={item}/>}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{flexGrow: 1}}
                    /> : null}
                </Content>
            )
        };

        const Tab2 = () => {
            return (
                <Content style={{backgroundColor: "transparent"}}>
                    <Text>Tab2</Text>
                </Content>
            )
        };

        return (
            <ImageBackground
                source={background}
                style={[styles.bg]}
                resizeMode="cover"
            >

                <Container style={{backgroundColor: "transparent"}}>
                    <Header
                        style={{backgroundColor: '#ffd1a7', marginTop: Constants.statusBarHeight}}
                        hasTabs>
                        <Left>
                            <Button onPress={() => this.props.navigation.goBack()}
                                    transparent>
                                <Icon style={{color: '#6a130e'}} name={"arrow-back"}/></Button>
                        </Left>
                        <Body>
                            <Text style={{color: '#6a130e', fontWeight: 'bold'}}>Принятые предложения</Text>
                        </Body>
                    </Header>
                    {/*<Tabs*/}

                    {/*    tabBarUnderlineStyle={{height: 1, backgroundColor: '#6a130e'}}*/}
                    {/*    tabContainerStyle={{height: 30, elevation: 0}}>*/}
                    {/*    <Tab*/}
                    {/*        style={{backgroundColor: "transparent"}}*/}
                    {/*        activeTabStyle={{backgroundColor: '#ffd1a7'}}*/}
                    {/*        tabStyle={{backgroundColor: '#ffd1a7'}}*/}
                    {/*        activeTextStyle={{color: '#6a130e'}}*/}
                    {/*        textStyle={{color: '#6a130e'}}*/}
                    {/*        heading="Активные заявки">*/}
                    {/*        <Tab1/>*/}
                    {/*    </Tab>*/}
                    {/*    <Tab*/}
                    {/*        style={{backgroundColor: "transparent"}}*/}
                    {/*        activeTabStyle={{backgroundColor: '#ffd1a7'}}*/}
                    {/*        tabStyle={{backgroundColor: '#ffd1a7'}}*/}
                    {/*        activeTextStyle={{color: '#6a130e'}}*/}
                    {/*        textStyle={{color: '#6a130e'}}*/}
                    {/*        heading="История">*/}
                    {/*        <Tab2/>*/}
                    {/*    </Tab>*/}
                    {/*</Tabs>*/}

                    <View style={{backgroundColor: "transparent"}}>
                        {this.state.dataList.length > 0 ? <FlatList
                            // ListHeaderComponent={<Text style={{
                            //     marginLeft: 'auto',
                            //     marginRight: 'auto'
                            // }}>{this.state.active.length} заявки</Text>}
                            data={this.state.dataList}
                            renderItem={({item}) => <ResultMapper item={item}/>}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{flexGrow: 1}}
                        /> : null}
                    </View>

                    <Modal
                        isVisible={this.state.loadingModalVis}
                    >
                        {this.state.loading ? <Spinner/> : null}

                        {this.state.loadError ? <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
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
                                    onPress={() => this.init()}
                                    style={{width: 'auto', padding: 20, flexDirection: 'row'}}>
                                    {/*<Text style={{color: '#009fff'}}>Сново</Text>*/}
                                    <Icon style={{color: '#009fff'}} name="ios-redo"/>
                                </TouchableOpacity>
                            </View>

                        </View> : null}

                        {this.state.showDetails ?
                            <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <Thumbnail
                                        source={this.state.selectedItem.passengerID.passenger.profile_image ? {uri: "http://api.cardosh.uz" + this.state.selectedItem.passengerID.passenger.profile_image} : defolt}/>
                                    <Text style={{
                                        color: '#62200a',
                                        marginTop: 5,
                                        marginLeft: 5,
                                        fontSize: 20
                                    }}>{this.state.selectedItem.passengerID.passenger.first_name + " " + this.state.selectedItem.passengerID.passenger.last_name}</Text>
                                </View>

                                <View style={{flexDirection: "row", marginRight: 'auto', marginLeft: 'auto'}}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: '#ff4c0c'
                                    }}>{this.state.selectedItem.passengerID.fromm}</Text>
                                    <Icon style={{color: '#1cffc9'}} type={'Feather'} name="chevrons-right"/>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: '#ff4c0c'
                                    }}>{this.state.selectedItem.passengerID.to}</Text>
                                </View>

                                <View style={[{
                                    marginTop: 7,
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }]}>

                                    <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="calendar"/>
                                    <Text style={{color: '#62200a', fontSize: 15}}>{date1} г.</Text>
                                    <Icon style={{color: '#62200a', fontSize: 20, marginLeft: 10}} type={'Ionicons'}
                                          name="md-time"/>
                                    <Text style={{color: '#62200a', fontSize: 15}}>{time1}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <Text style={{marginTop: 15, color: '#ff6600'}}>Количество пассажиров: </Text>
                                    <Text
                                        style={{marginTop: 15}}>{this.state.selectedItem.passengerID.peopleNumber}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <Text style={{color: '#ff6600', marginTop: 15}}>Тел: </Text>
                                    <Text
                                        style={{marginTop: 15}}>{this.state.selectedItem.passengerID.passenger.phone_number}</Text>
                                </View>


                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <Text style={{color: '#ff6600'}}>Подробнее: </Text>
                                    <Text>{this.state.selectedItem.passengerID.description}</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <Text style={{color: '#ff6600'}}>Цена: </Text>
                                    <Text style={{}}>{this.state.selectedItem.price}</Text>
                                </View>


                                <View style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'center', flexDirection: 'row'
                                }}>
                                    <TouchableOpacity
                                        onPress={this.closeLoadingModal}
                                        style={{width: 'auto', padding: 20}}>
                                        <Text style={{color: '#009fff'}}>Закрыть</Text>
                                        {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                                    </TouchableOpacity>
                                </View>

                            </View> : null
                        }

                    </Modal>
                </Container>
            </ImageBackground>
        );
    }


}

const styles = {
    bg: {
        flex: 1,
        width,
        height,
    },
    resultsStyle: {
        marginTop: 10,
        borderRadius: 20,
        width: '90%',
        minHeight: 140,
        backgroundColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        display: 'flex',
    },
};

export default MyOffers;