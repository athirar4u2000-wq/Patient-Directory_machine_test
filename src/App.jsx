import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Building2, 
  Database,
  Filter
} from 'lucide-react';
import { fetchPatients, API_CONFIG } from './services/api';
import PatientTable from './components/PatientTable';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import CORSInfoModal from './components/CORSInfoModal';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(API_CONFIG.DEFAULT_PAGE_NO);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  // Fetch patient data from API
  const loadPatients = useCallback(async (page = pageNo) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPatients({ pageNo: page });
      setPatients(data.patients);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [pageNo]);

  // Initial load & page change
  useEffect(() => {
    loadPatients(pageNo);
  }, [pageNo, loadPatients]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPageNo(newPage);
  };

  // Filter patients locally by search term
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase().trim();
    return patients.filter((patient) => {
      const name = (patient.patient_name || '').toLowerCase();
      const regId = (patient.registration_id || '').toLowerCase();
      const mobile = (patient.mobile_no || '').toLowerCase();
      const address = (patient.address || '').toLowerCase();
      const gender = (patient.gender || '').toLowerCase();
      return (
        name.includes(q) ||
        regId.includes(q) ||
        mobile.includes(q) ||
        address.includes(q) ||
        gender.includes(q)
      );
    });
  }, [patients, searchQuery]);

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <Building2 size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Patient Directory</h1>
            <p className="brand-subtitle">
              Clinic ID: <strong>{API_CONFIG.DEFAULT_CLINIC_ID}</strong> • User ID: <strong>{API_CONFIG.DEFAULT_USER_ID}</strong> • Basic Auth Active
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadPatients(pageNo)}
            disabled={isLoading}
            title="Refresh current data"
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Controls Bar: Search & Status summary */}
        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search current page by Name, Reg. ID, Mobile, or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="status-badges">
            <div className="meta-badge">
              <Database size={14} />
              <span>
                Total Records: <strong>{totalCount}</strong>
              </span>
            </div>
            <div className="meta-badge auth-badge">
              <ShieldCheck size={14} />
              <span>Auth: doctosmarttest</span>
            </div>
          </div>
        </div>

        {/* Dynamic Table Card */}
        <section className="card table-card">
          <div className="card-header">
            <div className="card-header-title">
              <Users size={18} />
              <h2>Registered Patients</h2>
            </div>
            {searchQuery && (
              <div className="search-filter-tag">
                <Filter size={13} />
                <span>Filtered {filteredPatients.length} of {patients.length} items</span>
              </div>
            )}
          </div>

          {/* Conditional Rendering: Loading vs Error vs Content */}
          {isLoading ? (
            <LoadingSkeleton rowCount={10} />
          ) : error ? (
            <div className="content-padding">
              <ErrorMessage
                error={error}
                onRetry={() => loadPatients(pageNo)}
                onOpenDiagnostics={() => setIsDiagnosticOpen(true)}
              />
            </div>
          ) : (
            <>
              <PatientTable patients={filteredPatients} />
              <Pagination
                currentPage={pageNo}
                pageSize={10}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
      </main>



      {/* CORS Diagnostic Modal */}
      <CORSInfoModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </div>
  );
}
