import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack = createStackNavigator();

console.log('oiiii');
const Routes = () => {
    return(
        <NavigationContainer>
            <AppStack.Navigator 
            headerMode="none"
            screenOptions={{
                cardStyle:{
                    backgroundColor:'#f0f0f5'
                }
            }}
            >
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="Points" component={Points} />
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>

    );
};

export default Routes;
/*import React from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons';
import { useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import  Constants  from 'expo-constants';
import { RectButton} from 'react-native-gesture-handler'
import { useEffect , useState} from 'react';
import api from '../../services/api';

interface Params {
  point_id: number;
}
interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  }
  items: {
    id: number;//ioh9yiguy
  }[];
}
const Detail = () => {
    const [data, setData] = useState<Data>({} as Data);

    const navigation = useNavigation();
    const route = useRoute();

   const routeParams = route.params as Params;

   useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response =>{
      setData(response.data);
    });
   },[]);

    function handleNavigateBack(){
        navigation.goBack();
    }

    if(!data.point){
      return null;
    }
    return (
        <>
        <View style={styles.container}>
             <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>
            <Image style={styles.pointImage} source={{uri: data.point.image}}/>

            <Text style={styles.pointName}>{data.point.name}</Text>
            <Text style={styles.pointItems}>lampadas</Text>

            <View style={styles.address}>
                <Text style={styles.addressTitle}>{data.point.city}</Text>
                <Text style={styles.addressContent}>{data.point.uf}</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={() => {}}>
                <FontAwesome name="whatsapp" size={20} color="#FFF"/>
                <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton>

            <RectButton style={styles.button} onPress={() => {}}>
                <Icon name="mail" size={20} color="#FFF"/>
                <Text style={styles.buttonText}>E-mail</Text>
            </RectButton>

        </View>
        </>
    ) 
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });
export default Detail;*/