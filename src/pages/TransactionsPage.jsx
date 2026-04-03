import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredTransactions } from '../store/slices/transactionSlice';
import { openModal, closeModal } from '../store/slices/uiSlice';
import { Plus, Download } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const role = useSelector(s => s.ui.role);
  const modalOpen = useSelector(s => s.ui.modalOpen);
  const allFilteredTx = useSelector(selectFilteredTransactions);
  const isAdmin = role === 'admin';

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = allFilteredTx.map(tx => [
      new Date(tx.date).toLocaleDateString('en-US'),
      `"${tx.description}"`,
      tx.category,
      tx.type,
      tx.amount.toFixed(2),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header title="Transactions" subtitle={`${allFilteredTx.length} transactions found`} />
      <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto w-full max-lg:p-4 max-sm:p-3 max-sm:gap-4 max-[360px]:p-2 max-[360px]:gap-3">
        <div className="flex flex-col gap-4">
          <TransactionFilters />
          <div className="flex items-center gap-3 justify-end max-sm:flex-wrap max-[360px]:flex-col max-[360px]:items-stretch">
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
              Export CSV
            </Button>
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => dispatch(openModal({ type: 'addTransaction' }))}
              >
                Add Transaction
              </Button>
            )}
          </div>
        </div>

        <Card padding="none" className="animate-fade-in-up">
          <TransactionList />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen === 'addTransaction' || modalOpen === 'editTransaction'}
          onClose={() => dispatch(closeModal())}
          title={modalOpen === 'editTransaction' ? 'Edit Transaction' : 'Add Transaction'}
        >
          <TransactionForm />
        </Modal>
      </div>
    </>
  );
}
