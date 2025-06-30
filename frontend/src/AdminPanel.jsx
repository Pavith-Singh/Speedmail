import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa';
import arrow from './assets/arrow.png';

const api = import.meta.env.VITE_API_URL || 'https://speedmail.onrender.com';
const token = localStorage.getItem('token');
const auth = { headers: { Authorization: 'Bearer ' + token } };

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm]   = useState({ username:'', password:'', isAdmin:false, profilePic:null });

  const fetchUsers = () => {
    axios.get(`${api}/users`, auth)
      .then(res => {
        if (res.data.success) setUsers(res.data.users);
      })
      .catch(err => {});
  };
  useEffect(fetchUsers, []);

  const startEdit = u => {
    setEditing(u.email);
    setForm({ username: u.username, password:'', isAdmin: u.isAdmin, profilePic: null });
  };
  const cancel = () => { setEditing(null); setForm({ username:'', password:'', isAdmin:false, profilePic:null }); };
  const save = () => {
    axios.put(`${api}/users/${editing}`, form, auth)
      .then(() => { cancel(); fetchUsers(); });
  };
  const del = email => {
    if (!window.confirm(`Delete ${email}?`)) return;
    axios.delete(`${api}/users/${email}`, auth).then(fetchUsers);
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient">
      <div className="w-full max-w-5xl flex flex-col bg-fuchsia-500/90 rounded-2xl shadow-2xl outline outline-white p-10 mt-10 mb-10 relative">
        <a href="/dashboard" className="absolute top-10 left-10 hover:scale-110 transition duration-300 ease-in-out z-10">
          <img src={arrow} alt="Back" className="w-8 h-8 cursor-pointer" />
        </a>
        <h1 className="text-4xl font-bold text-white text-center mb-8">Admin – User Manager</h1>
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full bg-white/80 text-fuchsia-800 rounded shadow overflow-hidden">
            <thead>
              <tr className="bg-fuchsia-200">
                <th className="p-3 text-left">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3">Password</th>
                <th className="p-3">Admin?</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email} className="border-b border-fuchsia-100 hover:bg-fuchsia-50">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    {editing === u.email
                      ? (
                        <input
                          className="rounded-md p-2 border-2 border-white bg-white/10 text-fuchsia-900 outline-none transition duration-300 ease-in-out focus:border-orange-500 focus:bg-fuchsia-100 hover:bg-fuchsia-100 w-full"
                          value={form.username}
                          onChange={e=>setForm({...form, username:e.target.value})} />
                      )
                      : u.username}
                  </td>
                  <td className="p-3">
                    {editing === u.email ? (
                      <input
                        type="password"
                        className="rounded-md p-2 border-2 border-white bg-white/10 text-fuchsia-900 outline-none transition duration-300 ease-in-out focus:border-orange-500 focus:bg-fuchsia-100 hover:bg-fuchsia-100 w-full"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="New password"
                      />
                    ) : (
                      <span className="text-gray-400">••••••</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {editing === u.email
                      ? (
                        <input
                          type="checkbox"
                          checked={form.isAdmin}
                          onChange={e=>setForm({...form, isAdmin:e.target.checked})}
                          className="w-5 h-5 cursor-pointer"
                        />
                      )
                      : (u.isAdmin
                        ? <FaCheckCircle className="text-green-600 text-lg mx-auto" />
                        : <span className="text-gray-400 text-xl mx-auto">—</span>
                      )
                    }
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">
                      {editing === u.email ? (
                        <>
                          <button
                            onClick={save}
                            className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer hover:bg-green-600 transition"
                            title="Save"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={cancel}
                            className="bg-gray-400 text-white px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-500 transition"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={()=>startEdit(u)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer hover:bg-blue-600 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={()=>del(u.email)}
                            className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer hover:bg-red-700 transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="mt-6 bg-white/95 p-6 rounded-xl text-fuchsia-800 shadow-lg flex flex-col gap-4">
            <label className="block mb-2 font-semibold text-fuchsia-900">Change profile picture (.png):</label>
            <div className="flex items-center gap-3">
              <label className="bg-white text-black px-3 py-1 rounded cursor-pointer hover:bg-gray-200 transition">
                Choose File
                <input
                  type="file"
                  accept="image/png"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm(f => ({ ...f, profilePic: reader.result.split(',')[1] }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </label>
              <div className="text-sm text-gray-500 truncate max-w-[180px]">
                {form.profilePic ? "File ready!" : "No file chosen"}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Picture will be saved when you click <b>Save</b>.</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
