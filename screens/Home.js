import React from "react";
import { StyleSheet, PermissionsAndroid, Platform, Dimensions, ScrollView } from "react-native";
import { Block, theme,Image, Text } from "galio-framework";
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from '../components';
import Geolocation from 'react-native-geolocation-service';
import config from '../config';

const { width, height } = Dimensions.get("screen");
const ratio = width / height;
class Home extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      markers: [],
      drivers: [],
      mapRegion: null,
      GOOGLE_MAP_API_KEY: config.GOOGLE_MAP_API_KEY,
      isSearching: false,
      displayRegion: this.displayRegion,
      error: null
    };

    this.displayRegion = {
      latitude: 22.28552, 
      longitude: 114.15769,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    }

    this.mapView = null;
    this.markerId = 0;
    this.dirKey = 0;
    this.pathColor = '#091fc6';
  }

  componentDidMount(){
    this.assignCoordinate();
  }

  assignCoordinate = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (hasLocationPermission) {

      Geolocation.getCurrentPosition(
      (position) => {
        console.log("wokeeey");
        console.log(position);
        var displayRegion = this.state.displayRegion;
        displayRegion.latitude = position.coords.latitude;
        displayRegion.longitude = position.coords.longitude;
        this.setState({displayRegion: displayRegion});
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
    }
  }
  
  onMapPress = (e) => {
    const numberOfMarkers = this.state.markers.length;
    const {isSearching} = this.state;

    if( numberOfMarkers <= 1 && !isSearching){

      let newMarkers = JSON.parse(JSON.stringify(this.state.markers));
      newMarkers.push({
        coordinate: e.nativeEvent.coordinate,
        key: this.markerId++,
        color: this.pathColor,
      });

      this.setState({
        markers: newMarkers
      });

      if(numberOfMarkers == 1){
        setTimeout(()=>{
          this.alert();
        }, 2000);
      }
    }
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }
  moveToUserLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    Geolocation.getCurrentPosition((location) => {
    const coordinates = {
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    };

    if(this.mapView) {
      this.mapView.animateToRegion(coordinates, 1000);
    }
  });
  }

  changeMapRegion = (data, details) => {
    if(this.state.markers.length <= 1){
      this.setState({
        mapRegion: {
          latitude: details.geometry.location.lat, 
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ratio,
        }
      });
  
      this.GooglePlacesRef.setAddressText("");
    }
  }

  render() {
    const { navigation } = this.props;
    const { isSearching } = this.state;
    const numberOfMarkers = this.state.markers.length;
    return (
      <Block flex center style={styles.home}>
        <Block style={{ width, height }}>

<MapView 
  style={styles.map} 
  initialRegion={this.state.displayRegion}
  showsMyLocationButton={true}
  region = {this.state.mapRegion || undefined} 
  showsUserLocation={true}
  onPress={(e) => this.onMapPress(e)}
  onMapReady={ this.moveToUserLocation }
  ref={c => this.mapView = c}
>

  {this.state.markers.map( (marker, idx) => {
    if(idx===0){
      return (
        <Marker
          key={marker.key}
          coordinate={marker.coordinate}
          pinColor={this.pathColor}
        />
      )
    }else{
      return (
        <Marker
          key={marker.key}
          coordinate={marker.coordinate}
          pinColor={this.pathColor}
        >
          <Icon
            type="FontAwesome"
            name="flag"
            style={{ width: 40, color: this.pathColor }}
          />
        </Marker>
      )
    }
  })}


  {/* {this.state.drivers.map( (driver, idx) => {
      return (
      <Marker
        key={idx}
        coordinate={driver.coordinate}
        style={{ width: 50, height: 50 }}
      >
        <Image
          source={carMarkerImages[idx%carMarkerImages.length]}
          style={{ width: 50, height: 50 }}
        />
      </Marker>
      );
    }
  )} */}

  {numberOfMarkers == 2 &&
    <MapViewDirections
      key={this.dirKey++}
      origin={this.state.markers[0].coordinate}
      destination={this.state.markers[1].coordinate}
      apikey={this.state.GOOGLE_MAP_API_KEY}
      strokeWidth={3}
      strokeColor={this.pathColor}
    />
  }
  
</MapView>

<GooglePlacesAutocomplete
  placeholder='Search'
  minLength={2} // minimum length of text to search
  autoFocus={true}
  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
  listViewDisplayed='auto'   // true/false/undefined
  fetchDetails={true}
  renderDescription={row => row.description} // custom description render
  onPress={(data, details = null) => this.changeMapRegion(data, details)}
  editable={ numberOfMarkers == 2 ? false : true }
  getDefaultValue={() => ''}
  
  query={{
    // available options: https://developers.google.com/places/web-service/autocomplete
    key: this.state.GOOGLE_MAP_API_KEY,
    language: 'en', // language of the results
    // secondary_text: 'Hong Kong'
    // types: 'HK' // default: 'geocode'
    components: 'country:ng'
  }}
  
  styles={{
    textInputContainer: {
      width: '100%'
    },
    description: {
      fontWeight: 'bold'
    },
    predefinedPlacesDescription: {
      color: '#1faadb'
    }
  }}
  
  currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
  currentLocationLabel="Current location"
  nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        type: 'cafe'
      }}
      
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address',
      }}
  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
  //predefinedPlaces={[homePlace, workPlace]}

  debounce={500} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
  // renderLeftButton={
  //   ()  => numberOfMarkers == 0 && <Text>Start point</Text> 
  //   || numberOfMarkers == 1 && <Text>End point</Text>
  // }

  ref={(instance) => { this.GooglePlacesRef = instance }}
/>

{ isSearching?
  <View style={styles.contentContainer}>
    <View style={styles.centerGroup}>
      <View style={styles.bubbleButtonContainer}>
        <TouchableOpacity
          style={[styles.bubble, styles.bubbleButton]}
        >
          <Text style={styles.buttonText}>Searching...</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  :
  null
}


</Block>


      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  centerEverything: {
    width: '100%',
    height: '100%',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerContainer: {
    flex:1, 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerText: {
    width: '80%',
    alignItems: 'center', 
    justifyContent: 'center',
    textAlign: 'center'
  },
  centerButton: {
    marginTop: 30, 
    width: '50%',
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf:'center'
  },
  bubbleButtonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 100,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(250, 10, 10, 0.80)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bubbleButton: {
    width: 150,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20
  },
  centerGroup: { 
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: { 
    flexDirection: "column", 
    alignItems: "center",
  },
});

export default Home;
