import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectRecentTransactions } from '../../store/slices/transactionSlice';
import { getCategoryLabel } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import CategoryIcon, { getCategoryColor } from '../common/CategoryIcon';

export default function RecentTransactions() {
  const recent = useSelector(selectRecentTransactions);
  const navigate = useNavigate();

  return (
    <Card className="animate-fade-in-up" padding="none">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 max-[360px]:px-3 max-[360px]:pt-3">
        <h3 className="text-base font-bold text-text-primary">Recent Transactions</h3>
        <button
          className="flex items-center gap-1 text-xs font-semibold text-primary transition-[gap] duration-150 hover:gap-2"
          onClick={() => navigate('/transactions')}
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex flex-col">
        {recent.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-bg-elevated max-[360px]:px-3 max-[360px]:gap-2">
            <CategoryIcon category={tx.category} size={18} />
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-[0.8125rem] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{tx.description}</span>
              <span className="text-xs">
                <span style={{ color: getCategoryColor(tx.category) }} className="font-medium">{getCategoryLabel(tx.category)}</span>
                <span className="text-text-muted"> · {formatDate(tx.date, 'dayMonth')}</span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[0.8125rem] font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <Badge variant={tx.type} size="sm">{tx.type}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
