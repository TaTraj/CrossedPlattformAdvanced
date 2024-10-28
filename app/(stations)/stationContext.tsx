import React, {createContext, useContext, useState} from 'react';

//Das Station-Interface definiert Datentyp für Station mit Namen & Koordinaten
interface Station {
    NAME: string;
    WGS84_LAT: number;
    WGS84_LON: number;
}

//definiert den Kontext-Typ und gibt Stationsliste (stations) sowie Methode (addStation) zum Hinzufügen von Station an
interface StationContextType {
    stations: Station[];
    addStation: (station: Station) => void;
}

//StationContext wird erstellt und später zur Bereitstellung der Stationsdaten im Kontext verwendet
const StationContext = createContext<StationContextType | undefined>(undefined);


//Komponente implementiert den Kontextprovider für die Stationsdaten und stellt sie für die Kinderkomponenten zur Verfügung
//StationProvider verwendet useState, um Stationsliste (stations) zu verwalten, und hat addStation-Funktion, um neue Stationen hinzuzufügen.
export const StationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [stations, setStations] = useState<Station[]>([]);

    const addStation = (station: Station) => {
        setStations(prevStations => [...prevStations, station]);
    };

    return (
        <StationContext.Provider value={{stations, addStation}}>
            {children}
        </StationContext.Provider>
    );
};

//custom hook
//Custom Hook useStationContext vereinfacht Zugriff auf den Kontext und überprüft, ob der Kontext innerhalb des StationProvider verwendet wird.
export const useStationContext = () => {
    const context = useContext(StationContext);
    if (!context) {
        throw new Error('useStationContext must be used within a StationProvider');
    }
    return context;
};