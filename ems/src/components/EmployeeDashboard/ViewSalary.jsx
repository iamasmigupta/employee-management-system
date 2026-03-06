import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaArrowUp, FaArrowDown, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_URL from '../../utils/api';

const ViewSalary = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                const res = await axios.get(`${API_URL}/api/employee/by-email?email=${user.email}`);
                if (res.data.success) {
                    setEmployee(res.data.employee);
                }
            } catch (err) {
                console.log('Employee not found');
            }
        };
        fetchProfile();
    }, [user]);

    if (!employee) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">My Salary</h2>
                <p className="text-gray-500">No salary information available. Please ask admin to add you as an employee.</p>
            </div>
        );
    }

    const basic = Number(employee.salary) || 0;
    const hra = Math.round(basic * 0.15);
    const allowance = Math.round(basic * 0.08);
    const pf = Math.round(basic * 0.06);
    const tax = Math.round(basic * 0.04);
    const net = basic + hra + allowance - pf - tax;

    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            month: d.getMonth(),
            year: d.getFullYear(),
        });
    }

    const downloadPayslip = (month) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(20, 184, 166);
        doc.text('WorkSphere', 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Management System', 14, 27);

        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text(`Salary Slip - ${month.label}`, 14, 42);

        // Employee Info
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Employee: ${employee.userId?.name || 'N/A'}`, 14, 55);
        doc.text(`Email: ${employee.userId?.email || 'N/A'}`, 14, 62);
        doc.text(`Employee ID: ${employee.employeeId || 'N/A'}`, 14, 69);
        doc.text(`Department: ${employee.department?.dep_name || 'N/A'}`, 120, 55);
        doc.text(`Designation: ${employee.designation || 'N/A'}`, 120, 62);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 120, 69);

        // Salary Table
        autoTable(doc, {
            startY: 80,
            head: [['Component', 'Amount (₹)']],
            body: [
                ['Basic Salary', basic.toLocaleString()],
                ['HRA (15%)', `+ ${hra.toLocaleString()}`],
                ['Allowance (8%)', `+ ${allowance.toLocaleString()}`],
                ['Provident Fund (6%)', `- ${pf.toLocaleString()}`],
                ['Tax (4%)', `- ${tax.toLocaleString()}`],
            ],
            foot: [['Net Salary', `₹ ${net.toLocaleString()}`]],
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] },
            footStyles: { fillColor: [240, 253, 250], textColor: [20, 150, 130], fontStyle: 'bold' },
        });

        doc.setFontSize(8);
        doc.setTextColor(180);
        doc.text('This is a system-generated payslip from WorkSphere EMS.', 14, doc.internal.pageSize.height - 10);

        doc.save(`Payslip_${month.label.replace(' ', '_')}_${employee.userId?.name || 'Employee'}.pdf`);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Salary</h2>

            {/* Salary Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-500">Basic Salary</p>
                        <p className="text-2xl font-bold text-blue-600">₹{basic.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <FaArrowUp className="text-green-500 text-xs" />
                            <p className="text-sm text-gray-500">Earnings</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">₹{(hra + allowance).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">HRA: ₹{hra.toLocaleString()} + Allow: ₹{allowance.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <FaArrowDown className="text-red-500 text-xs" />
                            <p className="text-sm text-gray-500">Deductions</p>
                        </div>
                        <p className="text-2xl font-bold text-red-600">₹{(pf + tax).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">PF: ₹{pf.toLocaleString()} + Tax: ₹{tax.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <FaMoneyBillWave className="text-indigo-500 text-xs" />
                            <p className="text-sm text-gray-500">Net Salary</p>
                        </div>
                        <p className="text-2xl font-bold text-indigo-600">₹{net.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Salary Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Salary Details</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Department</span>
                        <span className="font-medium">{employee.department?.dep_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Designation</span>
                        <span className="font-medium">{employee.designation || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Basic Salary</span>
                        <span className="font-medium">₹{basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">HRA (15%)</span>
                        <span className="font-medium text-green-600">+₹{hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Allowance (8%)</span>
                        <span className="font-medium text-green-600">+₹{allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">PF (6%)</span>
                        <span className="font-medium text-red-600">-₹{pf.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tax (4%)</span>
                        <span className="font-medium text-red-600">-₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-blue-50 px-3 rounded-lg font-bold">
                        <span>Net Salary</span>
                        <span className="text-blue-600">₹{net.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Salary History / Payslip Downloads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" /> Monthly Payslips
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {months.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition">
                            <div>
                                <p className="font-medium text-gray-700 text-sm">{m.label}</p>
                                <p className="text-xs text-gray-400">₹{net.toLocaleString()} net</p>
                            </div>
                            <button
                                onClick={() => downloadPayslip(m)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-indigo-700 shadow-sm transition"
                            >
                                <FaDownload className="text-[10px]" /> PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewSalary;
