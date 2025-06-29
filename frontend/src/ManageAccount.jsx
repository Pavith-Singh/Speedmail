import { useState, useEffect } from 'react';
import arrow from './assets/arrow.png'; 
import axios from 'axios';

const ManageAccount = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    axios.get('https://speedmail.onrender.com/account', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        setEmail(res.data.email);
        setUsername(res.data.username);
      })
      .catch(() => {});
  }, []);

  const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {};
    if (newUsername) payload.newUsername = newUsername;
    if (newPassword) payload.newPassword = newPassword;
    if (profilePic) payload.profilePic = await fileToBase64(profilePic);
    axios.put('https://speedmail.onrender.com/account', payload, { headers: { Authorization: 'Bearer ' + token } })
      .then(() => setMessage('Account updated'))
      .catch(() => setMessage('Failed to update'));
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-violet-500 from-10% via-fuchsia-500 via-50% to-orange-500 to-100% animate-gradient">
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-16 gap-8 outline outline-white bg-fuchsia-500/90 rounded-2xl shadow-2xl hover:shadow-white transition duration-300 ease-in-out xl:rounded-tr-none xl:rounded-br-none relative w-[420px]">
          <a href="/dashboard" className="absolute top-4 left-4 hover:scale-110 transition duration-300 ease-in-out">
            <img src={arrow} alt="Back" className="w-8 h-8 cursor-pointer" />
          </a>
          <h1 className="text-4xl font-bold text-white">Account Settings</h1>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="text-left text-lg text-white">
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Current Username:</strong> {username}</p>
            </div>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              className="rounded-md p-2 border-2 border-white bg-white/10 text-white outline-none transition duration-300 ease-in-out focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="rounded-md p-2 border-2 border-white bg-white/10 text-white outline-none transition duration-300 ease-in-out focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400"
            />
            <div className="flex items-center gap-2 border-2 border-white bg-white/10 p-2 rounded-md">
              <label className="bg-white text-black px-3 py-1 rounded cursor-pointer hover:bg-gray-200 transition">
                Choose File
                <input type="file" accept="image/*" onChange={e => setProfilePic(e.target.files[0])} className="hidden" />
              </label>
              <div className="text-sm text-gray-200 truncate max-w-[180px]">
                {profilePic ? profilePic.name : "No file chosen"}
              </div>
            </div>
            <button type="submit" className="bg-violet-500 text-white py-2 text-2xl rounded-md hover:bg-violet-400 transition duration-300 ease-in-out outline outline-white cursor-pointer">
              Update
            </button>
            {message && <div className="text-center text-sm text-white">{message}</div>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ManageAccount;