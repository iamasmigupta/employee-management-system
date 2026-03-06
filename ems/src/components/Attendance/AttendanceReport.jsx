import React, { useState } from 'react';

const AttendanceReport = () => {
  const [date, setDate] = useState('2025-01-24');

  const data = [
    { id: 1, empId: 'kh112', name: 'khalil', department: 'Database', status: 'absent' },
    { id: 2, empId: 'asif113', name: 'asif', department: 'Database', status: 'sick' },
    { id: 3, empId: 'musa111', name: 'musa', department: 'IT', status: 'present' },
    { id: 4, empId: 'latif111', name: 'Latif', department: 'IT', status: 'present' },
    { id: 5, empId: 'yousaf222', name: 'yousaf', department: 'Logistic', status: 'present' },
  ];

  return (
    <div>
      <h2>Attendance Report</h2>
      <label>Filter by Date: </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <p>Date: <strong>{date}</strong></p>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp, i) => (
            <tr key={emp.id}>
              <td>{i + 1}</td>
              <td>{emp.empId}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: '10px' }}>Load More</button>
    </div>
  );
};

export default AttendanceReport;
