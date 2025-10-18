import { DownloadedFileObject, FileDownloadApiResponse } from "./documents.model";

export const transformFileContentResponse = (
    data: FileDownloadApiResponse | undefined
): { dataUri?: string; rawFileObject?: DownloadedFileObject } | null => {
    const fileObject = data?.result[0];
    if (fileObject?.file && fileObject.type) {
        if (fileObject.type.startsWith("application/octet-stream")) {
            return {
                dataUri: `data:${fileObject.type};base64,${fileObject.file}`
                , rawFileObject: fileObject 
            };
        }
        // return { rawFileObject: fileObject };
    }
    return null;
};