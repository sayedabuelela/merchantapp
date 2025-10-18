import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const DEVICE_ID_KEY = 'kashier-device-uuid';
let _cachedId: string | null = null;

export const getOrCreateDeviceId = async (): Promise<string> => {
    if (_cachedId) {
        return _cachedId;
    }
    let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (!id) {
        id = uuidv4();
        await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    }
    _cachedId = id;
    return id;
}