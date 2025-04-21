import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions
} from "react-native";
import {
    Ionicons, MaterialCommunityIcons, FontAwesome5
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        userId: "",
    });

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUserInfo({
                    name: parsed.name || "",
                    email: parsed.email || "",
                    userId: parsed._id || "",
                });
            }
        };
        loadUser();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Image source={require("../assets/images/user.png")} style={styles.avatar} />
                <View>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    <Text style={styles.userId}>ID: {userInfo.userId}</Text>
                    <Text style={styles.userId}>Email: {userInfo.email}</Text>
                </View>
            </View>

            {/* Settings Options */}
            <ScrollView style={styles.cardContainer}>
                <Option icon="settings-outline" label="Settings" onPress={() => { }} />
                <Option icon="person-outline" label="Profile" onPress={() => router.push("/profile-detail")} />
                <Option icon="information-outline" label="Information Sector" onPress={() => { }} />
                <Option icon="bank" label="  Multiple Bank Account" onPress={() => { }} iconLib="FontAwesome5" />
                <Option icon="sync" label="Sync" onPress={() => { }} />
                <Option icon="file-pdf-box" label="Export PDF" onPress={() => { }} iconLib="MaterialCommunityIcons" />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.tabBar}>
                <TabItem source={require("../assets/icons/records.png")} label="Records" onPress={() => router.push("/records")} />
                <TabItem source={require("../assets/icons/charts.png")} label="Charts" onPress={() => router.push("/charts")} />
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addExpense")}>
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
                <TabItem source={require("../assets/icons/reports.png")} label="Reports" onPress={() => router.push("/reports")} />
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person-outline" size={24} color="#000" />
                    <Text style={styles.tabLabel}>Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const Option = ({ icon, label, onPress, iconLib = "Ionicons" }: any) => {
    const IconLib =
        iconLib === "MaterialCommunityIcons"
            ? MaterialCommunityIcons
            : iconLib === "FontAwesome5"
                ? FontAwesome5
                : Ionicons;

    return (
        <TouchableOpacity style={styles.optionRow} onPress={onPress}>
            <View style={styles.optionLeft}>
                <IconLib name={icon} size={20} color="#6CC551" style={{ marginRight: 10 }} />
                <Text style={styles.optionText}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
    );
};

const TabItem = ({ source, label, onPress }: { source: any; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
        <Image source={source} style={styles.tabIcon} />
        <Text style={styles.tabLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        backgroundColor: "#9ACD81",
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    avatar: { width: 70, height: 70, borderRadius: 35 },
    name: { fontSize: 18, fontWeight: "bold", color: "#000" },
    userId: { fontSize: 14, color: "#333", marginTop: 2 },
    cardContainer: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    optionRow: {
        backgroundColor: "#ddd",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: "#bbb",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    optionLeft: { flexDirection: "row", alignItems: "center" },
    optionText: { fontSize: 16, color: "#000" },
    tabBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    tabItem: { alignItems: "center", justifyContent: "center" },
    tabLabel: { fontSize: 12, marginTop: 2 },
    tabIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    addButton: {
        width: 64,
        height: 64,
        backgroundColor: "#7B997C",
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
    },
});
