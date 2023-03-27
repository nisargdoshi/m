/* eslint-disable */

import React, { useSyncExternalStore } from "react";
import { View, SafeAreaView,Text, Button,TextInput,StyleSheet,TouchableOpacity} from "react-native";
import AppBarComponent from "./AppBarComponent";

const SaveSettings = ({navigation}) => {
  const [storeNumber, setStoreNumber] = React.useState('');
  const [confirmStoreNumber, setConfirmStoreNumber] = React.useState('');

  return (
        <SafeAreaView >
            <AppBarComponent navigation={navigation} isBackArrow={false} title="Settings"></AppBarComponent>
            <View style={{backgroundColor:'#fff',height:'100%'}}>

            <TextInput
              placeholderTextColor={"#A9A9A9"}
              style={styles.input}
              onChangeText={(text)=>{setStoreNumber(text)}}  
              value={storeNumber}
              maxLength={12}
              placeholder='Enter Store Number'
              keyboardType='decimal-pad'/>

            <TextInput
                placeholderTextColor={"#A9A9A9"}
                style={styles.input}
                onChangeText={(text)=>{setConfirmStoreNumber(text)}}  
                value={confirmStoreNumber}
                maxLength={12}
                placeholder='Confirm Store Number'
                keyboardType='decimal-pad'/>

                <TouchableOpacity
                        style={!Number(storeNumber) ||!Number(confirmStoreNumber) ||storeNumber!==confirmStoreNumber?styles.settingScreenNonActiveButtonStyle:styles.settingScreenActiveButtonStyle}
                        disabled={!Number(storeNumber) ||!Number(confirmStoreNumber) ||storeNumber!==confirmStoreNumber }
                        onPress={() => navigation.navigate('price', {storeNumber,})}>
                        <Text style={!Number(storeNumber) ||!Number(confirmStoreNumber) ||storeNumber!==confirmStoreNumber?styles.storeScreenButtonNonActiveTextStyle:styles.storeScreenButtonActiveTextStyle}>SAVE SETTINGS</Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
        
    )
}

const settingScreenButton={
    marginRight:20,
    marginLeft:20,
    marginTop:20,
    paddingTop:15,
    paddingBottom:15,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
}
const storeScreenButtonTextStyle={
  fontWeight:'bold',
  textAlign:'center',
  paddingLeft : 10,
  paddingRight : 10
}
const styles = StyleSheet.create({
    
      settingScreenActiveButtonStyle:{
        ...settingScreenButton,
        backgroundColor: '#440c8c'
      },
      settingScreenNonActiveButtonStyle:{
        ...settingScreenButton,
        backgroundColor: '#f2f2f2'
        
        },
        storeScreenButtonNonActiveTextStyle:{
        ...storeScreenButtonTextStyle,
        color:'#A9A9A9',
      },
      storeScreenButtonActiveTextStyle:{
        ...storeScreenButtonTextStyle,
        color:'#fff',
      },
    input: {
      height: 60,
      margin: 20,
      borderBottomWidth: 1,
      padding: 10,      
      borderColor:'#440c8c',
      backgroundColor: '#f2f2f2'
    },
  });

export default SaveSettings;