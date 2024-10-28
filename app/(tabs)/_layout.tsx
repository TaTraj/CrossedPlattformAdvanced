import { Tabs } from 'expo-router';
import React from 'react';
import { StationProvider } from "@/app/(stations)/stationContext";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <StationProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home', //Home Tab
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="map"
                    options={{
                        title: 'Map', //Map Tab
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </StationProvider>
    );
}