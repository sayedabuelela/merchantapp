import { BalanceProvider } from "@/src/modules/balance/context/BalanceContext";
import HomeScreen from "@/src/modules/home/home.view";

export default function Home() {
    return (
        <BalanceProvider>
            <HomeScreen />
        </BalanceProvider>
    )
}
