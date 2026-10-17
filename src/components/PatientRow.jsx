import React from 'react';
import { User, Phone, MapPin, Hash, Calendar } from 'lucide-react';

/**
 * Helper to check if a value is empty (null, undefined, empty string, or whitespace only)
 */
function isEmpty(val) {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && val.trim() === '') return true;
  return false;
}

/**
 * Returns trimmed string or "-" placeholder
 */
function renderValue(val, fallback = '-') {
  if (isEmpty(val)) {
    return <span className="placeholder-dash">{fallback}</span>;
  }
  return String(val).trim();
}

export default function PatientRow({ patient }) {
  const regId = patient.registration_id;
  const name = patient.patient_name;
  const gender = patient.gender;
  const age = patient.age;
  const mobile = patient.mobile_no;
  const address = patient.address;

  // Clean initials for avatar
  const cleanName = (name && typeof name === 'string') ? name.trim() : '';
  const initials = cleanName
    ? cleanName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).slice(0, 2).join('')
    : '?';

  return (
    <tr className="patient-row">
      {/* 1. Reg. ID */}
      <td className="col-reg-id">
        {isEmpty(regId) ? (
          <span className="placeholder-dash">-</span>
        ) : (
          <span className="reg-id-badge">{String(regId).trim()}</span>
        )}
      </td>

      {/* 2. Name */}
      <td className="col-name">
        <div className="patient-name-container">
          <div className="patient-avatar" aria-hidden="true">
            {initials !== '?' ? initials : <User size={14} />}
          </div>
          <div className="patient-name-info">
            <span className="patient-full-name">
              {renderValue(name)}
            </span>
            {patient.id && (
              <span className="patient-db-id">ID: #{patient.id}</span>
            )}
          </div>
        </div>
      </td>

      {/* 3. Gender */}
      <td className="col-gender">
        {isEmpty(gender) ? (
          <span className="placeholder-dash">-</span>
        ) : (
          <span className={`gender-tag gender-${String(gender).trim().toLowerCase()}`}>
            {String(gender).trim()}
          </span>
        )}
      </td>

      {/* 4. Age */}
      <td className="col-age">
        {isEmpty(age) ? (
          <span className="placeholder-dash">-</span>
        ) : (
          <span className="age-text">{String(age).trim()} yrs</span>
        )}
      </td>

      {/* 5. Mobile */}
      <td className="col-mobile">
        {isEmpty(mobile) ? (
          <span className="placeholder-dash">-</span>
        ) : (
          <div className="mobile-cell">
            <Phone size={13} className="cell-icon" />
            <a href={`tel:${String(mobile).trim()}`} className="mobile-link">
              {patient.mobile_no_code ? `+${patient.mobile_no_code} ` : ''}
              {String(mobile).trim()}
            </a>
          </div>
        )}
      </td>

      {/* 6. Address */}
      <td className="col-address">
        {isEmpty(address) ? (
          <span className="placeholder-dash">-</span>
        ) : (
          <div className="address-cell" title={String(address).trim()}>
            <MapPin size={13} className="cell-icon" />
            <span className="address-text">{String(address).trim()}</span>
          </div>
        )}
      </td>
    </tr>
  );
}
