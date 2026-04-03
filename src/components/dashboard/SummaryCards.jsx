import { useSelector } from 'react-redux';
import { selectSummary, selectInsights } from '../../store/slices/transactionSlice';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import AnimatedNumber from '../common/AnimatedNumber';
import Card from '../common/Card';

const cards = [
  {
    key: 'totalBalance',
    label: 'Total Balance',
    icon: Wallet,
    gradient: 'from-[#3B82F6] to-[#8B5CF6]',
    iconBg: 'bg-primary-light text-primary',
    prefix: '₹',
  },
  {
    key: 'totalIncome',
    label: 'Total Income',
    icon: TrendingUp,
    gradient: 'from-[#10B981] to-[#34D399]',
    iconBg: 'bg-income-light text-income',
    prefix: '₹',
  },
  {
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    gradient: 'from-[#F43F5E] to-[#FB7185]',
    iconBg: 'bg-expense-light text-expense',
    prefix: '₹',
  },
  {
    key: 'transactionCount',
    label: 'Transactions',
    icon: ArrowLeftRight,
    gradient: 'from-[#06B6D4] to-[#22D3EE]',
    iconBg: 'bg-info-light text-info',
    prefix: '',
    decimals: 0,
  },
];

export default function SummaryCards() {
  const summary = useSelector(selectSummary);
  const insights = useSelector(selectInsights);

  const getTrend = (key) => {
    if (key === 'totalExpenses') return insights.expenseChangePercent;
    if (key === 'totalIncome') return insights.incomeChangePercent;
    return null;
  };

  return (
    <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-3 stagger-children">
      {cards.map(card => {
        const Icon = card.icon;
        const value = summary[card.key] || 0;
        const trend = getTrend(card.key);

        return (
          <Card key={card.key} className="relative overflow-hidden" hover padding="md">
            {/* Top gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradient} rounded-t-lg`} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.8125rem] font-medium text-text-secondary">{card.label}</span>
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${card.iconBg}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-text-primary mb-2 tracking-tight max-[480px]:text-xl">
              <AnimatedNumber
                value={value}
                prefix={card.prefix}
                decimals={card.decimals !== undefined ? card.decimals : 2}
                duration={1200}
              />
            </div>
            {trend !== null && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-income' : 'text-expense'}`}>
                {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
