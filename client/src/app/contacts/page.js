'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { TrustedContactCard } from '../../components/contacts/TrustedContactCard.js';
import { api } from '../../utils/api.js';
import { UserPlus, Shield, X, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const RELATIONSHIPS = ['Sister', 'Mother', 'Father', 'Brother', 'Friend', 'Spouse', 'Guardian', 'Colleague'];

export default function UserTrustedContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Sister');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data.contacts);
    } catch (err) {}
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);
    try {
      await api.post('/contacts', { name, relationship, phone, email });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setName('');
        setPhone('');
        setEmail('');
        setShowAddModal(false);
        loadContacts();
      }, 1200);
    } catch (err) {
      alert('We couldn\'t save this contact right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Remove this trusted contact? They will no longer receive emergency alerts.')) return;
    try { await api.delete(`/contacts/${id}`); loadContacts(); } catch (err) {}
  };

  const MAX_CONTACTS = 5;

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4 space-y-6 lg:max-w-2xl">
        <div className="flex items-end justify-between animate-fade-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A0826] tracking-tight">Trusted Contacts</h1>
            <p className="text-xs sm:text-sm font-extrabold text-[#684E67] mt-0.5">
              {contacts.length > 0
                ? `${contacts.length} of ${MAX_CONTACTS} emergency contacts connected`
                : 'Add contacts to enable emergency alerts'}
            </p>
          </div>

          {contacts.length < MAX_CONTACTS && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-4 py-2.5 rounded-full text-xs shadow-[0_6px_20px_rgba(255,42,109,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add</span>
            </button>
          )}
        </div>

        <div className="space-y-3.5 animate-fade-up">
          {contacts.length === 0 ? (
            <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white border-2 border-[#FFCCE1] hover:border-[#FF5C8A] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-[0_16px_50px_rgba(255,92,138,0.18)] transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F3] text-[#FF2A6D] border-2 border-[#FFCCE1] mx-auto flex items-center justify-center shadow-md animate-bounce">
                <Shield className="w-8 h-8 text-[#FF2A6D]" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#2A0826]">No Contacts Added</h3>
                <p className="text-xs sm:text-sm text-[#684E67] font-extrabold mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Add trusted family members or friends. They'll receive instant emergency emails with your live location link when SOS is activated.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(255,42,109,0.38)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                + Add First Contact
              </button>
            </div>
          ) : (
            <>
              {contacts.map((contact) => (
                <TrustedContactCard key={contact.id} contact={contact} onDelete={handleDeleteContact} />
              ))}

              {contacts.length < MAX_CONTACTS && (
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="w-full border-2 border-dashed border-[#FFCCE1] hover:border-[#FF2A6D] text-[#684E67] hover:text-[#FF2A6D] bg-white hover:bg-[#FFF0F3] py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#FF2A6D]" />
                  <span>Add Another Trusted Contact</span>
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-white border-2 border-[#FFCCE1] rounded-2xl p-5 text-xs text-[#684E67] font-bold shadow-xs space-y-1 animate-fade-up">
          <p className="font-black text-[#2A0826] text-xs flex items-center space-x-1.5">
            <span>🔒 Privacy & Safety</span>
          </p>
          <p className="leading-relaxed">Emergency alerts are sent only to people you explicitly add here. Location is only shared during active SOS sessions — not in the background.</p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white rounded-3xl w-full max-w-md border-2 border-[#FFCCE1] shadow-[0_25px_70px_rgba(0,0,0,0.3)] space-y-4 animate-slide-in-bottom overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#FFCCE1]">
              <h3 className="font-black text-lg text-[#2A0826]">Add Trusted Contact</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-[#684E67] hover:bg-[#FFF0F3] hover:text-[#FF2A6D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saved ? (
              <div className="px-6 pb-6 text-center py-8 space-y-3">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <p className="font-black text-base text-[#2A0826]">Contact Saved!</p>
                <p className="text-xs text-[#684E67] font-bold">They'll receive emergency alerts when SOS is activated.</p>
              </div>
            ) : (
              <form onSubmit={handleAddContact} className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#2A0826] mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCCE1] text-xs font-bold focus:border-[#FF2A6D] focus:ring-4 focus:ring-[#FF2A6D]/15 focus:outline-none bg-white text-[#2A0826] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#2A0826] mb-1.5">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCCE1] text-xs font-bold focus:border-[#FF2A6D] focus:ring-4 focus:ring-[#FF2A6D]/15 focus:outline-none bg-white text-[#2A0826] shadow-xs cursor-pointer"
                    >
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#2A0826] mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCCE1] text-xs font-bold focus:border-[#FF2A6D] focus:ring-4 focus:ring-[#FF2A6D]/15 focus:outline-none bg-white text-[#2A0826] shadow-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#2A0826] mb-1.5">
                      Email <span className="text-[#684E67] font-normal normal-case">(For instant SOS alerts & live link)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFCCE1] text-xs font-bold focus:border-[#FF2A6D] focus:ring-4 focus:ring-[#FF2A6D]/15 focus:outline-none bg-white text-[#2A0826] shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !name || !phone}
                  className="w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black py-4 rounded-full text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(255,42,109,0.38)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'SAVING...' : 'SAVE TRUSTED CONTACT'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
