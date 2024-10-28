import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useStationContext } from "@/app/(stations)/stationContext";

export default function MapScreen() {
  const { stations } = useStationContext();
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    getLocation();
  }, []);

  if (!location) {
    return (
        <View style={styles.container}>
          <Text>Loading map...</Text>
        </View>
    );
  }

  return (
      <MapView style={styles.map} region={location} showsUserLocation={true}>
        {stations.map((station, index) => {
          const latitude = station.WGS84_LAT;
          const longitude = station.WGS84_LON;

          // Überprüfen auf gültige Werte
          if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
                <Marker
                    key={index}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    title={station.NAME}
                />
            );
          } else {
            console.warn('Invalid coordinates for station:', station);
            return null; // Rückgabe von null, wenn die Koordinaten ungültig sind
          }
        })}
      </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});