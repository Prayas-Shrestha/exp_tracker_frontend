import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // make sure it's installed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileDetailScreen() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        userId: "",
        gender: "Other", // default
    });
    const [editingGender, setEditingGender] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            const storedGender = await AsyncStorage.getItem("gender");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUserInfo({
                    name: parsed.name || "",
                    email: parsed.email || "",
                    userId: parsed._id || "",
                    gender: storedGender || "Other",
                });
            }
        };

        loadUser();
    }, []);

    const handleGenderChange = async (value: string) => {
        setUserInfo(prev => ({ ...prev, gender: value }));
        await AsyncStorage.setItem("gender", value);
        setEditingGender(false);
    };

    const handleSignOut = async () => {
        await AsyncStorage.clear();
        router.replace("/login");
    };

    const handleDeleteAccount = () => {
        Alert.alert("Account Deletion", "Account deletion requested!");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Profile</Text>

            <ScrollView style={styles.scrollContainer}>
                <TouchableOpacity style={styles.row}>
                    <Text style={styles.label}>My Avatar</Text>
                    <View style={styles.rowRight}>
                        <Image source={require("../assets/images/user.png")} style={styles.avatar} />
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>
                </TouchableOpacity>

                <View style={styles.row}>
                    <Text style={styles.label}>ID</Text>
                    <Text style={styles.value}>{userInfo.userId}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Nickname</Text>
                    <Text style={styles.value}>{userInfo.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{userInfo.email}</Text>
                </View>

                {/* Gender Row with Picker */}
                <TouchableOpacity style={styles.row} onPress={() => setEditingGender(!editingGender)}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.value}>{userInfo.gender}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>
                </TouchableOpacity>

                {editingGender && (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={userInfo.gender}
                            onValueChange={handleGenderChange}
                            style={{ height: 50, width: "100%" }}
                        >
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                )}

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    backButton: { position: "absolute", top: 55, left: 20, zIndex: 2 },
    title: {
        paddingTop: 55,
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        backgroundColor: "#9ACD81",
        color: "#000",
        paddingBottom: 15,
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    row: {
        backgroundColor: "#ddd",
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: "#333",
    },
    value: {
        fontSize: 16,
        color: "#666",
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    pickerContainer: {
        backgroundColor: "#f0f0f0",
        marginHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    signOutButton: {
        backgroundColor: "#6c757d",
        marginTop: 30,
        marginHorizontal: 40,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#d9534f",
        marginTop: 10,
        marginHorizontal: 40,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 50,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
