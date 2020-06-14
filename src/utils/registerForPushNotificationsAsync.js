import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import {AsyncStorage} from "react-native";



export default async function registerForPushNotificationsAsync(userId, token) {

    // console.log("calling push func!");
    // await AsyncStorage.removeItem('pushToken').then(res=>{
    //     console.log('token removed')
    // });

   const hasPushToken = await AsyncStorage.getItem("pushToken");

   if (!hasPushToken){

       console.log("calling push func22!");

       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
       // only asks if permissions have not already been determined, because
       // iOS won't necessarily prompt the user a second time.
       // On Android, permissions are granted on app installation, so
       // `askAsync` will never prompt the user
       // Stop here if the user did not grant permissions

       if (status !== 'granted') {
           alert('No notification permissions!');
           return;
       }

       // Get the token that identifies this device
       let pushToken = await Notifications.getExpoPushTokenAsync();

       if (Platform.OS === 'android') {
           Notifications.createChannelAndroidAsync('notification-sound-channel', {
               name: 'Notification Sound Channel',
               sound: true,
               priority: 'max',
               vibrate: [0, 250, 250, 250],
           }).then(res=>{
               console.log('sound set')
           });
       }

       console.log(pushToken.slice(17, pushToken.length));

       // POST the token to your backend server from where you can retrieve it to send push notifications.

       axios.post("http://api.cardosh.uz/v1/notifications/create/expo_push_token/", {"user_id":userId, "expo_push_token" : pushToken.slice(17, pushToken.length)}, {
           headers:{
               'Authorization': 'Bearer ' + token
           }
       }).then(res=>{
           console.log("push token send success!!");

           AsyncStorage.setItem("pushToken", pushToken).then(res=>{
               console.log("push token AsyncStorage success!!");
               console.log(res)
           }).catch(err=>{
               console.log("push token AsyncStorage error!!");
               console.log(err)
           })

       }).catch(err=>{
           console.log("push token send error!!");
           console.log(err)
       })
   }else {
       console.log("has push token");
       console.log(hasPushToken)
   }


}