/* eslint-disable */

import React, {useEffect,useState} from "react";
import { StyleSheet,View ,Text} from "react-native";
import { GoogleSignin,GoogleSigninButton,statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login=({navigation})=>{


    useEffect(()=>{
        getLoginDetails().then((data)=>{
            if(data!=null){
               navigation.replace('Settings') 
            }
            console.log('logindata',data)
        })
    },[])
    const storeLoginDetail=async (value:any)=>{
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('loginData', jsonValue)
          } catch (e) {
          }
    }
    const getLoginDetails= async ()=>{
        try {
            const jsonValue = await AsyncStorage.getItem('loginData')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
          } catch(e) {
            console.log('d')
            return null
            // error reading value
          }
    }

    const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log('useinfor',userInfo.idToken)
          
          storeLoginDetail(userInfo)
          navigation.replace('Settings')
         // console.log('USERINFFFOGG',userInfo)
          //this.setState({ userInfo });
        } catch (error:any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };

    return (
        <View style={{height:"100%",width:'100%',backgroundColor:'#440c8c',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
            <Text style={{margin:10,fontSize:48,fontWeight:'bold',color:'#83a35c'}}>PRICING APP</Text>
            <GoogleSigninButton
                      style={{ width: 192, height: 48 }}
                      size={GoogleSigninButton.Size.Wide}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={signIn}
                    />
        </View>
    )
}
export default Login
