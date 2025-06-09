import { useState, useEffect } from 'react';
import visible from './assets/eye.png'
import invisible from './assets/eye_closed.png'
import arrow from './assets/arrow.png'
import axios from 'axios';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [partialEmail, setPartialEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@porsche.com');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/adminsignin';
      return;
    }
    // Decode token to check isAdmin (no backend call needed for this check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.isAdmin) {
        window.location.href = '/adminsignin';
      }
    } catch (e) {
      window.location.href = '/adminsignin';
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const email = partialEmail + selectedDomain;
    // lowercase, uppercase, numbers, and periods only
    if (!/^[a-zA-Z0-9.]+$/.test(partialEmail)) {
      setError('No special characters or spaces allowed');
      return;
    }
    // Password: at least 8 chars, includes letters and numbers
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError('Password must be at least 8 characters and include both letters and numbers');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/register', {email, username, password});
      if (res.data.success && res.data.token) {

        localStorage.setItem('token', res.data.token);
        setSuccess('Registration successful! Redirecting...');
        setPartialEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <section className="min-h-screen overflow-auto flex items-center justify-center font-mono bg-gradient-to-r from-violet-500 from-10% via-fuchsia-500 via-50% to-orange-500 animate-gradient to-100% px-4 py-8">
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-16 gap-8 outline outline-white bg-fushia-500 rounded-2xl shadow-2xl hover:shadow-white transition duration-300 ease-in-out relative">
          <a href="/" className="absolute top-4 left-4 hover:scale-110 transition duration-300 ease-in-out">
            <img src={arrow} alt="Back" className="w-8 h-8 cursor-pointer" />
          </a>
          <h1 className="text-5xl font-bold text-white">Register</h1>
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            <div className="w-full flex text-lg text-white flex-col items-start gap-1">
              <span className="text-lg text-white">Email Address</span>
              <div className="flex items-center w-full group">
                <input
                  type="text"
                  placeholder="john.doe"
                  value={partialEmail}
                  onChange={(e) => setPartialEmail(e.target.value)}
                  className="rounded-r-none w-full rounded-md rounded-tr-none rounded-br-none p-1 px-2 py-1 border-2 border-white outline-none bg-white/10 text-white text-base
                    transition duration-300 ease-in-out
                    focus:border-orange-500 focus:bg-fuchsia-500
                    hover:bg-fuchsia-400
                    group-hover:bg-fuchsia-400
                    group-focus-within:bg-fuchsia-500"
                />
                <select className="text-base text-white border-2 border-l-0 border-white rounded-md rounded-tl-none rounded-bl-none px-2 py-1 h-full flex items-center justify-center bg-white/10
                  transition duration-300 ease-in-out
                  group-hover:bg-fuchsia-400
                  group-focus-within:bg-fuchsia-500 group-focus-within:border-orange-500
                "
                  value={selectedDomain}
                  onChange={e => setSelectedDomain(e.target.value)}
                >
                  <option value="@porsche.com" className="bg-fuchsia-500"> @porsche.com</option>
                  <option value="@porsche-corporate.com" className="bg-fuchsia-500"> @porsche-corporate.com</option>
                  <option value="@porsche-janitorial.com" className="bg-fuchsia-500"> @porsche-janitorial.com</option>
                  <option value="@porsche-engineering.com" className="bg-fuchsia-500"> @porsche-engineering.com</option>
                  <option value="@porsche-executive.com" className="bg-fuchsia-500"> @porsche-executive.com</option>
                </select>
              </div>
            </div>
            <div className="w-full flex text-lg text-white flex-col items-start gap-1">
              <span className="text-lg text-white">Username</span>
              <input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md p-1 px-2 py-1 border-2 outline-none focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400 transition duration-300 ease-in-out text-base"
              />
            </div>
            <div className="w-full flex flex-col text-lg text-white text-left gap-1">
              <span className="text-lg text-white">Password</span>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="xl:rounded-tr-none xl:rounded-br-none w-full rounded-md p-1 px-2 py-1 border-2 outline-none focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400 transition duration-300 ease-in-out text-base"
                  onCopy={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white hover:scale-110 transition duration-300 ease-in-out"
                >
                  <img src={showPassword ? visible : invisible} alt="Toggle visibility" className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
            </div>
            <div className="w-full flex flex-col text-lg text-white text-left gap-1">
              <span className="text-lg text-white">Confirm Password</span>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password1234"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="xl:rounded-tr-none xl:rounded-br-none w-full rounded-md p-1 px-2 py-1 border-2 outline-none focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400 transition duration-300 ease-in-out text-base"
                  onCopy={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white hover:scale-110 transition duration-300 ease-in-out"
                >
                  <img src={showPassword ? visible : invisible} alt="Toggle visibility" className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <input type="checkbox" className="hover:scale-110 checked:accent-orange-500" />
                <span className="text-xs text-white">Remember Me</span>
              </div>
            </div>
            <button type ="submit" className="hover:scale-102  text-white px-10 py-2 text-2xl rounded-md bg-violet-500 hover:bg-violet-400 transition duration-300 ease-in-out outline outline-white cursor-pointer">Register</button>
            {error && <div className='text-red-400'>{error}</div>}
            {success && <div className='text-green-400'>{success}</div>}
            <p className="text-sm text-white font-semibold">Already Registered? <a href="/signin" className="text-orange-400 hover:underline">Sign-In</a></p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register;
