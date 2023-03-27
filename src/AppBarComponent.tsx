/* eslint-disable */

import React,{useState} from "react";
import { AppBar, HStack,IconButton,} from "@react-native-material/core";
import {Image} from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
//import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from './utility/images/windsor_logo.png'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AppBarProps {
  title: string;
  isBackArrow: boolean;
  navigation:any;
}

const AppBarComponent = ({title,isBackArrow,navigation}:AppBarProps) =>{
  
  
  const [visible, setVisible] = useState(false)
  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const clearLoginDetail=async ()=>{
    console.log('ca;;;')
    try {
        await AsyncStorage.removeItem('loginData')
        await AsyncStorage.removeItem('lastScanNumber',)
        navigation.replace('Login')
      } catch (e) {
        console.log('eee',e)
      }
}

  return(

  <AppBar
    
    style={{
      backgroundColor:'#440c8c',
      height:70,
      paddingVertical:15,
      paddingHorizontal:15,
    }}
    title={title}

    leading= {props=>( isBackArrow?<IconButton
      icon={props => <MaterialCommunityIcons  name="chevron-left" color={'#fff'} onPress={()=>{navigation.goBack()}} size={30}/>}
      {...props}
    />
    :null)
    }
    trailing={props => (
      <HStack spacing={10}>
        <Image style={{marginTop:5}}  source={logo}></Image>

        <Menu
        visible={visible}
        anchor={<IconButton
          icon={props => <MaterialCommunityIcons  name="account-circle" color={'#fff'} onPress={showMenu} size={30}/>}
          {...props}
        />}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={()=>clearLoginDetail()}>Logout</MenuItem>
      </Menu>

        
     
      </HStack>
    )}
  />
)};

export default AppBarComponent;