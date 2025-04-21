import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
    const router = useRouter();
    const [hidePassword, setHidePassword] = useState(true); // Changed to match second code's initial state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const emailRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Invalid Email", "Please enter a valid email address with alphabet and correct format.");
            return;
        }
    
        if (password.trim() === "") {
            Alert.alert("Invalid Password", "Please enter your password.");
            return;
        }
    
        try {
            const res = await fetch("https://expenses-tracker-8k6o.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                const { token, user } = data;
    
                // Save token and user details
                await AsyncStorage.setItem("token", token);
                await AsyncStorage.setItem("user", JSON.stringify(user));
    
                // Optional console log for debugging
                console.log("✅ Logged in:", user.name);
    
                router.push("/home");
            } else {
                Alert.alert("Login Failed", data.msg || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Server Error", "Could not connect to backend.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expense Tracker App</Text>
            <Image source={require("../assets/images/pig.png")} style={styles.image} />

            <Text style={styles.label}>Enter your email</Text>
            <TextInput
                placeholder=""
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Enter your password</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    placeholder=""
                    secureTextEntry={hidePassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons
                        name={hidePassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#333"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 20 }}
                onPress={() => router.push("/forgetpassword")}
            >
                <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87B56C",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    image: {
        width: 160,
        height: 160,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
        marginBottom: 30,
    },
    label: {
        color: "white",
        fontSize: 18,
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#E5E4E2",
        width: "100%",
        borderRadius: 15,
        padding: 14,
        paddingRight: 40,
        marginBottom: 15,
    },
    inputWrapper: {
        width: "100%",
        position: "relative",
        justifyContent: "center",
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    forgot: {
        color: "white",
        fontSize: 13,
    },
    loginButton: {
        backgroundColor: "#D9D9D9",
        borderRadius: 20,
        paddingVertical: 15,
        width: "60%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loginText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
});