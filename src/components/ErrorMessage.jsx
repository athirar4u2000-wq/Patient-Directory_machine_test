import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

export default function ErrorMessage({ error, onRetry, onOpenDiagnostics }) {
  const isCorsOrNetwork = 
    error?.message?.toLowerCase().includes('failed to fetch') ||
    error?.message?.toLowerCase().includes('cors') ||
    error?.message?.toLowerCase().includes('network');

  return (
    <div className="error-card" role="alert">
      <div className="error-icon-wrapper">
        <AlertTriangle className="error-icon" size={28} />
      </div>

      <div className="error-content">
        <h3 className="error-title">Unable to Load Patients</h3>
        <p className="error-text">
          {error?.message || 'An unexpected error occurred while fetching the patient list.'}
        </p>

        {isCorsOrNetwork && (
          <div className="error-cors-hint">
            <strong>Browser Preflight / CORS Issue Detected:</strong>
            <p>
              Direct browser requests to <code>https://demo.lupinary.com</code> trigger an HTTP OPTIONS preflight request that fails with status 500 on the server.
              Ensure you are running the app with Vite proxy enabled.
            </p>
            {onOpenDiagnostics && (
              <button 
                type="button" 
                onClick={onOpenDiagnostics} 
                className="btn-link"
              >
                <HelpCircle size={14} /> View Investigation & Diagnostic Details
              </button>
            )}
          </div>
        )}

        <div className="error-actions">
          {onRetry && (
            <button 
              type="button" 
              onClick={onRetry} 
              className="btn btn-primary"
            >
              <RefreshCw size={15} /> Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
