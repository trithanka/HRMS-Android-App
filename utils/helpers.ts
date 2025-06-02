import { LEAVE_TYPES } from "@/constants/data";
import { ToastAndroid } from "react-native";

export function toast(msg: string) {
  ToastAndroid.show(msg, ToastAndroid.TOP);
}

export function formatDate(date: Date) {
  if (!date) return "No Date Found";
  const newDate = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(newDate);
}

export function formateDateShort(inputDate: Date) {
  if (!inputDate) return "No Date Found";
  // Create a new Date object from the input date string
  const date = new Date(inputDate);

  // Extract the year, month, and day from the Date object
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  // Ensure month and day are always two digits
  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function getLastMonthDate() {
  // Get the current date
  const currentDate = new Date();

  // Determine the previous month and year
  let year = currentDate.getFullYear();
  let month: number | string = currentDate.getMonth(); // getMonth() returns 0-11

  if (month === 0) {
    // If current month is January (0)
    month = 11; // Set to December
    year--; // Decrement the year
  } else {
    month--; // Otherwise, just decrement the month
  }

  // Ensure month is always two digits
  month = (month + 1).toString().padStart(2, "0"); // month+1 because getMonth() is 0-11

  // Construct the formatted date string
  const formattedDate = `${year}-${month}`;

  return formattedDate;
}

export const formattedFullDate = (dateString: string) => {
  if (!dateString?.length) return "...";
  const date = new Date(new Date(dateString));
  const parsedDateString = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    dateStyle: "full",
    weekday: "short",
  }).format(date);
  return parsedDateString;
};

export function formattedLeaveType(type: string) {
  if (!type) return;
  return (
    LEAVE_TYPES.find((value) => value.value === type)?.label ??
    "Invalid Leave Type"
  );
}

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export function isWithinRadius(
  userCoords: Coordinate,
  targetCoords: Coordinate,
  radius: number // in km
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const lat1 = userCoords.latitude;
  const lon1 = userCoords.longitude;
  const lat2 = targetCoords.latitude;
  const lon2 = targetCoords.longitude;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance <= radius; // Return true if within radius
}
