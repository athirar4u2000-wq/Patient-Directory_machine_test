/**
 * API Service for Patient Directory
 * 
 * Handles fetching patient data with Basic Authentication and pagination.
 * Notice on CORS:
 * Cross-origin browser requests directly to https://demo.lupinary.com fail because
 * the backend REST_Controller fails with HTTP 500 on preflight (OPTIONS) requests
 * (missing "index_options" callback).
 * We use Vite's dev server proxy (/api -> https://demo.lupinary.com) to bypass
 * the browser preflight restriction seamlessly.
 */

export const API_CONFIG = {
  // Use relative path for Vite dev proxy; can be overridden if needed
  BASE_URL: '/api/patients',
  DIRECT_URL: 'https://demo.lupinary.com/api/patients',
  DEFAULT_USER_ID: 1,
  DEFAULT_CLINIC_ID: 1,
  DEFAULT_PAGE_NO: 0,
  USERNAME: 'doctosmarttest',
  PASSWORD: '$2y$12$9Za7UtNOljRUWVmVrq8yv.ZpuzEhK6yzI.gdKRCxw2EtUfvxySV3S',
};

/**
 * Encodes Basic Auth credentials
 */
export function getBasicAuthHeader(username = API_CONFIG.USERNAME, password = API_CONFIG.PASSWORD) {
  const credentials = `${username}:${password}`;
  const base64 = btoa(credentials);
  return `Basic ${base64}`;
}

/**
 * Fetches patients list from API
 * @param {Object} params
 * @param {number} params.pageNo
 * @param {number} params.userId
 * @param {number} params.clinicId
 * @param {boolean} params.useDirectUrl - If true, calls https://demo.lupinary.com directly
 * @returns {Promise<{ result: Array, totalCount: number, message: string }>}
 */
export async function fetchPatients({
  pageNo = API_CONFIG.DEFAULT_PAGE_NO,
  userId = API_CONFIG.DEFAULT_USER_ID,
  clinicId = API_CONFIG.DEFAULT_CLINIC_ID,
  useDirectUrl = false,
} = {}) {
  const baseUrl = useDirectUrl ? API_CONFIG.DIRECT_URL : API_CONFIG.BASE_URL;
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('user_id', String(userId));
  url.searchParams.set('clinic_id', String(clinicId));
  url.searchParams.set('page_no', String(pageNo));

  const headers = {
    'Authorization': getBasicAuthHeader(),
    'Accept': 'application/json',
  };

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed (401 Unauthorized). Please check your Basic Auth credentials.');
    }
    if (response.status === 403) {
      throw new Error('Access forbidden (403 Forbidden).');
    }
    if (response.status === 404) {
      throw new Error('API endpoint not found (404 Not Found).');
    }
    if (response.status >= 500) {
      throw new Error(`Server error (${response.status} ${response.statusText}). The remote server encountered an internal issue.`);
    }
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // If the server returned an explicit error status or message
  if (data.status === false) {
    throw new Error(data.message || 'The server returned an unsuccessful status.');
  }

  return {
    patients: Array.isArray(data.result) ? data.result : [],
    totalCount: typeof data.total_count === 'number' ? data.total_count : (data.result?.length || 0),
    message: data.message || '',
  };
}
