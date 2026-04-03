import { useSelector, useDispatch } from 'react-redux';
import {
  selectPaginatedTransactions,
  deleteTransactionAsync,
  setPage,
  selectTransactionLoading,
  selectOperationType,
} from '../../store/slices/transactionSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import { getCategoryLabel } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import CategoryIcon, { getCategoryColor } from '../common/CategoryIcon';

export default function TransactionList() {
  const dispatch = useDispatch();
  const { data: transactions, total, totalPages, currentPage } = useSelector(selectPaginatedTransactions);
  const role = useSelector(s => s.ui.role);
  const isAdmin = role === 'admin';
  const loading = useSelector(selectTransactionLoading);
  const operationType = useSelector(selectOperationType);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransactionAsync(id)).unwrap();
        dispatch(addToast({ message: 'Transaction deleted', type: 'success' }));
      } catch (err) {
        dispatch(addToast({ message: err || 'Failed to delete', type: 'error' }));
      }
    }
  };

  const handleEdit = (tx) => {
    dispatch(openModal({ type: 'editTransaction', data: tx }));
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No transactions found"
        message="Try adjusting your filters or add a new transaction."
      />
    );
  }

  return (
    <div className="animate-fade-in relative">
      {/* Loading overlay for delete operations */}
      {loading && operationType === 'delete' && (
        <div className="absolute inset-0 bg-bg-secondary/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-md">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 size={18} className="animate-spin" />
            <span>Deleting...</span>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="overflow-x-auto max-md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Transaction</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Type</th>
              {isAdmin && <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} className="animate-fade-in-up hover:bg-bg-elevated" style={{ animationDelay: `${i * 30}ms`, opacity: 0 }}>
                <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle last:border-b-0">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={tx.category} size={16} />
                    <span className="font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{tx.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle">
                  <span
                    className="font-semibold text-[0.8125rem]"
                    style={{ color: getCategoryColor(tx.category) }}
                  >
                    {getCategoryLabel(tx.category)}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle text-text-secondary whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle">
                  <span className={`font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle">
                  <Badge variant={tx.type}>{tx.type}</Badge>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 border-b border-border text-[0.8125rem] align-middle">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-[6px] text-text-muted transition-all duration-150 hover:text-primary hover:bg-primary-light" onClick={() => handleEdit(tx)} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button className="p-2 rounded-[6px] text-text-muted transition-all duration-150 hover:text-expense hover:bg-expense-light" onClick={() => handleDelete(tx.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="hidden max-md:flex flex-col gap-2">
        {transactions.map((tx, i) => (
          <div key={tx.id} className="px-4 py-3 border-b border-border animate-fade-in-up max-[360px]:px-3" style={{ animationDelay: `${i * 30}ms`, opacity: 0 }}>
            <div className="flex items-center gap-3">
              <CategoryIcon category={tx.category} size={16} />
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-[0.8125rem] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{tx.description}</span>
                <span className="text-xs">
                  <span style={{ color: getCategoryColor(tx.category) }} className="font-medium">{getCategoryLabel(tx.category)}</span>
                  <span className="text-text-muted"> · {formatDate(tx.date, 'dayMonth')}</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[0.8125rem] font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-[6px] text-text-muted transition-all duration-150 hover:text-primary hover:bg-primary-light" onClick={() => handleEdit(tx)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2 rounded-[6px] text-text-muted transition-all duration-150 hover:text-expense hover:bg-expense-light" onClick={() => handleDelete(tx.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border max-md:flex-col max-md:gap-3">
          <span className="text-xs text-text-muted">
            Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-semibold text-text-secondary transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => dispatch(setPage(currentPage - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-semibold transition-all duration-150 ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                  }`}
                  onClick={() => dispatch(setPage(page))}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-semibold text-text-secondary transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => dispatch(setPage(currentPage + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
