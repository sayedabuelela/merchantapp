import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { FileInfo } from '../documents/documents.model';

export function useFilePicker() {
    const [image, setImage] = useState<FileInfo | undefined>(undefined);
    const [document, setDocument] = useState<FileInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const requestImagePermissions = useCallback(async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                return false;
            }
        }
        return true;
    }, []);

    const pickImage = useCallback(async (options?: ImagePicker.ImagePickerOptions) => {
        try {
            setIsLoading(true);
            const hasPermission = await requestImagePermissions();
            if (!hasPermission) {
                throw new Error('Permission to access media library denied');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                quality: 0.8,
                allowsMultipleSelection: false,
                ...options,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];
                const fileNameParts = asset.uri.split('/');
                const fileName = fileNameParts[fileNameParts.length - 1];

                const fileInfo: FileInfo = {
                    uri: asset.uri,
                    name: fileName,
                    type: asset.mimeType || `image/${fileName.split('.').pop() || 'jpeg'}`,
                    size: asset.fileSize,
                };

                setImage(fileInfo);
                return fileInfo;
            }
            return null;
        } catch (error) {
            console.error('Error picking image:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [requestImagePermissions]);

    const pickDocument = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                // copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];

                const fileInfo: FileInfo = {
                    uri: asset.uri,
                    name: asset.name || 'document.pdf',
                    type: asset.mimeType || 'application/pdf',
                    size: asset.size || 0,
                };

                setDocument(fileInfo);
                return fileInfo;
            }
            return null;
        } catch (error) {
            console.error('Error picking document:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const selectCamera = useCallback(async () => {
        try {
            setIsLoading(true);
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access camera denied');
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                quality: 0.8,
            });

            // Process similar to pickImage
            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];
                const fileNameParts = asset.uri.split('/');
                const fileName = fileNameParts[fileNameParts.length - 1];

                const fileInfo: FileInfo = {
                    uri: asset.uri,
                    name: fileName,
                    type: asset.mimeType || `image/${fileName.split('.').pop() || 'jpeg'}`,
                    size: asset.fileSize,
                };

                setImage(fileInfo);
                return fileInfo;
            }
            return null;
        } catch (error) {
            console.error('Error taking picture:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearImage = useCallback(() => {
        setImage(undefined);
    }, []);

    const clearDocument = useCallback(() => {
        setDocument(null);
    }, []);

    return {
        image,
        document,
        pickImage,
        pickDocument,
        selectCamera,
        clearImage,
        clearDocument,
        isLoading
    };
}