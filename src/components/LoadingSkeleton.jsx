import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSkeleton({ rowCount = 8 }) {
  const rows = Array.from({ length: rowCount });

  return (
    <div className="loading-container" aria-live="polite" aria-busy="true">
      <div className="loading-banner">
        <Loader2 className="spinner-icon" size={22} />
        <div className="loading-text-group">
          <span className="loading-title">Loading patient data...</span>
          <span className="loading-subtitle">Fetching records from clinic database</span>
        </div>
      </div>

      <div className="table-responsive-wrapper skeleton-wrapper">
        <table className="patients-table skeleton-table">
          <thead>
            <tr>
              <th className="th-reg-id">Reg. ID</th>
              <th className="th-name">Name</th>
              <th className="th-gender">Gender</th>
              <th className="th-age">Age</th>
              <th className="th-mobile">Mobile</th>
              <th className="th-address">Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, i) => (
              <tr key={`skeleton-${i}`} className="skeleton-row">
                <td><div className="skeleton-pill skeleton-shimmer" style={{ width: '65px' }} /></td>
                <td>
                  <div className="skeleton-name-box">
                    <div className="skeleton-avatar skeleton-shimmer" />
                    <div className="skeleton-line skeleton-shimmer" style={{ width: `${80 + (i % 3) * 35}px` }} />
                  </div>
                </td>
                <td><div className="skeleton-pill skeleton-shimmer" style={{ width: '50px' }} /></td>
                <td><div className="skeleton-line skeleton-shimmer" style={{ width: '40px' }} /></td>
                <td><div className="skeleton-line skeleton-shimmer" style={{ width: '95px' }} /></td>
                <td><div className="skeleton-line skeleton-shimmer" style={{ width: `${100 + (i % 4) * 30}px` }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
