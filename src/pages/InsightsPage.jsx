import Header from '../components/layout/Header';
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart';
import InsightCards from '../components/insights/InsightCards';

export default function InsightsPage() {
  return (
    <>
      <Header title="Insights" subtitle="Financial analysis & spending patterns" />
      <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto w-full max-lg:p-4 max-sm:p-3 max-sm:gap-4 max-[360px]:p-2 max-[360px]:gap-3">
        <InsightCards />
        <MonthlyComparisonChart />
      </div>
    </>
  );
}
