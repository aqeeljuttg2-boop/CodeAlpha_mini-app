/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  id
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-lg transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card content Container */}
      <div
        className="
          relative w-full max-w-lg glass-panel
          rounded-2xl flex flex-col max-h-[85vh]
          animate-in fade-in zoom-in-95 duration-200 overflow-hidden
        "
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/20 dark:border-white/5 shrink-0">
            {title ? (
              <h3 className="text-base font-bold text-zinc-950 dark:text-white font-display">
                {title}
              </h3>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="
                p-1.5 rounded-lg text-zinc-405 dark:text-slate-400 hover:bg-zinc-150/40 dark:hover:bg-white/5
                hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer
              "
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Content body */}
        <div className="p-5 overflow-y-auto grow">
          {children}
        </div>
      </div>
    </div>
  );
};
