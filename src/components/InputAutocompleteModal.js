import React from 'react';
import {Image, Text, View, Modal, TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Button} from "native-base";


const InputAutocompleteModal = (props) => {
    const
        handleValue = (data) => {
            props.handleValue(data)
        };
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.modalVisible}
            onRequestClose={() => {

            }}>
            <Text style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 50,
                fontSize: 16,
                fontWeight: "bold",
                color: '#ff6600'

            }}>{props.title}</Text>

            <View style={{paddingTop: 20, flex: 1}}>


                <GooglePlacesAutocomplete
                    placeholder={props.destination}
                    minLength={1} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed='auto'    // true/false/undefined
                    // renderDescription={row => row.description} // custom description render
                    onPress={(data) =>
                        handleValue(data)
                    }

                    getDefaultValue={() => ""}

                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyCnDC2j_GR6Lw2AMS6DlO42ro51GwDAed4',
                        language: 'uz', // language of the results
                        region: 'uz',
                        types: '(cities)', // default: 'geocode',
                        components: 'country:uz',


                    }}

                    styles={{
                        container: {
                            marginTop: 20,

                        },
                        textInputContainer: {
                            width: '100%',
                            height: 62

                        },
                        textInput: {
                            color: '#5d5d5d',
                            fontSize: 18,
                            height: 45

                        },
                        description: {
                            fontWeight: 'bold'
                        },
                    }}

                    // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search

                        type: '(cities)'
                    }}

                    GooglePlacesDetailsQuery={{
                        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                        fields: 'formatted_address',
                    }}

                    // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    // predefinedPlaces={[homePlace, workPlace]}


                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                    // renderRightButton={() => <Text>Custom text after the input</Text>}


                />

            </View>
            <TouchableOpacity
                style={{
                    marginTop: 30,
                    backgroundColor: '#ff6600',
                    borderRadius: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: 20,
                    width: '80%',
                    height: 50,
                    justifyContent: 'center',
                    flexDirection: "row",
                }}
                onPress={() => props.onClose()}
            >
                <Text style={{textAlignVertical: 'center', color: 'white', fontWeight: 'bold'}}>Закрыть</Text>
            </TouchableOpacity>
        </Modal>

    );
};


export default InputAutocompleteModal;