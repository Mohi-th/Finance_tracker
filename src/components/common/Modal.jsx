import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',  // 'sm' | 'md' | 'lg'
  showClose = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const sizeClasses = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[700px]',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-[200] p-4 animate-fade-in max-sm:items-end max-sm:p-3 max-[360px]:p-2"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-bg-secondary border border-border rounded-xl w-full max-h-[90vh] flex flex-col shadow-lg animate-scale-in max-sm:rounded-b-none max-sm:max-h-[85vh] ${sizeClasses[size]}`}
        ref={modalRef}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0 max-[360px]:px-4 max-[360px]:py-4">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          {showClose && (
            <button
              className="text-text-secondary p-2 rounded-[6px] transition-all duration-150 hover:text-text-primary hover:bg-bg-elevated"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-6 overflow-y-auto max-[360px]:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
