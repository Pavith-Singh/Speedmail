import { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    axios.get('http://localhost:3000/account', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => setInfo(res.data))
      .catch(() => {});
  }, []);

  if (!info) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient">
      <div className="bg-white/90 p-8 rounded shadow-xl text-fuchsia-700 w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        <p className="mb-2"><strong>Email:</strong> {info.email}</p>
        <p className="mb-4"><strong>Username:</strong> {info.username}</p>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/signin'; }}
          className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;