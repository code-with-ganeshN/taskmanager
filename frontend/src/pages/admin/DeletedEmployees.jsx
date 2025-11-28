import React, { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Navbar from '../../components/layout/Navbar';
// import { RotateCcw, Mail, Trash2, Loader } from 'lucide-react';

export default function DeletedEmployees(){
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeleted = async ()=>{
    setLoading(true);
    try {
      const res = await UserService.getDeleted();
      setDeleted(res.data.data || res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ fetchDeleted(); }, []);

  const restore = async (id)=>{
    try {
      await UserService.restore(id);
      setDeleted(prev => prev.filter(x=> x._id !== id));
    } catch (err) {
      console.error('restore error', err);
      alert('Failed to restore employee');
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 pt-20 p-6">
        <Navbar />
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Deleted Employees</h1>
            <p className="text-gray-500 mt-1">Restore deleted employee accounts</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              {deleted.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No deleted employees</p>
                  <p className="text-gray-400 text-sm mt-1">All employees are active</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Employee</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Deleted On</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deleted.map(d=> (
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
                            <span className="text-sm text-gray-600">
                              {d.deletedAt ? new Date(d.deletedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={()=> restore(d._id)} 
                              className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition text-sm font-medium"
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
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
