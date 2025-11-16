import BalancesScreen from "@/src/modules/balance/views/balance-home";
import { BalanceProvider } from "@/src/modules/balance/context/BalanceContext";

export default function Balance() {
    return (
        <BalanceProvider>
            <BalancesScreen />
        </BalanceProvider>
    )
}
