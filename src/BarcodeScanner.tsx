/* eslint-disable */

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const BarcodeScanner = ({navigation}) => {
//   const [scanned, setScanned] = useState(false);

//   const handleBarCodeScanned = ( data:any ) => {
    
//     console.log('------------------>',data.data);
//     navigation.pop()
//   };
//   return (
//       <RNCamera
//   style={{ flex: 1 }}
//   onBarCodeRead={handleBarCodeScanned}
//         />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//   },
// });

// export default BarcodeScanner