import React, { useState, useEffect } from 'react';
import { Phone, Search, Plus, Trash2, Edit2, Save, User } from 'lucide-react';

const Truecaller = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    if (!phoneNumber || !contactName) {
      alert('Please fill in both fields');
      return;
    }

    const newContact = {
      id: Date.now(),
      phone: phoneNumber,
      name: contactName,
      timestamp: new Date().toISOString()
    };

    setContacts(prev => [...prev, newContact]);
    setPhoneNumber('');
    setContactName('');
  };

  const handleSearch = () => {
    const result = contacts.find(
      contact => contact.phone.includes(searchQuery) || 
                contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(result || null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
  };

  const handleSave = (id) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, name: editName } : contact
    ));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <Phone className="w-6 h-6" />
            Truecaller
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['add', 'search', 'list'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200
                ${activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'add' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter contact name"
                />
              </div>
              <button
                onClick={handleAddContact}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Contacts
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search by name or number"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Search
                  </button>
                </div>
              </div>
              {searchResult && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{searchResult.name}</p>
                      <p className="text-sm text-gray-500">{searchResult.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        {editingId === contact.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">{contact.name}</p>
                        )}
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingId === contact.id ? (
                        <button
                          onClick={() => handleSave(contact.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(contact)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No contacts added yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Truecaller;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import Register from './components/Auth/Register';
// import AddContact from './components/Contacts/AddContact';
// import CallHistory from './components/CallHistory'; 
// import Favourites from './components/Favorites';

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li><Link to="/register">Register</Link></li>
//             <li><Link to="/add-contact">Add Contact</Link></li>
//             <li><Link to="/call-history">Call History</Link></li>
//             <li><Link to="/favourites">Favourites</Link></li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/register" element={<Register />} />
//           <Route path="/add-contact" element={<AddContact />} />
//           <Route path="/call-history" element={<CallHistory />} />
//           <Route path="/favourites" element={<Favourites />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
