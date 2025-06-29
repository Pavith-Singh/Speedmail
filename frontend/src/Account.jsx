import { useState, useEffect } from 'react';
import arrow from './assets/arrow.png';
import axios from 'axios';

const Account = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    axios.get('https://speedmail.onrender.com/account', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => setInfo(res.data))
      .catch(() => {});
  }, []);

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 animate-gradient text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-violet-500 from-10% via-fuchsia-500 via-50% to-orange-500 to-100% animate-gradient">
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-16 gap-8 outline outline-white bg-fuchsia-500/90 rounded-2xl shadow-2xl hover:shadow-white transition duration-300 ease-in-out relative w-[420px]">
          <a href="/dashboard" className="absolute top-4 left-4 hover:scale-110 transition duration-300 ease-in-out">
            <img src={arrow} alt="Back" className="w-8 h-8 cursor-pointer" />
          </a>
          <h1 className="text-4xl font-bold text-white mb-6">Account</h1>
          <img
            src={`https://speedmail.onrender.com/profile_pics/${info.email}.png`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-4 border-fuchsia-300 object-cover bg-white/80"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <div className="text-lg text-white w-full flex flex-col gap-2">
            <p className="mb-1"><span className="font-semibold">Email:</span> {info.email}</p>
            <p className="mb-1"><span className="font-semibold">Username:</span> {info.username}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;