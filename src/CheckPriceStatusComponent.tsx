/* eslint-disable */

import React,{useEffect,useState,useRef} from "react";
import { View, SafeAreaView,Text,StyleSheet, TextStyle} from "react-native";
import Sound from 'react-native-sound';
import AppBarComponent from "./AppBarComponent";
import { TextInput } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';



interface IProduct {
    isMarkdown: Boolean,
    markdown:String,
    sku?:String,
    upc?:String,
    styleID?:String,
    styleCode:String,
    description:String,
    color:String,
    size:String,
    variants:Array<IVariants>
    activeFlag?:Boolean,
    originalPrice:String,
    currentPrice:String,
    priceStatus:String,
    oh:String
  }
  interface IVariants{
    upc:String,
    quantity:String,
    size:String,
  }

const CheckPriceStatusComponent = ({route,navigation}) => {

    console.log('route.params',route.params)
    const { storeNumber } = route.params;
    console.log('storeNumber',storeNumber)

    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<String>('');
    const [lastScanNumber,SetLastScanNumber]=useState<String>('-')
    const scannerRef = useRef(null);
    const [isLoading,setIsLoading]=useState(false)
    const [isErrorWhileFetchingData, setIsErrorWhileFetchingData] =useState(false)
    const [isDataLoaded,setIsDataLoaded]=useState(false)
    const [searchedProductData, setSearchedProductData]=useState<IProduct>()

    const [successAudio, setSuccessAudio] = useState<Sound | null>(null);
    const [failAudio, setFailAudio] = useState<Sound | null>(null);
    //const [sound, setSound] = useState<Sound | null>(null);



    useEffect(()=>{
          Sound.setCategory('Playback');

    const audioForSuccess = new Sound('https://s3-us-west-2.amazonaws.com/windsor-hosting/success.mp3','',
      error => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      },
    );
    const audioForFail = new Sound('https://s3-us-west-2.amazonaws.com/windsor-hosting/error.mp3','',
    error => {
      if (error) {
        console.log('failed to load the sound', error);
      }
    },
  );
    setSuccessAudio(audioForSuccess)
    setFailAudio(audioForFail)

    return () => {
            if (successAudio) {
                successAudio.stop();
                successAudio.release();
            }
            if (failAudio) {
                failAudio.stop();
                failAudio.release();
            }
     };

    },[])

    useEffect(()=>{
       getLastScanNumber().then((data)=>{
        if(data!=null){
          SetLastScanNumber(data.toString())
        }
       })
      
    },[])

    useEffect(()=>{
        console.log(results.toString().length)

        if((results.toString().length===10 || results.toString().length===12) && results.toString().includes('-')){
            const timeOutId = setTimeout(() =>fetchProductDetails('',262) , 1500);
            return () => clearTimeout(timeOutId);
         }
         else if(results.toString().length===12){
           const timeOutId = setTimeout(() =>fetchProductDetails('',262) , 1500);
           return () => clearTimeout(timeOutId);
         }
    },[results])

    useEffect(()=>{

    },[])

    const fetchProductDetails=(productIdentifier:String,location:Number)=>{
   
        setIsLoading(true)
        setIsDataLoaded(false)
        setIsErrorWhileFetchingData(false)

        storeLastScanNumber(results)
        SetLastScanNumber(results)
    
      // localStorage.setItem(strings.lastScanNumber,results.toString())
    
        const requestBody:Object={
          [results.includes("-")?"style_number":'upc']:results,
          "location":""+'123'
        }
            
        fetch("https://markdown-service.wndsr.dev/markdown-check",{
          headers: {
            'Content-Type': 'application/json',
          },    
          method: 'POST',
          body: JSON.stringify(requestBody) 
        }).then((res) => res.json()
          .then((data)=>{
            console.log('data',data)
            setIsLoading(false)
            
            if(data.status==='invalid'){
              //handleChange(1)
              failAudio?.play()
              setIsErrorWhileFetchingData(true)
              setIsDataLoaded(true)
              setSearchedProductData(data)
            }else{
              //console.log(1)
                if(data.priceStatus==='regular'){
                  failAudio?.play() 
                }
                else{
                  successAudio?.play()
                }
    
              if(!results.includes("-")){
                const variant= data.variants?.find((element:IVariants) => {
                  return element.upc === results.toString();
                })
                data.variants=[variant]
              }
              setIsDataLoaded(true)
              setSearchedProductData(data)
            }
            setResults('')
          }
        )).catch(e=>{
          failAudio?.play()
          console.log('errrr',e)
          //handleChange(1)
          //errorAudio.play()
          setIsLoading(false)
          setIsErrorWhileFetchingData(true)
          setIsDataLoaded(true)
          setIsErrorWhileFetchingData(true)
          setResults('')
        })
      }

    const storeLastScanNumber = async (value:String) => {
     try {
        await AsyncStorage.setItem('lastScanNumber', value.toString())
      } catch (e) {
          // saving error
        }
      }

    const getLastScanNumber = async () => {
        try {
          const value = await AsyncStorage.getItem('lastScanNumber')
          if(value !== null) {
            console.log('valueeeeeeeeeeeeeeee',value)
            SetLastScanNumber(value)
            return value
            // value previously stored
          }
        } catch(e) {
          // error reading value
        }
      }

    const getTotalOH=( allVariants:Array<any>):String=>{
        let totalOh=0;
  
        allVariants?.map((variant)=>{
          totalOh+= Number(variant.quantity)<0?0:variant.quantity
        })
       return totalOh.toString();
    }

    const checkPrice=(priceStatus:String):String=>{

      if(priceStatus==='markup'){
        return 'Markup Price:'
      } 
      else if(priceStatus==='markdown' || priceStatus==='markdown2'){
        return 'Markdown Price:'
      }
      else if(priceStatus==='promo'){
        return 'Promo Price:'
      }    
      else{
        return 'Current Price:'
      }
    }

    const getColorOfPrice=(priceStatus:String):TextStyle=>{
      if(priceStatus==='promo'){
        return {fontSize:26,fontWeight:'bold',color:'#0069bc'}
      } 
      else if(priceStatus==='markup'){
        return {fontSize:26,fontWeight:'bold',color:'#42c37c'}
      }
      else if(priceStatus==='markdown' || priceStatus==='markdown2'){
        return {fontSize:26,fontWeight:'bold',color:'#ef161b'}
      }
      else{
        return {fontSize:26,fontWeight:'bold',color:'#000000'}
      }
    }
  

    return (
        <SafeAreaView>
            <View style={{backgroundColor:'#fff',height:'100%'}}>
            <AppBarComponent navigation={navigation} isBackArrow={true} title="Style"></AppBarComponent>
              <View style={{margin:20}}>
                    
                <Text style={{fontSize:24,}}> Store Number: {storeNumber}</Text>
                <TextInput
                  style={{marginVertical:20}}
                  mode="outlined"
                  onChangeText={(text)=>{
                    console.log('ss',text)
                    setIsDataLoaded(false)
                    setIsErrorWhileFetchingData(false)
                    setResults(text)
                 }}
                  value={results}
                  keyboardType='decimal-pad'
                  maxLength={12}
                  label="Scan UPC or Style Number"
                  placeholder="Scan UPC or Style Number"
                  // right={<TextInput.Icon icon="camera" color='#440c8c' onPress={()=> navigation.navigate('Camera')}/>}
                />
                <Text style={{fontSize:24,}}> Last Scan: </Text>
                <View style={{borderWidth:1,marginVertical:15, padding:20,borderRadius: 1, borderStyle:'dashed'}}>
                  <Text style={{fontSize:20,}}> {lastScanNumber} </Text>
                </View>
                    </View> 
                    {isLoading? 
                    <View style={{alignContent:'center',alignItems:'center'}}>
                      <AnimatedCircularProgress
                      size={60}
                      width={5}
                      fill={100}
                      duration={15000}
                      tintColor="#440c8c"
                      backgroundColor="#fff" /></View>:null}


                  {isDataLoaded?    !isErrorWhileFetchingData?searchedProductData?<View style={{flexDirection:'column', gap: 10,borderWidth:1,marginVertical:15,marginHorizontal:20, padding:20,borderRadius: 1, borderStyle:'dashed'}}>
                  <Text style={{fontSize:18,}}>Style: {searchedProductData.styleCode}</Text>
                  <Text style={{fontSize:18,}}>Description: {searchedProductData.description}</Text>
                  
                  {
                    lastScanNumber.includes('-')?searchedProductData.variants?.map((variant)=>{
                      return <View key={variant.upc.toString()} style={{display: 'flex',flexDirection: 'row',padding:0.3}}>
                                <Text  style={{fontSize:18,flexBasis:'20%', flexGrow:0}}>Size: {variant.size}</Text>
                                <Text style={{fontSize:18,flexBasis:'20%', flexGrow:0}}>OH: {Number(variant.quantity)<0?0:variant.quantity}</Text>
                                <Text style={{fontSize:18,flexBasis:'45%', flexGrow:0}}>UPC: {variant.upc}</Text>

                        </View>

                    }):<Text style={{fontSize:18,}}>Size: {searchedProductData.variants[0].size}</Text>
                  }
                  
                  <Text style={{fontSize:18,}}>OH: {getTotalOH(searchedProductData.variants)}</Text>
                  <Text style={{fontSize:18,}}>Color: {searchedProductData.color}</Text>
                  <Text style={{fontSize:18,}}>Original Price: {'$'+ searchedProductData.originalPrice}</Text>
                  {searchedProductData.priceStatus!=="regular"?<Text style={{fontSize:18,}}>Current Price: {'$'+ searchedProductData.currentPrice}</Text>:null}
                  {searchedProductData.priceStatus!=="promo"?<Text style={{fontSize:18,}}>Promo Price: N/A</Text>:null}
                  {searchedProductData.priceStatus!=="markdown"  && searchedProductData.priceStatus!=="markdown2"?<Text style={{fontSize:18,}}>Markdown Price: N/A</Text>:null}
                  {searchedProductData.priceStatus!=="markup"?<Text style={{fontSize:18,}}>Markup Price: N/A</Text>:null}
                  <Text style={getColorOfPrice(searchedProductData.priceStatus)}>{checkPrice(searchedProductData.priceStatus)} {'$'+searchedProductData.currentPrice}</Text>
                  </View>:<Text style={{color:'#f00',fontSize:18,fontWeight:'bold',textAlign:'center'}}>UPC or Style Code not found or invalid</Text>:<Text style={{color:'#f00',fontSize:18,fontWeight:'bold',textAlign:'center'}}>UPC or Style Code not found or invalid</Text>:null}
 

             </View>

        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    input: {
      height: 60,
      marginTop:20,
      borderWidth: 1,
      padding: 10,
      backgroundColor: '#f2f2f2'
    },
  });
export default CheckPriceStatusComponent;