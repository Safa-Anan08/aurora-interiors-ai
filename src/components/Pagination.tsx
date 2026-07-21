"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis for large sets
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 select-none">
      {/* Prev button */}
      <button
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all
          ${hasPreviousPage
            ? 'border-white/10 bg-black/20 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 cursor-pointer'
            : 'border-white/5 bg-black/10 text-gray-600 cursor-not-allowed opacity-50'
          }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>

      {/* Page numbers */}
      {pageNumbers.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-600 text-xs select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer
              ${p === currentPage
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/10'
                : 'border-white/10 bg-black/20 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-300'
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all
          ${hasNextPage
            ? 'border-white/10 bg-black/20 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 cursor-pointer'
            : 'border-white/5 bg-black/10 text-gray-600 cursor-not-allowed opacity-50'
          }`}
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
