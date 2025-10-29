import { selectUser } from "../auth.store"
import { useAuthStore } from "../auth.store"

const useHasFeature = (feature: string) => {
    const user = useAuthStore(selectUser)
    return user?.enabledFeatures?.includes(feature) ?? false; 
}

export default useHasFeature;