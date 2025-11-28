import React, { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import api from '../../services/api';
import EmployeeSidebar from '../../components/layout/EmployeeSidebar';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Navbar from '../../components/layout/Navbar';
import { Edit3, Trash2, RotateCcw, Mail, Briefcase, Loader, Search, X, Plus, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Employees(){
  const [employees, setEmployees] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    department: '',
    phone: '',
  });

  const fetchAll = async ()=>{
    setLoading(true);
    try{
      const res = await UserService.getEmployees();
      setEmployees(res.data.data || res.data || []);
      const res2 = await UserService.getDeleted();
      setDeleted(res2.data.data || res2.data || []);
    }catch(err){
      console.error('fetch employees', err);
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchAll(); }, []);

  const softDelete = async (id)=>{
    if(!window.confirm('Move employee to deleted?')) return;
    await UserService.softDelete(id);
    setEmployees(prev => prev.filter(e=> e._id !== id));
  }

  const restore = async (id)=>{
    await UserService.restore(id);
    // move from deleted to employees
    const d = deleted.find(x=> x._id === id);
    if(d){ setDeleted(prev => prev.filter(x=> x._id !== id)); setEmployees(prev => [d, ...prev]); }
  }

  const addNewEmployee = async () => {
    setAddError("");
    setAddSuccess("");

    // Validation
    if (!newEmployee.name.trim()) {
      setAddError("Name is required");
      return;
    }
    if (!newEmployee.email.trim()) {
      setAddError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      setAddError("Invalid email format");
      return;
    }
    if (!newEmployee.password) {
      setAddError("Password is required");
      return;
    }
    if (newEmployee.password.length < 6) {
      setAddError("Password must be at least 6 characters");
      return;
    }
    if (newEmployee.password !== newEmployee.confirmPassword) {
      setAddError("Passwords do not match");
      return;
    }

    setAddLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: newEmployee.name.trim(),
        email: newEmployee.email.trim(),
        password: newEmployee.password,
        role: 'employee',
        title: newEmployee.title.trim() || undefined,
        department: newEmployee.department.trim() || undefined,
        phone: newEmployee.phone.trim() || undefined,
      });

      setAddSuccess(`Employee "${newEmployee.name}" created successfully!`);
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        title: '',
        department: '',
        phone: '',
      });
      
      setTimeout(() => {
        setShowAddEmployee(false);
        setAddSuccess("");
        fetchAll();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create employee';
      setAddError(errorMsg);
    } finally {
      setAddLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDeleted = deleted.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Employees</h1>
          <p className="text-gray-500 mt-1">View and manage all employee accounts</p>
        </div>

        {/* Add Employee Button */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition ${
              showAddEmployee
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'
            }`}
          >
            <Plus size={18} />
            {showAddEmployee ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {/* Add Employee Form */}
        {showAddEmployee && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Employee</h2>
            
            {/* Error Message */}
            {addError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-red-700 text-sm mt-1">{addError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {addSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Success</p>
                  <p className="text-green-700 text-sm mt-1">{addSuccess}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={newEmployee.confirmPassword}
                  onChange={(e) => setNewEmployee({...newEmployee, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="Developer, Designer, etc."
                  value={newEmployee.title}
                  onChange={(e) => setNewEmployee({...newEmployee, title: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  placeholder="Engineering, Marketing, etc."
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={addNewEmployee}
                disabled={addLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Employee
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddEmployee(false);
                  setAddError("");
                  setAddSuccess("");
                  setNewEmployee({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    title: '',
                    department: '',
                    phone: '',
                  });
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name, email, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Employees */}
            <section>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded"></div>
                    Active Employees ({filteredEmployees.length})
                  </h2>
                </div>

                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">{searchQuery ? "No employees match your search." : "No employees found."}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Employee</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map(e=> (
                          <tr key={e._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                  {getInitials(e.name)}
                                </div>
                                <span className="font-medium text-gray-900">{e.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                {e.email}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {e.title ? (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 w-fit">
                                  <Briefcase size={14} />
                                  {e.title}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={()=>{ 
                                    const title = prompt('Enter new title', e.title || ''); 
                                    if(title !== null) UserService.update(e._id, { title }).then(()=> fetchAll()); 
                                  }} 
                                  className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                                >
                                  <Edit3 size={14} />
                                  Edit
                                </button>
                                <button 
                                  onClick={()=> softDelete(e._id)} 
                                  className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Deleted Employees */}
            {filteredDeleted.length > 0 && (
              <section>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-red-600 rounded"></div>
                      Deleted Employees ({filteredDeleted.length})
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Employee</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeleted.map(d=> (
                          <tr key={d._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-sm opacity-50">
                                  {getInitials(d.name)}
                                </div>
                                <span className="font-medium text-gray-500 line-through">{d.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Mail size={16} />
                                {d.email}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <button 
                                onClick={()=> restore(d._id)} 
                                className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium"
                              >
                                <RotateCcw size={14} />
                                Restore
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
