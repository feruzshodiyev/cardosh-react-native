import React from 'react';
import InputAoutocompleteModal from '../components/InputAutocompleteModal';
import {
    View,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    FlatList,
} from 'react-native';
import axios from "axios";
import Constants from 'expo-constants';
import moment from "moment/moment";
import {
    Container,
    Button,
    Icon,
    Text,
    Header,
    Body,
    Spinner,
    Toast
} from "native-base";


const background = require("../assets/images/Groupbg.png");

const {width, height} = Dimensions.get("window");

class SearchPassenger extends React.Component {

    static navigationOptions = {
        title: 'Найти пассажира',
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

            token: '',
            userId: '',
            from: '',
            to: '',
            fromId: "",
            toId: "",
            results: [],
            modalVisible: {modal: null, visible: false},
            loading: false,
            popular: []
        }
    }


    handleSelectTo = (data) => {

        this.setState({
            to: data.description,
            toId: data.place_id

        });
        this.closeModal();
    };

    handleSelectFrom = (data) => {
        console.log(data);
        this.setState({

            from: data.description,
            fromId: data.place_id

        });
        this.closeModal();
    };

    openModal = (modal) => {
        this.setState({
            modalVisible: {modal: modal, visible: true}
        })
    };

    closeModal = () => {
        this.setState({
            modalVisible: {modal: null, visible: false}
        }, () => {
            if (this.state.from && this.state.to) {
                this.getResults();
            }
        });


    };

    componentDidMount() {

        const {params} = this.props.navigation.state;
        const token = params.token;
        const userId = params.userId;

        this.setState({
            token,
            userId
        });

        axios.get("http://api.cardosh.uz/v1/restapi/popular/").then(res => {
            console.log("popular: ", res);

            this.setState({
                popular: res.data
            })


        }).catch(err => {

        })

    }

    getResults = () => {
        this.setState({
            loading: true,
            results: [],
            emptyResult: false
        });
        axios.get('http://api.cardosh.uz/v1/restapi/ride/search/', {
            params: {
                fromID: this.state.fromId,
                toID: this.state.toId
            }
        }).then(res => {

            const results = res.data;

            if (results.length === 0) {
                this.setState({
                    emptyResult: true
                }, () => {
                    this.setState({
                        loading: false
                    });
                })
            } else {
                console.log(results);
                this.setState({
                    results: results,
                }, () => {
                    this.setState({
                        loading: false,
                    });
                })
            }

        }).catch(err => {
            this.setState({
                loading: false,
            });
            Toast.show({
                text: "Произошло ошибка!",
                buttonText: "Окей",
                position: "top",
                duration: 10000,
                type: "danger"
            })
        })
    };


    searchPopular = (item) => {
        this.setState({
            from: item.fromm,
            fromId: item.fromID,
            to: item.to,
            toId: item.toID,
        }, ()=>
        this.getResults()
        );
    };


    render() {
        const {navigate} = this.props.navigation;


        const ResultMapper = (props) => {

            const date = props.item.active_until;

            const date1 = moment(date).format("DD.MM");
            const time1 = moment(date).format("HH:mm");

            return (
                <View style={styles.resultsStyle}>
                    <View style={{
                        backgroundColor: '#ff8818',
                        width: '15%',
                        height: 70,
                        borderBottomLeftRadius: 20,
                        borderTopLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white'}}>{date1}</Text>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white'}}>{time1}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        paddingLeft: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{width: '30%',}}>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#ff4c0c'}}>{props.item.fromm}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#ff4c0c'}}>{props.item.to}</Text>
                        </View>
                        <View style={{width: '10%'}}>
                            <Icon style={{color: '#ff4c0c', fontSize: 18}} type={'Feather'} name="chevrons-right"/>
                            <Icon style={{color: '#ff4c0c', fontSize: 18}} type={'Feather'} name="chevrons-left"/>
                        </View>
                        <View style={{width: '30%',}}>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#ff4c0c'
                            }}>{props.item.peopleNumber} пассажир</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('RideDetails', {
                                item: props.item,
                                token: this.state.token,
                                userId: this.state.userId
                            });
                        }}
                        style={{
                            backgroundColor: 'rgba(133,170,188,0.19)',
                            width: '20%',
                            right: 0,
                            position: 'absolute',
                            height: 70,
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={{fontSize: 10, fontWeight: 'bold', color: '#ff4c0c'}}
                              uppercase={false}>детали</Text>
                    </TouchableOpacity>
                </View>
            )

        };

        const Popular = (props) => {

            return (
                <View style={styles.resultsStyle}>
                    <View style={{
                        backgroundColor: '#ff8818',
                        width: '5%',
                        height: 70,
                        borderBottomLeftRadius: 20,
                        borderTopLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                    </View>
                    <View style={{
                        flexDirection: "row",
                        paddingLeft: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Text style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#ff4c0c',
                            marginLeft: 10
                        }}>{props.item.fromm}</Text>

                        <Icon style={{color: '#ff4c0c', fontSize: 20, marginLeft: 10}} type={'Feather'}
                              name="chevrons-right"/>

                        <Text style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#ff4c0c',
                            marginLeft: 10
                        }}>{props.item.to}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.searchPopular(props.item)}
                        style={{
                            backgroundColor: 'rgba(133,170,188,0.19)',
                            width: '20%',
                            right: 0,
                            position: 'absolute',
                            height: 70,
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={{fontSize: 10, fontWeight: 'bold', color: '#ff4c0c'}}
                              uppercase={false}>Перейти</Text>
                    </TouchableOpacity>
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
                    <Header transparent style={{height: 90}}>
                        <Body>
                            <Button
                                transparent
                                style={styles.buttonStyle2}

                                onPress={() => this.openModal(1)}
                            >
                                <Icon style={{color: '#ff4c0c', fontSize: 30}} type={'Entypo'} name="location-pin"/>
                                <Text style={{color: '#ff4c0c'}}>
                                    {this.state.from ? this.state.from : "Откуда?"}
                                </Text>
                                <Icon style={{color: '#ff4c0c'}} type={'Feather'} name="chevrons-right"/>
                            </Button>
                            <View
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '90%',
                                    borderBottomColor: '#ff9759',
                                    borderBottomWidth: 1,
                                }}
                            />

                            <InputAoutocompleteModal
                                title="Откуда вы выезжаете?"
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
                                <Text style={{color: '#ff4c0c'}}>
                                    {this.state.to ? this.state.to : "Куда?"}
                                </Text>
                                <Icon style={{color: '#ff4c0c'}} type={'Feather'} name="chevrons-left"/>
                            </Button>

                            <InputAoutocompleteModal
                                title="Куда вы едете?"
                                modalVisible={this.state.modalVisible.modal === 2 && this.state.modalVisible.visible}
                                destination="Например: Шахрисабз"
                                onClose={() => this.closeModal()}
                                handleValue={(data) => this.handleSelectTo(data)}
                            />
                            {/*{this.state.results.length > 1 ? <Text style={{*/}
                            {/*        marginLeft: 'auto',*/}
                            {/*        marginRight: 'auto',*/}
                            {/*    color:'#602b00',*/}
                            {/*    fontWeight:'bold'*/}
                            {/*    }}>{this.state.results.length} заявки</Text> : null}*/}
                        </Body>
                    </Header>
                    <View style={styles.bg}>

                        {this.state.loading ? <Spinner color='#ff4c0c'/> : null}
                        {this.state.results.length > 0 ? <FlatList
                            // ListHeaderComponent={<Text style={{
                            //     marginLeft: 'auto',
                            //     marginRight: 'auto'
                            // }}>{this.state.results.length} заявки</Text>}
                            data={this.state.results}
                            renderItem={({item}) => <ResultMapper item={item}/>}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{flexGrow: 1}}
                        /> : null}
                        {this.state.emptyResult ?
                            <View
                                style={{
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    marginTop: '50%'
                                }}>
                                <Text style={{color: '#ff4c0c'}}>По этому маршруту ничего не найдено!</Text>
                            </View> : null}

                        {!this.state.loading &&
                        this.state.results.length === 0 && !this.state.emptyResult && this.state.popular.length > 0 ?
                            <FlatList
                                ListHeaderComponent={<Text style={{
                                    marginTop: 20,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    color: '#bc3505',
                                    fontWeight: 'bold'
                                }}>Популярные маршруты</Text>}
                                data={this.state.popular}
                                renderItem={({item}) => <Popular item={item}/>}
                                keyExtractor={item => item.fromID + item.toID}
                                contentContainerStyle={{flexGrow: 1}}
                            /> : null
                        }


                    </View>
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
        width: '90%',
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

export default SearchPassenger; 