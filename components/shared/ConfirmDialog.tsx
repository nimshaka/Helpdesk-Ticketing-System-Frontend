'use client';

import { AlertTriangle } from 'lucide-react';
import CustomModal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warning,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      loading={false}
      width={480}
      headerContent={
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      }
      bodyContent={
        <div className="px-6 py-4">
          {warning && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-warning-light p-3">
              <AlertTriangle className="size-5 shrink-0 text-warning" />
              <p className="text-sm text-warning">{warning}</p>
            </div>
          )}

          <p className="mb-6 text-sm text-foreground-secondary">{message}</p>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="free-sm" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
            {variant === 'danger' ? (
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[15px] bg-error font-semibold text-foreground transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Please wait...' : confirmLabel}
              </button>
            ) : (
              <Button variant="primary" size="free-sm" onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      }
    />
  );
}
