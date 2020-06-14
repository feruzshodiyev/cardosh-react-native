import React, {Component} from 'react';
import {AppRegistry, AsyncStorage, StyleSheet, View, Text, Image, Alert, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from "axios";

import {Container, Header, Content, Thumbnail, Button, Spinner, Icon,} from 'native-base';
import Modal from "react-native-modal";


const defolt = require("../assets/images/default.png");


class PhotoProfile extends Component {

    static navigationOptions = {
        title: 'Фото профиля',
    };

    constructor(props) {
        super(props);
        this.state = {
            image: null,

            loading: false,
            loadingModalVis: false,
            sendSuccess: false,
            sendError: false,
            loadError: false,

            profile_image: null
        }
    }


    componentDidMount() {
        this.getPermissionAsync();
        console.log('hi');

        const {params} = this.props.navigation.state;
        console.log('profile_image: ',params.profile_image);
        this.setState({
            profile_image: params.profile_image
        })
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Извините, нам нужны разрешения на камеры, чтобы это работало!');
            }
        }
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
            base64: true
        });

        console.log(result.uri);

        if (!result.cancelled) {
            this.setState({image: result.uri});
        }
    };

    saveImage=()=>{

        this.setState({
            loading: true,
            loadingModalVis: true,
            sendSuccess: false,
            sendError: false,
            loadError: false,
        });

        const {params} = this.props.navigation.state;
        const userId = params.userId;
        const token = params.token;


        const uri = this.state.image;
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append('profile_image  ', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });

        axios.put(`http://api.cardosh.uz/v1/restapi/${userId}/profile_image/update/`, formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        }).then(res=>{
            console.log('res', res);
            this.setState({
                loading: false,
                sendSuccess: true,
            });
        }).catch(err=>{
            console.log('err: ', err);
            this.setState({
                loading: false,
                sendError: true,
            });
        })
    };

    goBack=()=> {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.reloadUser();
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

        });
        this.goBack();
    };

    render() {
        let {image} = this.state;

        return (
            <View>
                <TouchableOpacity onPress={this._pickImage}>
                    <Thumbnail large style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 40,
                        marginBottom: 20
                    }} source={image ? {uri: image} : this.state.profile_image ? {uri: 'http://api.cardosh.uz'+this.state.profile_image} : require("../assets/images/default.png")}/>
                </TouchableOpacity>

                <View style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>{image ?
                    <Button
                        onPress={this.saveImage}
                        warning block style={{width: 200, marginLeft: 'auto', marginRight: 'auto'}}>
                        <Text style={{color: 'white'}}>Сохранить</Text></Button> :
                    <Text style={{textAlign: 'center', fontSize: 30, color: '#ff6600'}}>Нажмите на фото чтобы загрузить
                        новое фото.</Text>}</View>


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
                                onPress={() => this.saveImage()}
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
                                <Text style={{marginTop: 15}}>Ваш фото успешно сохранен.</Text>
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
        );
    }
}

export default PhotoProfile;