import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { TrustedContactCard } from '../components/contacts/TrustedContactCard.jsx';
import { api } from '../utils/api.js';
import { UserPlus, Shield, X, CheckCircle } from 'lucide-react';

const RELATIONSHIPS = ['Sister', 'Mother', 'Father', 'Brother', 'Friend', 'Spouse', 'Guardian', 'Colleague'];

export const ContactsPage = () => {
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
      <div className="max-w-xl mx-auto px-4 pt-5 pb-6 space-y-5 lg:max-w-2xl">
        <div className="flex items-end justify-between animate-fade-up">
          <div>
            <h1 className="text-xl font-extrabold text-tichi-text tracking-tight">Trusted Contacts</h1>
            <p className="text-xs text-tichi-muted mt-0.5">
              {contacts.length > 0
                ? `${contacts.length} of ${MAX_CONTACTS} emergency contacts connected`
                : 'Add contacts to enable emergency alerts'}
            </p>
          </div>

          {contacts.length < MAX_CONTACTS && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-plum text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow hover:bg-plum-dark transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5 animate-fade-up">
          {contacts.length === 0 ? (
            <div className="bg-white border border-blush-border rounded-2xl p-10 text-center space-y-4 shadow-card">
              <div className="w-14 h-14 rounded-full bg-rose/20 text-plum mx-auto flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-tichi-text">No Contacts Added</h3>
                <p className="text-xs text-tichi-muted mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Add trusted family members or friends. They'll receive instant emergency emails with your live location link when SOS is activated.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-plum text-white font-bold px-5 py-2.5 rounded-card text-xs shadow hover:bg-plum-dark transition-colors"
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
                  onClick={() => setShowAddModal(true)}
                  className="w-full border-2 border-dashed border-blush-border hover:border-plum/40 text-tichi-muted hover:text-plum py-4 rounded-card text-xs font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Another Trusted Contact</span>
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-blush-subtle border border-blush-border rounded-card p-4 text-xs text-tichi-muted font-medium animate-fade-up">
          <p className="font-bold text-tichi-text mb-1">🔒 Privacy & Safety</p>
          <p>Emergency alerts are sent only to people you explicitly add here. Location is only shared during active SOS sessions — not in the background.</p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-modal space-y-4 animate-slide-in-bottom overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-blush-border">
              <h3 className="font-extrabold text-base text-plum">Add Trusted Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl text-tichi-muted hover:bg-blush-subtle hover:text-plum transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {saved ? (
              <div className="px-5 pb-5 text-center py-8 space-y-3">
                <CheckCircle className="w-12 h-12 text-tichi-success mx-auto animate-bounce" />
                <p className="font-extrabold text-tichi-text">Contact Saved!</p>
                <p className="text-xs text-tichi-muted">They'll receive emergency alerts when SOS is activated.</p>
              </div>
            ) : (
              <form onSubmit={handleAddContact} className="px-5 pb-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-tichi-text mb-1">Full Name *</label>
                    <input type="text" placeholder="Ananya Sharma" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full px-3 py-2.5 rounded-control border border-blush-border text-xs focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tichi-text mb-1">Relationship</label>
                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-control border border-blush-border text-xs focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle">
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tichi-text mb-1">Mobile Number *</label>
                    <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required
                      className="w-full px-3 py-2.5 rounded-control border border-blush-border text-xs focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-tichi-text mb-1">Email <span className="text-tichi-muted font-normal">(For instant SOS alerts & live link)</span></label>
                    <input type="email" placeholder="contact@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-control border border-blush-border text-xs focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !name || !phone}
                  className="w-full bg-plum text-white font-extrabold py-3 rounded-card text-xs shadow hover:bg-plum-dark transition-colors disabled:opacity-60 active:scale-[0.98]"
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
};
