import { toast } from "@/utils/helpers";
import * as FileSystem from "expo-file-system";

export default function useDownloadFile() {
  async function downloadFile(url: string, fileName: string) {
    try {
      const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + fileName
      );

      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permission.granted) {
        const base64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const data = await FileSystem.StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          fileName,
          result.headers["Content-Type"] ?? ""
        );
        await FileSystem.writeAsStringAsync(data, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        toast("Permission denied!");
      }

      toast("File Downloaded Successfully!");
    } catch (error: any) {
      toast(`Error: ${error.message ?? "Something went wrong"}`);
    }
  }

  return { downloadFile };
}
