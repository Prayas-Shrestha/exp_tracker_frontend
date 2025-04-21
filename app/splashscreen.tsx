import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";

const SplashScreen = () => {
    const router = useRouter();

    // Load Montserrat Font
    const [fontsLoaded] = useFonts({ Montserrat_400Regular });

    // Fade-in effect for text opacity
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        if (fontsLoaded) {
            // Animate fade-in effect over 4 seconds
            textOpacity.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });

            // Navigate to Login screen after animation ends
            setTimeout(() => {
                router.replace("/loginscreen");
            }, 500);
        }
    }, [fontsLoaded]);

    // Animation styles
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value, // Fades text in
    }));

    if (!fontsLoaded) {
        return null; // Prevent rendering before font loads
    }

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.appName, animatedStyle]}>E X P E N S E</Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87B56C", // Your green theme color
        justifyContent: "center",
        alignItems: "center",
    },
    appName: {
        fontSize: 26, // Set font size to 26
        fontFamily: "Montserrat_400Regular", // Apply Montserrat font
        fontWeight: "bold",
        color: "white",
        letterSpacing: 3,
    },
});

export default SplashScreen;
