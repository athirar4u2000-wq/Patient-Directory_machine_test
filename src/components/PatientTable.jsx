import React from 'react';
import PatientRow from './PatientRow';
import { Users } from 'lucide-react';

export default function PatientTable({ patients }) {
  if (!patients || patients.length === 0) {
    return (
      <div className="empty-table-state">
        <Users size={40} className="empty-icon" />
        <h3 className="empty-title">No patients found</h3>
        <p className="empty-desc">There are no records matching your current criteria or page.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="patients-table">
        <thead>
          <tr>
            <th className="th-reg-id" scope="col">Reg. ID</th>
            <th className="th-name" scope="col">Name</th>
            <th className="th-gender" scope="col">Gender</th>
            <th className="th-age" scope="col">Age</th>
            <th className="th-mobile" scope="col">Mobile</th>
            <th className="th-address" scope="col">Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <PatientRow 
              key={patient.id || `patient-${index}`} 
              patient={patient} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
