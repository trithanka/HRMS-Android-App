import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

// import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useSession } from "@/contexts/authContext";
import LoadingScreen from "@/components/loading-screen";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarMaterialIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarMaterialCommunityIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) => (
            <TabBarMaterialIcon name="work" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="attendance-history"
        options={{
          title: "Attendance History",
          tabBarIcon: ({ color }) => (
            <TabBarMaterialIcon name="work-history" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leave"
        options={{
          title: "Leave",
          tabBarIcon: ({ color }) => (
            <TabBarMaterialCommunityIcon name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leave-history"
        options={{
          title: "Leave History",
          tabBarIcon: ({ color }) => (
            <TabBarMaterialCommunityIcon name="calendar-clock" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          // headerRight: () => (
          //   <Link href="/profile-edit" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <Feather
          //           name="edit"
          //           size={18}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
    </Tabs>
  );
}
