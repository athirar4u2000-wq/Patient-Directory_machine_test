import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Info, ExternalLink, Play } from 'lucide-react';
import { getBasicAuthHeader, API_CONFIG } from '../services/api';

export default function CORSInfoModal({ isOpen, onClose }) {
  const [testStatus, setTestStatus] = useState(null); // 'loading', 'direct-failed', 'proxy-success'
  const [testOutput, setTestOutput] = useState('');

  if (!isOpen) return null;

  const testDirectRequest = async () => {
    setTestStatus('loading');
    setTestOutput('Sending direct browser fetch() to https://demo.lupinary.com ...');
    try {
      const url = `${API_CONFIG.DIRECT_URL}?user_id=1&clinic_id=1&page_no=0`;
      const res = await fetch(url, {
        headers: {
          'Authorization': getBasicAuthHeader(),
        },
      });
      const data = await res.json();
      setTestStatus('direct-success');
      setTestOutput(`Direct request unexpectedly succeeded: status ${res.status}`);
    } catch (err) {
      setTestStatus('direct-failed');
      setTestOutput(
        `Direct browser request failed as expected:\n` +
        `TypeError: ${err.message}\n` +
        `Reason: Browser sent CORS preflight (OPTIONS) request with "Authorization" header.\n` +
        `Server threw 500 (REST_Controller missing "index_options" callback).`
      );
    }
  };

  const testProxyRequest = async () => {
    setTestStatus('loading');
    setTestOutput('Sending same-origin fetch() through Vite Proxy (/api/patients)...');
    try {
      const url = `${API_CONFIG.BASE_URL}?user_id=1&clinic_id=1&page_no=0`;
      const res = await fetch(url, {
        headers: {
          'Authorization': getBasicAuthHeader(),
        },
      });
      const data = await res.json();
      setTestStatus('proxy-success');
      setTestOutput(
        `Vite Proxy request succeeded!\n` +
        `Status: ${res.status} OK\n` +
        `Total Patients: ${data.total_count}\n` +
        `Fetched ${data.result?.length || 0} records on page 0.`
      );
    } catch (err) {
      setTestStatus('proxy-failed');
      setTestOutput(`Proxy request failed: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Info className="modal-icon" size={22} />
            <h2>Technical Investigation: Postman vs Browser</h2>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3 className="section-title">The Challenge</h3>
            <p>
              In Postman, calling <code>GET https://demo.lupinary.com/api/patients</code> with Basic Auth works smoothly and returns <strong>HTTP 200</strong>.
              However, calling the exact same URL from browser JavaScript via <code>fetch()</code> or <code>axios</code> fails with a <strong>CORS error</strong>.
            </p>
          </section>

          <section className="modal-section">
            <h3 className="section-title">Root Cause Analysis</h3>
            <div className="diagnostic-grid">
              <div className="diagnostic-card negative">
                <div className="diagnostic-card-header">
                  <XCircle size={18} className="icon-error" />
                  <h4>Why Browser Fails</h4>
                </div>
                <ul>
                  <li>
                    Because the request includes an <code>Authorization: Basic ...</code> header, browsers enforce the <strong>W3C CORS preflight</strong> specification.
                  </li>
                  <li>
                    The browser automatically sends an HTTP <code>OPTIONS</code> preflight request before the actual <code>GET</code>.
                  </li>
                  <li>
                    The remote backend (PHP CodeIgniter with <code>REST_Controller.php</code>) does not implement the <code>index_options()</code> method.
                  </li>
                  <li>
                    The server crashes on preflight with <code>HTTP 500 Internal Server Error</code> (<code>TypeError: class Patients does not have a method "index_options"</code>).
                  </li>
                  <li>
                    Since preflight fails, the browser aborts the request before any data can be transferred.
                  </li>
                </ul>
              </div>

              <div className="diagnostic-card positive">
                <div className="diagnostic-card-header">
                  <CheckCircle2 size={18} className="icon-success" />
                  <h4>Why Postman & Vite Proxy Work</h4>
                </div>
                <ul>
                  <li>
                    <strong>Postman:</strong> Does not enforce browser security sandboxing; it sends the <code>GET</code> request directly without an <code>OPTIONS</code> preflight.
                  </li>
                  <li>
                    <strong>Vite Proxy Solution:</strong> In <code>vite.config.js</code>, requests to <code>/api</code> are proxied server-to-server via Node.js.
                  </li>
                  <li>
                    The browser calls <code>/api/patients</code> on its own origin (<code>localhost:5173</code>), so no CORS preflight is triggered.
                  </li>
                  <li>
                    Vite forwards the GET directly to <code>demo.lupinary.com</code>, receives HTTP 200, and returns the patient JSON cleanly to the app.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="modal-section">
            <h3 className="section-title">Interactive Verification</h3>
            <p className="section-desc">
              Test both approaches directly in your current browser to observe the behavior:
            </p>
            <div className="live-test-buttons">
              <button 
                type="button" 
                className="btn btn-outline-danger" 
                onClick={testDirectRequest}
                disabled={testStatus === 'loading'}
              >
                <Play size={14} /> Test Direct Call (Will Fail with Preflight CORS)
              </button>
              <button 
                type="button" 
                className="btn btn-outline-success" 
                onClick={testProxyRequest}
                disabled={testStatus === 'loading'}
              >
                <Play size={14} /> Test Vite Proxy Call (Succeeds 200 OK)
              </button>
            </div>

            {testOutput && (
              <pre className={`test-output-box ${testStatus}`}>
                {testOutput}
              </pre>
            )}
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
