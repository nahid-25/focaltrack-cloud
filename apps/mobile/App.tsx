import "react-native-url-polyfill/auto";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Button, Alert, TextInput } from "react-native";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  { auth: { storage: SecureStore as any } }
);

const ORG_ID = process.env.CURRENT_ORG_ID as string;

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<"OUT" | "IN">("OUT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then((r) => setUser(r.data.user));
  }, []);

  async function signInPW() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    else {
      const u = (await supabase.auth.getUser()).data.user;
      setUser(u);
      Alert.alert("Signed in");
    }
  }

  async function clock(type: "in" | "out") {
    if (!user) {
      Alert.alert("Please sign in first.");
      return;
    }
    let coords: any = {};
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status === "granted") {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: loc.coords.accuracy
      };
    }
    const { error } = await supabase.from("clock_events").insert({
      org_id: ORG_ID,
      user_id: user.id,
      type,
      ...coords,
      device: "mobile",
      at: new Date().toISOString()
    });
    if (error) Alert.alert(error.message);
    else setStatus(type === "in" ? "IN" : "OUT");
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>FocalTrack</Text>
        <Text>{dayjs().format("YYYY-MM-DD HH:mm")}</Text>

        {!user && (
          <View style={{ marginTop: 16 }}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
            />
            <Button title="Sign In" onPress={signInPW} />
          </View>
        )}

        {user && (
          <View style={{ marginTop: 20 }}>
            <Text>Status: {status}</Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <Button title="Clock In" onPress={() => clock("in")} />
              <Button title="Clock Out" onPress={() => clock("out")} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
