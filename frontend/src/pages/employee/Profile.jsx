import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import UserNavbar from '../../components/layout/UserNavbar';
import EmployeeSidebar from '../../components/layout/EmployeeSidebar';
import { Edit3, Save, X, Loader, Mail, Briefcase, Building2, Phone, User, CheckCircle2 } from 'lucide-react';

export default function EmployeeProfile() {
  const [profile, setProfile] = useState({ name: '', email: '', title: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data.user || res.data.data || res.data || {});
    } catch (err) {
      setMessage('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/user/profile', profile);
      setMessage('Profile updated successfully');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <EmployeeSidebar />
      <UserNavbar title="My Profile" />
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">View and manage your profile information</p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {message.includes('successfully') ? <CheckCircle2 size={20} /> : <X size={20} />}
              {message}
            </div>
          )}

          {loading && !editing ? (
            <div className="flex items-center justify-center h-64">
              <Loader size={40} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white">
                    {getInitials(profile.name || 'Employee')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name || 'Employee'}</h2>
                    <p className="text-blue-100">{profile.email}</p>
                    {profile.title && <p className="text-blue-100 text-sm mt-1">Position: {profile.title}</p>}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <User size={16} className="text-blue-600" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profile.name || ''} 
                    onChange={handleChange} 
                    disabled={!editing} 
                    className={`w-full px-4 py-2.5 border-2 rounded-lg transition ${
                      editing 
                        ? 'border-gray-200 focus:border-blue-500 focus:outline-none' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`} 
                  />
                </div>

                {/* Email (Disabled) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <Mail size={16} className="text-blue-600" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={profile.email || ''} 
                    disabled 
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <Briefcase size={16} className="text-blue-600" />
                    Job Title
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    value={profile.title || ''} 
                    onChange={handleChange} 
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg transition ${
                      editing 
                        ? 'border-gray-200 focus:border-blue-500 focus:outline-none' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <Building2 size={16} className="text-blue-600" />
                    Department
                  </label>
                  <input 
                    type="text" 
                    name="department" 
                    value={profile.department || ''} 
                    onChange={handleChange} 
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg transition ${
                      editing 
                        ? 'border-gray-200 focus:border-blue-500 focus:outline-none' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    <Phone size={16} className="text-blue-600" />
                    Phone Number
                  </label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={profile.phone || ''} 
                    onChange={handleChange} 
                    disabled={!editing}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg transition ${
                      editing 
                        ? 'border-gray-200 focus:border-blue-500 focus:outline-none' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  {!editing ? (
                    <button 
                      onClick={() => setEditing(true)} 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleSave} 
                        disabled={loading} 
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
                      >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => { setEditing(false); fetchProfile(); }} 
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
