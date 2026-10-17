import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  pageSize = 10,
  totalCount,
  onPageChange,
  isLoading,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  const canGoPrev = currentPage > 0 && !isLoading;
  const canGoNext = currentPage < totalPages - 1 && !isLoading;

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalCount}</strong> patients
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-secondary btn-icon"
          disabled={!canGoPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <span className="pagination-page-indicator">
          Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          type="button"
          className="btn btn-secondary btn-icon"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
