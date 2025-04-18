import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Must be called once in the root (assuming this is handled elsewhere)
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const router = useRouter();

    // Google Auth setup from first code
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "202569895992-t6oaq5fj187c0f1nqvmltn902o6627sj.apps.googleusercontent.com",
        scopes: ["openid", "email", "profile"],
    });

    // Log redirect URI for verification (optional, from first code)
    useEffect(() => {
        if (request?.redirectUri) {
            console.log("👉 REDIRECT URI used:", request.redirectUri);
        }
    }, [request]);

    // Handle Google login response (from first code)
    useEffect(() => {
        console.log("🔁 Google Auth Response:", response);

        if (response?.type === "success") {
            const accessToken = response?.authentication?.accessToken;

            if (accessToken) {
                console.log("✅ Access Token:", accessToken);
                loginWithGoogleToken(accessToken); // Send access token to backend
            }
        } else if (response?.type === "error") {
            Alert.alert("Google Sign-In Error", "Try again.");
        }
    }, [response]);

    // Send Google Access Token to backend (from first code)
    const loginWithGoogleToken = async (accessToken: string) => {
        try {
            console.log("🔐 Sending accessToken to backend:", accessToken);

            const res = await fetch("https://expenses-tracker-8k6o.onrender.com/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Backend Response:", data);
                await AsyncStorage.setItem("token", data.token);
                Alert.alert("✅ Signed in with Google!");
                router.replace("/home"); // Using replace instead of push for cleaner navigation
            } else {
                console.error("❌ Login failed:", data);
                Alert.alert("Login Failed", data.msg || "Try again.");
            }
        } catch (err) {
            console.error("❌ Google Sign-in Error:", err);
            Alert.alert("Server Error", "Could not reach the backend.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expense Tracker App</Text>
            <View style={styles.card}>
                <Image source={require("../assets/images/pig.png")} style={styles.image} />

                <Text style={styles.subtitle}>Please sign in or register</Text>

                {/* Sign in button navigates to /login */}
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>

                {/* Register button navigates to /signupscreen */}
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/signupscreen")}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                {/* Google Login with promptAsync from first code */}
                <TouchableOpacity style={styles.googleRow} onPress={() => promptAsync()}>
                    <Image source={require("../assets/icons/google.png")} style={styles.googleIcon} />
                    <Text style={styles.googleText}>Sign in with google</Text>
                </TouchableOpacity>
            </View>

            {/* Removed empty TouchableOpacity from second code */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87B56C",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        alignItems: "center",
        width: "100%",
    },
    image: {
        width: 140,
        height: 140,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        color: "white",
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        color: "white",
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: "#E0DFDF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginVertical: 6,
        width: "40%",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "500",
    },
    googleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    googleIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
    },
    googleText: {
        color: "white",
        fontSize: 16,
    },
});

export default LoginScreen;