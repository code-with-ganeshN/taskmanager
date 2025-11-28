import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Navbar from '../../components/layout/Navbar';
import { Save, Mail, Briefcase, Building2, Phone, User, Loader } from 'lucide-react';

export default function AdminProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      const data = res.data.user || res.data;
      setProfile(data);
      setForm(data);
    } catch (err) {
      console.error('fetch profile', err);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', form);
      alert('Profile updated successfully');
      setProfile(form);
    } catch (err) {
      console.error('save error', err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (!profile) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader size={40} className="animate-spin text-blue-600" />
    </div>
  );

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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">View and update your profile information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white">
                {getInitials(form.name || 'Admin')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{form.name || 'Admin User'}</h2>
                <p className="text-blue-100">{form.email}</p>
                <p className="text-blue-100 text-sm mt-1">Role: Administrator</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <User size={16} className="text-blue-600" />
                Full Name
              </label>
              <input 
                value={form.name || ''} 
                onChange={handleChange('name')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Mail size={16} className="text-blue-600" />
                Email Address
              </label>
              <input 
                value={form.email || ''} 
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
                value={form.title || ''} 
                onChange={handleChange('title')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                placeholder="e.g., System Administrator"
              />
            </div>

            {/* Department */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Building2 size={16} className="text-blue-600" />
                Department
              </label>
              <input 
                value={form.department || ''} 
                onChange={handleChange('department')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                placeholder="e.g., Management"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Phone size={16} className="text-blue-600" />
                Phone Number
              </label>
              <input 
                value={form.phone || ''} 
                onChange={handleChange('phone')} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button 
                onClick={save} 
                disabled={saving} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
