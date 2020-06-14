import React from 'react';
import {AsyncStorage, Dimensions, FlatList, ImageBackground, TouchableOpacity, View} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Left, Spinner, Tab, Tabs, Text, Badge} from "native-base";
import axios from 'axios';
const background = require("../assets/images/Groupbg.png");
const {width, height} = Dimensions.get("window");
import Constants from 'expo-constants';
import Modal from "react-native-modal";

import moment from "moment";

class MyRidesList extends React.Component {

    constructor(props){
        super(props);
         this.state={
             active: [],
             history: [],
             token: '',

             loading: false,
             loadingModalVis: false,
             sendSuccess: false,
             sendError: false,
             loadError: false,
             showHistory: false,
             selectedHistoryItem: {}
         }
    }

    componentDidMount() {

        // this.getLocalActiveRides();
        // this.getLocalHistoryRides();

        this.init();

        this.getAcceptedList();
    }


init=()=>{
    const {params} = this.props.navigation.state;
    const token = params.token;

    this.setState({
        loading: true,
        loadingModalVis: true,
    });

    axios.get("http://api.cardosh.uz/v1/restapi/own/ride/list/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(res => {
        console.log('resp init: ',res);
        this.setState({
            active: res.data
        });
        // this.saveLocallyActiveRides(res.data)

    }).catch(err => {
        console.log('error init: ',err);
    });
};

    getAcceptedList = () => {

        const {params} = this.props.navigation.state;
        const token = params.token;

        axios.get("http://api.cardosh.uz/v1/restapi/accepted/list/passenger/", {
            headers: {
                "Authorization": "Bearer " +token
            }
        }).then(res => {
            this.setState({
                loading: false,
                loadingModalVis: false,
                history: res.data,
            });
            // this.saveLocallyHistoryRides(res.data);
            console.log('resp accept: ',res);

        }).catch(err => {
            console.log('error accept: ',err);
            this.showError();
      })
    };



    saveLocallyActiveRides = (data) => {
        AsyncStorage.setItem("activeRides", JSON.stringify(data)).then(res=>{

        }).catch(err=>{

        })
    };


    getLocalActiveRides=()=>{

        AsyncStorage.getItem("activeRides").then(result => {
            const rides = JSON.parse(result);
            console.log('rides: ', rides);
            this.setState({
                active: rides
            });
        }).catch(err => {
            console.log(err)
        });

    };

    saveLocallyHistoryRides = (data) => {
        AsyncStorage.setItem("activeRides", JSON.stringify(data)).then(res=>{

        }).catch(err=>{

        })
    };


    getLocalHistoryRides=()=>{

        AsyncStorage.getItem("activeRides").then(result => {
            const rides = JSON.parse(result);
            console.log('rides: ', rides);
            this.setState({
                history: rides
            });
        }).catch(err => {
            console.log(err)
        });

    };



    closeLoadingModal=()=>{
        this.setState({
            loadingModalVis: false,
            loading: false,
            sendError: false

        })
    };

    closeHistory=()=>{
        this.setState({
            loadingModalVis: false,
            showHistory: false
        })
    };

    showError=()=>{
        this.setState({
            loading: false,
            sendError: true

        })
    };


    showDetails=(item)=>{
      this.setState({
          loadingModalVis: true,
          loading: false,
          showHistory: true,
          selectedHistoryItem: item
      })
    };


    render() {


        const ResultMapper = (props) => {
            const item = props.item;

            const date = item.active_until;
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
                        // justifyContent: 'center',
                        // alignItems: 'center'
                    }}>

                    </View>
                    <View style={{
                        // flexDirection: "row",
                        width: '60%',
                        marginRight: 'auto',
                        marginLeft: 10,
                    }}>
                        <View style={{ flexDirection: "row", marginRight: 'auto', marginLeft: 'auto'}}>
                            <Text style={{fontWeight: 'bold', color: '#ff4c0c'}}>{item.fromm}</Text>
                            <Icon style={{color: '#1cffc9'}} type={'Feather'} name="chevrons-right"/>
                            <Text style={{fontWeight: 'bold', color: '#ff4c0c'}}>{item.to}</Text>
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
                            marginLeft: 'auto',
                            marginRight: 'auto',}]}>
                            <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="calendar"/>
                            <Text style={{color: '#62200a', fontSize: 15}}>{date1} г.</Text>
                            <Icon style={{color: '#62200a',fontSize: 20, marginLeft: 10}} type={'Ionicons'} name="md-time"/>
                            <Text style={{color: '#62200a',fontSize: 15}}>{time1}</Text>
                        </View>
                        <View style={{}}>
                            <Text style={{fontSize: 10, fontWeight: 'bold', color: '#62200a'}}>{item.peopleNumber} пассажир</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '96%'}}>
                            <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="infocirlceo"/>
                            <Text style={{color: '#62200a', fontSize:11}}> {item.description}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        badge
                        onPress={() => {
                            this.props.navigation.navigate('OffersForRide', {
                                itemId: item.id
                            });
                        }}
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
                        {item.requests_number > 0 ?
                            <Badge style={{position: 'absolute', top: 0, right: 0}}>
                            <Text>{item.requests_number}</Text>
                        </Badge> : <Text  style={{position: 'absolute'}}/>}

                        <Icon style={{ fontWeight: 'bold', color: '#ff4c0c'}} type={"FontAwesome5"} name={"angle-right"}/>
                    </TouchableOpacity>
                </View>)
        };


        const ResultMapperHistory = (props) => {
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
                        <View style={{ flexDirection: "row", marginRight: 'auto', marginLeft: 'auto'}}>
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
                            <Icon style={{color: '#62200a',fontSize: 20, marginLeft: 10}} type={'Ionicons'} name="md-time"/>
                            <Text style={{color: '#62200a',fontSize: 15}}>{time1}</Text>
                        </View>
                        <View style={{}}>
                            <Text style={{fontSize: 10, fontWeight: 'bold', color: '#62200a'}}>{item.passengerID.peopleNumber} пассажир</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '96%'}}>
                            <Icon style={{color: '#62200a', fontSize: 20}} type={'AntDesign'} name="infocirlceo"/>
                            <Text style={{color: '#62200a', fontSize:11}}> {item.passengerID.description}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => this.showDetails(item)}
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
                        <Icon style={{ fontWeight: 'bold', color: '#ff4c0c'}} type={"FontAwesome5"} name={"angle-right"}/>
                    </TouchableOpacity>
                </View>)
        };



           const Tab1 = () => {
               return (
                   <View style={{backgroundColor: "transparent"}}>
                       {this.state.active.length > 0 ? <FlatList
                           // ListHeaderComponent={<Text style={{
                           //     marginLeft: 'auto',
                           //     marginRight: 'auto'
                           // }}>{this.state.active.length} заявки</Text>}
                           data={this.state.active}
                           renderItem={({item}) => <ResultMapper item={item}/>}
                           keyExtractor={item => item.id}
                           contentContainerStyle={{flexGrow: 1}}
                       /> : null}
                   </View>
               )
           };

           const Tab2 = () => {
               return (
                   <View style={{backgroundColor: "transparent"}}>
                       {this.state.history.length > 0 ? <FlatList
                           // ListHeaderComponent={<Text style={{
                           //     marginLeft: 'auto',
                           //     marginRight: 'auto'
                           // }}>{this.state.active.length} заявки</Text>}
                           data={this.state.history}
                           renderItem={({item}) => <ResultMapperHistory item={item}/>}
                           keyExtractor={item => item.id}
                           contentContainerStyle={{flexGrow: 1}}
                       /> : null}
                   </View>
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
                            <Button onPress={()=>this.props.navigation.goBack()}
                                    transparent>
                                <Icon style={{color: '#6a130e'}} name={"arrow-back"}/></Button>
                        </Left>
                        <Body>
                            <Text style={{color: '#6a130e', fontWeight: 'bold'}}>Мои заявки</Text>
                        </Body>
                    </Header>
                    <Tabs
                        tabBarUnderlineStyle={{height: 1, backgroundColor: '#6a130e'}}
                        tabContainerStyle={{height: 30, elevation: 0}}>
                        <Tab
                            style={{backgroundColor: "transparent"}}
                            activeTabStyle={{backgroundColor: '#ffd1a7'}}
                            tabStyle={{backgroundColor: '#ffd1a7'}}
                            activeTextStyle={{color: '#6a130e'}}
                            textStyle={{color: '#6a130e'}}
                            heading="Активные заявки">
                            <Tab1/>
                        </Tab>
                        <Tab
                            style={{backgroundColor: "transparent"}}
                            activeTabStyle={{backgroundColor: '#ffd1a7'}}
                            tabStyle={{backgroundColor: '#ffd1a7'}}
                            activeTextStyle={{color: '#6a130e'}}
                            textStyle={{color: '#6a130e'}}
                            heading="История">
                            <Tab2/>
                        </Tab>
                    </Tabs>

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

                        {this.state.showHistory ?
                            <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, }}>
                                <View style={{  flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    {/*<Icon style={{color: '#62200a', fontSize: 35}} type={'MaterialIcons'} name="error-outline"/>*/}
                                    <Text style={{color: '#62200a', marginTop: 5, marginLeft: 5, fontSize:20}}>{this.state.selectedHistoryItem.driverID.first_name+" "+this.state.selectedHistoryItem.driverID.last_name}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{marginTop: 15}}>Цена: </Text>
                                    <Text style={{marginTop: 15}}>{this.state.selectedHistoryItem.price}</Text>
                                </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'}}>
                                        <Text style={{marginTop: 15}}>Тел: </Text>
                                        <Text style={{marginTop: 15}}>{this.state.selectedHistoryItem.driverID.phone_number}</Text>
                                    </View>


                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{marginTop: 15, color: '#ff6600'}}>Автомобиль: </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{}}>Марка: </Text>
                                    <Text style={{}}>{this.state.selectedHistoryItem.driverID.car.brand}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{}}>Модел: </Text>
                                    <Text style={{}}>{this.state.selectedHistoryItem.driverID.car.car_model}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{}}>Модел: </Text>
                                    <Text style={{}}>{this.state.selectedHistoryItem.driverID.car.color}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'}}>
                                    <Text style={{}}>Гос. номер: </Text>
                                    <Text style={{}}>{this.state.selectedHistoryItem.driverID.car.gov_number}</Text>
                                </View>

                                <View style={{justifyContent: 'space-around',
                                    alignItems: 'center',flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        onPress={this.closeHistory}
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
        maxWidth:500,
        minHeight: 140,
        backgroundColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        display: 'flex',
    },
};



export default MyRidesList;