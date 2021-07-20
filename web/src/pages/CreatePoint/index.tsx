import React, {useEffect, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory} from 'react-router-dom';
import { FiArrowDownLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import axios from 'axios';
import{LeafletMouseEvent} from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';
import { useState } from 'react';


interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}
const CreatePoint = () =>{
    const[items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const[cities, setCities] = useState<string[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp:'',
    });
    

  
    const [selectedItems,setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const history = useHistory();
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
    const {latitude, longitude} = position.coords;

    setInitialPosition([latitude, longitude]);

        })
},[]);

    useEffect(() => {
        api.get('items').then(response =>{
            setItems(response.data);
        })
    },[]);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response =>{
        const  ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
        })
    },[]);

    useEffect(() => {
        if (selectedUf === '0'){
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`)
        .then(response =>{
        const  cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
        })
    },[selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUf(uf);
    };
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    };
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setFormData({ ...formData, [name]: value});
        
    }
    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
     
      
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

      
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(', '));

        if(selectedFile){
          data.append('image', selectedFile);
        } 
        

        await api.post('points', data);

        alert('Ponto de coleta criado! ');

        history.push('/')

    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
                const filteredItems = selectedItems.filter(item => item !== id);

                setSelectedItems(filteredItems);
        }else{
            setSelectedItems([ ...selectedItems, id]);
        }

    
     
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowDownLeft/>
                   Voltar para home 
                </Link>
            </header>

            <form onSubmit = {handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                  <Dropzone onFileUpload={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                        name="name"
                        id="id"
                        onChange={handleInputChange}
                        />
                    </div>
                  
                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input type="email"
                        name="email"
                        id="email"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInputChange}
                        />
                    </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <MapContainer center={[-23.0682916, -54.2047341]} zoom={15} onClick={() =>handleMapClick}>
                        <TileLayer
                         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                         />
                         <Marker position={[-23.0682916, -54.2047341]}/> 
                    </MapContainer>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                        <select 
                        name="uf" 
                        id="uf"
                         value= {selectedUf} 
                         onChange={handleSelectUf}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf =>(
                                <option key={uf} value={uf}>{uf}</option>
                            ))};
                        </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                        <select 
                        name="city" 
                        id="city"
                        value={selectedCity}
                        onChange={handleSelectCity}>
                            <option value="0">Selecione uma cidade</option>
                            {cities.map(city =>(
                                <option key={city} value={city}>{city}</option>
                            ))};
                        </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item =>(
                             <li 
                             key={item.id} onClick={() =>handleSelectItem(item.id)}
                             className={selectedItems.includes(item.id) ? 'selected': ''}
                             >

                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}
                            </span>
                        </li>
                        )
                            )};
                     
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    );
            
    
}
export default CreatePoint;

/*import React, {useState, useEffect } from 'react';
import  Constants  from 'expo-constants';
import { Feather as Icon} from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';


interface Item{
  id: number;
  title: string;
  image_url: string;
}

interface Point{
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  items: {
    title: string;
  }[];
}

const Points = () => {
    const[items, setItems] = useState<Item[]>([]);
    const[points, setPoints] = useState<Point[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();

    useEffect(() => {
      async function loadPosition() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted'){
          Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a localização')
          return;
        }
        
        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        setInitialPosition([
          latitude,
          longitude
        ])
      }
      loadPosition();
  },[]);    

    useEffect(() => {
      api.get('items').then(response =>{
          setItems(response.data);
      })
/*  },[]);

  useEffect(() => {
    api.get('points',{
      params:{
        city: 'Naviraí',
        uf:'MS',
        items: [1, 2]
      }
    }).then(response = > {
        setPoints(response.data);
    })
    },[]);
  
    function handleNavigateBack(){
        navigation.goBack();
    };

    function handleNavigateToDetail(){
      navigation.navigate('Detail');
    };

    function handleSelectItem(id: number){
      const alreadySelected = selectedItems.findIndex(item => item === id);

      if(alreadySelected >= 0){
              const filteredItems = selectedItems.filter(item => item !== id);

              setSelectedItems(filteredItems);
      }else{
          setSelectedItems([ ...selectedItems, id]);
      }
    }
    return (
      <>
        <View style={styles.container} >
        <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        
        <Text style={styles.title}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView style={styles.map} 
            initialRegion={{
              latitude: initialPosition [0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
              }}
              >
                <Marker 
                style={styles.mapMarker}
                onPress={handleNavigateToDetail}
                coordinate={{
                   latitude: -23.0654007,
                   longitude: -54.2114258,
                }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60-fake'}}/>
                    <Text style={styles.mapMarkerTitle}>Mercado</Text>
                  </View>
                </Marker> 
              </MapView>
          ) }
            </View>
        </View>
        <View style={styles.itemsContainer}>
          <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          >
             {items.map(item => (
               <TouchableOpacity 
               key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem: {}
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
              >
               <SvgUri width={42} height={42} uri={item.image_url}/>
               <Text style={styles.itemTitle}>{item.title}</Text>
             </TouchableOpacity>
             ))}
 
            </ScrollView>
        </View>
    </>
    )



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;*/