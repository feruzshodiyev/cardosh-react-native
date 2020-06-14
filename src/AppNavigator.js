import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import {createAppContainer, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';

import Notifications from './screens/Notifications';
import Profile from './screens/Profile';
import LoginScreen from './screens/login/index';
import SignupView from './screens/signup/index';
import AddPassengerRide from './screens/AddPassengerRide';
import SearchPassenger from './screens/SearchPassenger';
import MyRidesList from './screens/MyRidesList';
import App2 from './app/App2';
import InitScreen from './screens/InitScreen';
import AppScreen from './screens/AppScreen';
import RideDetails from './screens/RideDetails';
import MyCar from "./screens/MyCar";
import PhotoProfile from "./screens/PhotoProfile";
import MyOffers from "./screens/MyOffers";
import OffersForRide from "./screens/OffersForRide";


const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Signup: SignupView,
        InitScreen: {
            screen: InitScreen,
            navigationOptions: {
                header: null
            }
        }
    }, {
        initialRouteName: "InitScreen"
    }
);


// const BottomNavigator = createBottomTabNavigator({
//
//
//     'Home': {
//         screen: SearchPassenger,
//         navigationOptions: {
//             tabBarLabel: 'Найти пассажира',
//             tabBarIcon: ({tintColor}) => <Icon name="ios-search" size={30} color={tintColor}/>
//         },
//         tabBarOptions: {
//             activeTintColor: '#ff6600'
//         }
//     },
//
//     'Explore': {
//         screen: MyRidesList,
//         navigationOptions: {
//             tabBarLabel: 'Мои поездки',
//             tabBarIcon: ({tintColor}) => <Icon name="logo-model-s" size={30} color={tintColor}/>,
//
//         },
//     },
//     'Add': {
//         screen: AddPassengerRide,
//         navigationOptions: {
//             tabBarLabel: 'Оставить заявку',
//             tabBarIcon: ({tintColor}) => <Icon name="ios-add-circle-outline" size={30} color={tintColor}/>
//         },
//     }
// });

// const SearchStack = createStackNavigator({
//         SearchPassenger: {
//             screen: SearchPassenger,
//             navigationOptions: {
//                 header: null
//             }
//         },
//         RideDetails: {
//             screen: RideDetails,
//             navigationOptions: {
//                 // header: null
//                 headerStyle: {
//                     backgroundColor: '#f4dc9e',
//                 },
//                 headerTitleStyle: {
//                     fontWeight: 'bold',
//                     color: '#ff6600'
//                 },
//                 title: 'Заявка пасажира'
//             }
//         }
//     },
//     {
//         initialRouteName: 'SearchPassenger'
//     });


const AppStack = createStackNavigator(
    {
        SearchPassenger: {
            screen: SearchPassenger
        },
        RideDetails: {
            screen: RideDetails,
            navigationOptions: {
                // header: null
                headerStyle: {
                    backgroundColor: '#f4dc9e',
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: '#ff6600'
                },
                title: 'Заявка пасажира'
            }
        },

        Home: {
            screen: AppScreen,
            navigationOptions: {
                header: null
            }
        },
        MyRidesList: {screen: MyRidesList,
            navigationOptions: {
                header: null
            }},
        // SearchStack: {
        //     screen: SearchStack,
        //     navigationOptions: {
        //         header: null
        //     }
        // },
        AddPassengerRide: {screen: AddPassengerRide},
        Notifications: {screen: Notifications},
        Profile: {screen: Profile},
        MyCar: {screen: MyCar},
        PhotoProfile: {screen: PhotoProfile},
        MyOffers: {
            screen: MyOffers,
            navigationOptions: {
                header: null
            }
        },
        OffersForRide: {screen: OffersForRide}

    },
    {
        initialRouteName: 'Home'
    }
);

const AuthFlow = createAppContainer(
    createSwitchNavigator({
            Loading: App2,
            App: AppStack,
            Auth: AuthStack
        }, {
            initialRouteName: 'Loading'
        }
    )
);


// const AppContainer = createAppContainer(userNavigation);


export default AuthFlow;

