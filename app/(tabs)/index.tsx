import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Papa from 'papaparse'; // PapaParse importiert
import {useStationContext} from "@/app/(stations)/stationContext";

//HomeScreen - Standard Export Datei
//Komponente wird importiert und zum Hauptbildschirm anzeigen verwendet
export default function HomeScreen() {
    const {stations, addStation} = useStationContext(); // Mit Hook werden stations und addStations aus stationContext abgerufen
    const [modalVisible, setModalVisible] = useState(false); //Modal sichtbar ja/nein
    const [newStationName, setNewStationName] = useState(''); //name der neuen station
    const [newLatitude, setNewLatitude] = useState('');
    const [newLongitude, setNewLongitude] = useState('');

    //Stationen aus einer CSV-Datei geladen und in einer Liste angezeigt
    //mit papa parse aus csv geparst
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const csvUrl = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv'; //URL CSV
                const response = await fetch(csvUrl); //CSV asynchron vom Server geladen - gibt response objekt zurück mit infos
                const csvData = await response.text(); //lesen der Daten in Form von Text (String)

                // CSV-Daten parsen
                Papa.parse(csvData, {
                    header: true,
                    complete: (result) => {
                        result.data.forEach((station: any) => {
                            const lat = parseFloat(station.WGS84_LAT);
                            const lon = parseFloat(station.WGS84_LON);

                            // Füge nur Stationen mit gültigem Namen und Koordinaten hinzu
                            if (station.NAME && !isNaN(lat) && !isNaN(lon)) {
                                addStation({
                                    NAME: station.NAME,
                                    WGS84_LAT: lat,
                                    WGS84_LON: lon,
                                });
                            } else {
                                console.warn('Invalid station data, skipping:', station);
                            }
                        });
                    },
                    error: (error: Error) => {
                        console.error('Error parsing CSV:', error);
                    },
                });
            } catch (error) {
                console.error('Error fetching stations:', error);
            }
        };

        fetchStations();
    }, []);

    const handleAddStation = () => {
        const lat = parseFloat(newLatitude); //von string in float
        const lon = parseFloat(newLongitude); //von string in float

        if (!isNaN(lat) && !isNaN(lon)) {
            addStation({NAME: newStationName, WGS84_LAT: lat, WGS84_LON: lon});
            setModalVisible(false); // Modal nach dem Hinzufügen schließen
            setNewStationName(''); // Eingabefelder zurücksetzen
            setNewLatitude('');
            setNewLongitude('');
        } else {
            console.warn('Invalid latitude or longitude input'); //Wenn Koordinaten falsch sind
        }
    };

    return (
        <View style={styles.container}>
            <FlatList //Liste aller stationen
                data={stations} //stations array
                keyExtractor={(item, index) => index.toString()} //index der station als schlüssel für jedes listenelement
                renderItem={({item}) => (
                    <Text style={styles.stationItem}>
                        {item.NAME} - Latitude: {item.WGS84_LAT}, Longitude: {item.WGS84_LON}
                    </Text>
                )}
            />
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton} //macht button sichtbar
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Add Station</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Add New Station</Text>
                    <TextInput
                        placeholder="Enter station name"
                        value={newStationName}
                        onChangeText={setNewStationName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Enter latitude"
                        value={newLatitude}
                        onChangeText={setNewLatitude}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Enter longitude"
                        value={newLongitude}
                        onChangeText={setNewLongitude}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={handleAddStation} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'black',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        padding: 10,
        marginBottom: 20,
        color: 'white',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    stationItem: {
        color: 'white',
        fontSize: 16,
        marginVertical: 10,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center', // Zentriere den Button horizontal
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        width: '100%', // Button nimmt die gesamte Breite ein
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
