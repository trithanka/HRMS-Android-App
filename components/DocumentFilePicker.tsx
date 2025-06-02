import * as DocumentPicker from "expo-document-picker";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Button, Text } from "@ui-kitten/components";

interface Props {
  setFile: any;
}

export default function DocumentFilePicker({ setFile }: Props) {
  const [fileName, setFileName] = React.useState<string>();

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: false,
    });

    if (result.assets) {
      const document = result?.assets[0];

      const file: string = await FileSystem.readAsStringAsync(document.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFile(file);
      setFileName(document.name);
    }
  };

  return (
    <View style={styles.container}>
      <Button appearance="outline" onPress={pickDocument}>
        Select Document
      </Button>
      <Text style={styles.textCenter}>{fileName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  textCenter: {
    textAlign: "center",
  },
});
