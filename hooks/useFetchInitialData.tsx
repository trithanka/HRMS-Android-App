import * as React from "react";
import { useSession } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { QUERY_KEY } from "@/constants/keys";
import { fetchInitialData } from "@/api/profile.api";
import { Coordinate, isWithinRadius, toast } from "@/utils/helpers";

export default function useFetchInitialData() {
  const { session }: any = useSession();
  const [location, setLocation] = React.useState<Location.LocationObject>();
  const [locationErrorMsg, setLocationErrorMsg] = React.useState<string>();
  const [isInside, setIsInside] = React.useState(false);

  const { isLoading, isSuccess, data, refetch } = useQuery({
    queryKey: [QUERY_KEY.INITIAL_DATA],
    queryFn: () => fetchInitialData(session),
    refetchInterval: 60000,
  });

  async function fetchLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      toast("Permission to access location was denied");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});

    setLocation(currentLocation);
  }

  React.useEffect(() => {
    fetchLocation();
  }, []);

  async function verifyIsInside() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      toast("Permission to access location was denied");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});

    setLocation(currentLocation);

    const userCoord: Coordinate = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    const target: Coordinate = {
      latitude: Number(data?.coordinates.lat1),
      longitude: Number(data?.coordinates.long1),
    };

    const isInside = isWithinRadius(userCoord, target, 0.1);
    return isInside;
  }

  React.useEffect(() => {
    if (isSuccess && location) {
      const userCoord: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const target: Coordinate = {
        latitude: Number(data?.coordinates.lat1),
        longitude: Number(data?.coordinates.long1),
      };

      const isInside = isWithinRadius(userCoord, target, 0.1);

      setIsInside(isInside);
    }
  }, [isSuccess, location]);

  return {
    isLoading,
    data,
    isInside,
    location,
    locationErrorMsg,
    refetch,
    verifyIsInside,
    fetchLocation,
  };
}
