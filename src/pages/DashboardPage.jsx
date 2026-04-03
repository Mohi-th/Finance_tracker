import Header from '../components/layout/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import SpendingBreakdownChart from '../components/charts/SpendingBreakdownChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function DashboardPage() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <>
      <Header
        title={`${greeting} 👋`}
        subtitle={now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      />
      <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto w-full max-lg:p-4 max-sm:p-3 max-sm:gap-4 max-[360px]:p-2 max-[360px]:gap-3">
        <SummaryCards />

        <div className="grid grid-cols-[1.2fr_1fr] gap-5 max-lg:grid-cols-1">
          <BalanceTrendChart />
          <SpendingBreakdownChart />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <RecentTransactions />
        </div>
      </div>
    </>
  );
}
