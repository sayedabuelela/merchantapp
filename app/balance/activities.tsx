import BalanceActivitiesScreen from '@/src/modules/balance/views/balance-activities'
import { BalanceProvider } from '@/src/modules/balance/context/BalanceContext'

const Activities = () => {
  return (
    <BalanceProvider>
      <BalanceActivitiesScreen />
    </BalanceProvider>
  )
}

export default Activities