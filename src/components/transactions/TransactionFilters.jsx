import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, clearFilters } from '../../store/slices/transactionSlice';
import { useDebouncedCallback } from '../../utils/useDebounce';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS } from '../../utils/constants';

const inputClasses = 'px-4 py-2 bg-bg-primary border border-border rounded-md text-text-primary text-[0.8125rem] h-[38px] transition-all duration-150 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)] placeholder:text-text-muted';

const selectClasses = `${inputClasses} cursor-pointer flex-1 min-w-0`;

export default function TransactionFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(s => s.transactions.filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Local search state for instant UI feedback
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced dispatch — waits 350ms after the user stops typing
  const debouncedSetSearch = useDebouncedCallback(
    useCallback((value) => {
      dispatch(setFilter({ key: 'search', value }));
    }, [dispatch]),
    350
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    dispatch(setFilter({ key: 'search', value: '' }));
  };

  const hasActiveFilters = filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo;

  const handleClearAll = () => {
    setLocalSearch('');
    dispatch(clearFilters());
  };

  const activeFilterCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    !!filters.dateFrom,
    !!filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-0 animate-fade-in">
      {/* Top bar: Search + Filters button + Sort button */}
      <div className="flex items-center gap-3 max-[400px]:flex-wrap max-[400px]:gap-2">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={localSearch}
            onChange={handleSearchChange}
            className={`${inputClasses} w-full !pl-9 !h-[42px] !rounded-lg`}
          />
          {localSearch && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted p-1 rounded-[6px] transition-all duration-150 hover:text-text-primary hover:bg-bg-elevated"
              onClick={handleClearSearch}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters toggle button */}
        <button
          onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
          className={`flex items-center gap-2 px-4 h-[42px] rounded-lg text-[0.8125rem] font-semibold transition-all duration-200 shrink-0 ${
            filtersOpen || hasActiveFilters
              ? 'bg-primary text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)]'
              : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary hover:border-text-muted'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort toggle button */}
        <div className="relative">
          <button
            onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
            className={`flex items-center justify-center w-[42px] h-[42px] rounded-lg transition-all duration-200 shrink-0 ${
              sortOpen
                ? 'bg-primary text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)]'
                : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary hover:border-text-muted'
            }`}
            title="Sort"
          >
            <ArrowUpDown size={18} />
          </button>

          {/* Sort dropdown */}
          {sortOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-bg-secondary border border-border rounded-lg shadow-xl z-50 min-w-[180px] py-1 animate-fade-in">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => {
                    dispatch(setFilter({ key: 'sort', value: s.value }));
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[0.8125rem] transition-colors duration-100 ${
                    filters.sort === s.value
                      ? 'text-primary font-semibold bg-primary-light'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expandable filter panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          filtersOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-3 p-4 bg-bg-secondary/50 border border-border rounded-lg max-lg:grid-cols-2 max-[400px]:grid-cols-1">
            {/* Type filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Type</label>
              <select
                value={filters.type}
                onChange={e => dispatch(setFilter({ key: 'type', value: e.target.value }))}
                className={selectClasses}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Category</label>
              <select
                value={filters.category}
                onChange={e => dispatch(setFilter({ key: 'category', value: e.target.value }))}
                className={selectClasses}
              >
                <option value="all">All Categories</option>
                <optgroup label="Income">
                  {CATEGORIES.income.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Expense">
                  {CATEGORIES.expense.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* From Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => dispatch(setFilter({ key: 'dateFrom', value: e.target.value }))}
                className={`${selectClasses} date-picker-dark`}
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => dispatch(setFilter({ key: 'dateTo', value: e.target.value }))}
                className={`${selectClasses} date-picker-dark`}
              />
            </div>

            {/* Clear button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 h-[38px] rounded-md text-xs font-semibold text-expense transition-all duration-150 hover:bg-expense-light shrink-0"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
