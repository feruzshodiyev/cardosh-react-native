import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet, TouchableOpacity,
    View
} from "react-native";
import {
    Button,
    Container,
    Content,
    Footer,
    FooterTab,
    Icon,
    Text,
    Header,
    Left,
    Body,
    Right,
    Title,
    Drawer,
    Thumbnail,
    List,
    ListItem,
    Badge, Spinner
} from "native-base";

import {Notifications} from 'expo';

import Constants from 'expo-constants';
import axios from "axios";

import registerForPushNotificationsAsync from '../utils/registerForPushNotificationsAsync';
import Modal from "react-native-modal";

const background = require("../assets/images/backg.png");
const logo = require("../assets/images/logo.png");
const {width, height} = Dimensions.get("window");
const defolt = require("../assets/images/default.png");


class AppScreen extends Component {
    interval = null;

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            token: '',
            newReq: 0,
            acceptedReq: 0,
            notification: {},
            logoutModalVis: false
        }
    }


    componentDidMount() {

        AsyncStorage.getItem("access").then(res => {

            this.setState({
                token: res
            }, () => this.getRequests());

            this.loadUser(res)
        });

        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = notification => {
        console.log("notification", notification);
        // do whatever you want to do with the notification
        this.setState({notification: notification});

        this.getRequests();

        if (notification.data.type === 1){
            this.props.navigation.navigate('MyRidesList', {
                token: this.state.token,
            });
            this.setState({
                newReq: 0,
            })
        }

        if (notification.data.type === 2) {
            this.props.navigation.navigate('MyOffers', {
                token: this.state.token,
            });
            this.setState({
                acceptedReq: 0,
            })
        }
    };


    getRequests = () => {

        if (this.state.token) {
            // Get count of new requests
            axios.get("http://api.cardosh.uz/v1/notifications/new/requests/number/", {
                headers: {
                    "Authorization": "Bearer " + this.state.token
                }
            }).then(res => {
                console.log("res1 ", res.data);
                this.setState({
                    newReq: res.data
                });
            }).catch(err => {
                console.log("New requests number error", err)
            });

            // Get count of accepted requests
            axios.get("http://api.cardosh.uz/v1/notifications/accepted/requests/number/", {
                headers: {
                    "Authorization": "Bearer " + this.state.token
                }
            }).then(res => {
                console.log("res2 ", res.data);
                this.setState({
                    acceptedReq: res.data
                });
            }).catch(err => {
                console.log("Accepted requests number error", err)
            });
        }
    };


    loadUser = (token) => {
        axios.get("http://api.cardosh.uz/v1/restapi/current_user/", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            console.log("res data: ", res.data);
            this.setState({
                user: res.data
            });

            registerForPushNotificationsAsync(res.data.id, token);

            AsyncStorage.setItem("user", JSON.stringify(res.data)).then(res => {

            }).catch(err => {
                AsyncStorage.getItem("user").then(result => {
                    const user = JSON.parse(result);
                    console.log('user: ', user);
                    this.setState({
                        user: user
                    })
                }).catch(err => {
                    console.log(err)
                });
            });
        }).catch(err => {
            AsyncStorage.getItem("user").then(result => {
                const user = JSON.parse(result);
                console.log('user: ', user);
                this.setState({
                    user: user
                })
            }).catch(err => {
                console.log(err)
            });
        })
    };


    closeDrawer = () => {
        this.drawer._root.close()
    };
    openDrawer = () => {
        this.drawer._root.open()
    };

    showLogoutModal=()=>{
        this.setState({
      logoutModalVis: true
        })
    };


    cancelLogout=()=>{
        this.setState({
      logoutModalVis: false
        })
    };

    logout = async () => {
        console.log('call');
        const token = await AsyncStorage.getItem("access");
        if (token) {
            // alert(token);
            await AsyncStorage.clear(() => this.props.navigation.navigate('Auth'))
        }
        this.props.navigation.navigate('Auth')
    };

    render() {
        const SideBar = () => {
            return (
                <Content style={{backgroundColor: '#FFFFFF'}}>
                    <ImageBackground source={logo} style={styles.mark2} resizeMode={"contain"}>
                        {/*<Thumbnail large  source={{uri: uri}} />*/}
                    </ImageBackground>
                    <List>
                        <ListItem itemHeader noIndent>

                            <Thumbnail
                                source={this.state.user.profile_image ? {uri: "http://api.cardosh.uz" + this.state.user.profile_image} : defolt}/>

                            <Body>
                                <Text>{this.state.user.first_name}</Text>
                                <Text note numberOfLines={1}>{this.state.user.email}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon type={"FontAwesome"} name="address-card-o"/>
                            <Left style={{marginLeft: 10}}>
                                <Text>Персональные данные</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </ListItem>

                        <ListItem onPress={() => this.props.navigation.navigate('PhotoProfile', {
                            userId: this.state.user.id,
                            token: this.state.token,
                            profile_image: this.state.user.profile_image,
                            reloadUser: () => this.loadUser(this.state.token)
                        })}>
                            <Icon type={"FontAwesome"} name="address-book-o"/>
                            <Left style={{marginLeft: 10}}>
                                <Text>Фото профиля</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </ListItem>

                        <ListItem onPress={() => this.props.navigation.navigate('MyCar', {
                            userId: this.state.user.id,
                            token: this.state.token
                        })}>
                            <Icon type={"FontAwesome"} name="car"/>
                            <Left style={{marginLeft: 10}}>
                                <Text>Мой автомобиль</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </ListItem>

                        {/*<ListItem onPress={() => this.props.navigation.navigate('Profile')}>*/}
                        {/*    <Icon type={"FontAwesome"} name="check"/>*/}
                        {/*    <Left style={{marginLeft: 10}}>*/}
                        {/*        <Text>Надежность пользователя</Text>*/}
                        {/*    </Left>*/}
                        {/*    <Right>*/}
                        {/*        <Icon name="arrow-forward"/>*/}
                        {/*    </Right>*/}
                        {/*</ListItem>*/}

                        {/*<ListItem onPress={() => this.props.navigation.navigate('Profile')}>*/}
                        {/*    <Icon type={"FontAwesome"} name="commenting-o"/>*/}
                        {/*    <Left style={{marginLeft: 10}}>*/}
                        {/*        <Text>Обратная связь</Text>*/}
                        {/*    </Left>*/}
                        {/*    <Right>*/}
                        {/*        <Icon name="arrow-forward"/>*/}
                        {/*    </Right>*/}
                        {/*</ListItem>*/}

                        <ListItem onPress={() => this.showLogoutModal()}>
                            <Icon type={"FontAwesome"} name="sign-out"/>
                            <Left style={{marginLeft: 10}}>
                                <Text>Выйти</Text>
                            </Left>
                            <Modal
                                isVisible={this.state.logoutModalVis}
                            >

                                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5,}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Icon style={{color: '#d3370e', fontSize: 35}} type={'MaterialIcons'}
                                              name="check-circle"/>
                                    </View>
                                    <View style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <Text style={{marginTop: 15}}>Вы действительно хотите выти?</Text>
                                    </View>

                                    <View style={{
                                        justifyContent: 'space-around',
                                        alignItems: 'center', flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => this.cancelLogout()}
                                            style={{width: 'auto', padding: 20}}>
                                            <Text style={{color: '#009fff'}}>Отмена</Text>
                                            {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.logout()}
                                            style={{width: 'auto', padding: 20}}>
                                            <Text style={{color: '#009fff'}}>Выйти</Text>
                                            {/*<Icon style={{color: '#009fff'}}  name="close"/>*/}
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </Modal>
                        </ListItem>
                    </List>

                </Content>
            );
        };
        return (
            // () => this.props.navigation.navigate('Profile')
            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                content={<SideBar navigator={this.navigator}/>}
                onClose={() => this.closeDrawer()}>
                <ImageBackground
                    source={background}
                    style={[styles.container, styles.bg]}
                    resizeMode="cover"
                >
                    <Container style={{backgroundColor: "transparent"}}>

                        <Header transparent style={styles.topbarStyle}>
                            <Left>
                                <Button transparent onPress={this.openDrawer}>
                                    <Icon type={"FontAwesome"} style={{fontSize: 40, color: '#ff4c0c'}}
                                          name="user-circle-o"/>
                                </Button>
                            </Left>
                            <Body>
                                <Title style={{color: '#ff4c0c'}}>Cardosh</Title>
                            </Body>
                            <Right>
                                {/*<Button transparent onPress={() => this.props.navigation.navigate('Notifications')}>*/}
                                {/*    <Icon type={"Feather"} style={{fontSize: 40, color: '#ff4c0c'}}*/}
                                {/*          name="message-square"/>*/}
                                {/*</Button>*/}
                            </Right>
                        </Header>

                        <Content style={styles.bg}>

                            {/*<View style={styles.markWrap}>*/}
                            {/*    <Image source={logo} style={styles.mark} resizeMode="contain"/>*/}
                            {/*</View>*/}


                        </Content>


                        <Footer style={{backgroundColor: '#ff4c0c'}}>
                            <FooterTab style={{backgroundColor: '#fbffff'}}>
                                <Button
                                    style={{minHeight: 80}}
                                    onPress={() => this.props.navigation.navigate('SearchPassenger', {
                                        userId: this.state.user.id,
                                        token: this.state.token
                                    })}
                                    light badge vertical>
                                    <Icon style={{color: '#ff4c0c'}} name="search"/>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>Найти
                                        пассажира</Text>
                                </Button>
                                <Button
                                    active
                                    style={{minHeight: 80}}
                                    onPress={() => {
                                        this.props.navigation.navigate('MyRidesList', {
                                            token: this.state.token,
                                        });
                                        this.setState({
                                            newReq: 0,
                                        })
                                    }}
                                    light badge vertical>
                                    {this.state.newReq > 0 ? <Badge><Text>{this.state.newReq}</Text></Badge> : null}
                                    <Icon style={{color: '#ff4c0c'}} type={'SimpleLineIcons'} name="location-pin"/>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>Мои</Text>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>заявки</Text>
                                </Button>
                                <Button
                                    style={{minHeight: 80}}
                                    onPress={() => {
                                        this.props.navigation.navigate('MyOffers', {
                                            token: this.state.token,
                                        });
                                        this.setState({
                                            acceptedReq: 0,
                                        })
                                    }
                                    }
                                    light badge vertical>
                                    {this.state.acceptedReq > 0 ?
                                        <Badge><Text>{this.state.acceptedReq}</Text></Badge> : null}
                                    <Icon style={{color: '#ff4c0c'}} type={'FontAwesome5'} name="car"/>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>Мои</Text>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>поездки</Text>
                                </Button>
                                <Button
                                    style={{minHeight: 80}}
                                    onPress={() => this.props.navigation.navigate('AddPassengerRide')}
                                    light badge vertical>
                                    <Icon style={{color: '#ff4c0c'}} type={'AntDesign'} name="pluscircleo"/>
                                    <Text style={{fontSize: 9, textAlign: 'center'}} uppercase={false}>Оставить
                                        заявку</Text>
                                </Button>
                            </FooterTab>
                        </Footer>

                    </Container>

                </ImageBackground>
            </Drawer>
        );
    }
}

let styles = StyleSheet.create({
    markWrap: {
        flex: 1,
        paddingVertical: '5%',
    },
    mark: {

        width: '100%',
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    mark2: {
        width: '100%',
        height: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: Constants.statusBarHeight,
        paddingTop: 50,
        paddingLeft: 20,
        // alignItems: "center",
        // justifyContent: "left",
        flex: 1,
    },
    profileStyle: {
        marginTop: 10,
        marginLeft: 20,

    },
    notificationStyle: {
        marginTop: 10,
        marginRight: 20,

    },
    topbarStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: Constants.statusBarHeight
    },
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

export default AppScreen;