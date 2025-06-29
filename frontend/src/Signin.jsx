import { useState } from 'react';
import porsche from './assets/cayenne-coupe.png'
import visible from './assets/eye.png'
import invisible from './assets/eye_closed.png'
import arrow from './assets/arrow.png'
import axios from 'axios'; 
import { FaFingerprint } from 'react-icons/fa';

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState(''); 
  const [partialEmail, setPartialEmail] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@porsche.com');

  
  const handleSignin = async (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    const email = partialEmail + selectedDomain;
    try {
      const res = await axios.post('https://speedmail.onrender.com/login', { email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setSuccess('');
        setUsername(res.data.username);
        setPartialEmail('');
        setSelectedDomain('@porsche.com');
        setPassword('');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signin failed');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-violet-500 from-10% via-fuchsia-500 via-50% to-orange-500 to-100% animate-gradient">
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-16 gap-8 outline outline-white bg-fushia-500 rounded-2xl shadow-2xl hover:shadow-white transition duration-300 ease-in-out xl:rounded-tr-none xl:rounded-br-none relative">
          
          <a href="/" className="absolute top-4 left-4 hover:scale-110 transition duration-300 ease-in-out">
            <img src={arrow} alt="Back" className="w-8 h-8 cursor-pointer" />
          </a>
          <h1 className="text-5xl font-bold text-white flex items-center gap-4">
    Sign In
    <div className="relative group">
      <FaFingerprint className="text-white text-3xl cursor-pointer" />
      <span
        className="absolute left-1/2 -top-8 -translate-x-1/2 px-3 py-1 rounded bg-black/90 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow"
      >
        Sign in with fingerprint
      </span>
    </div>
  </h1>
          
          <form className="w-full flex flex-col gap-4" onSubmit={handleSignin}>
            
            <div className="w-full flex text-lg text-white flex-col items-start gap-1">
              <span className="text-lg text-white">Email Address</span>
              <div className="flex items-center w-full group">
                <input
                  type="text"
                  placeholder="john.doe"
                  value={partialEmail}
                  onChange={e => setPartialEmail(e.target.value)}
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
            
            <div className="w-full flex flex-col text-white text-left gap-1">
              <span className=" text-white">Password</span>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password1234"
                  value={password}
                  onChange={e => setPassword(e.target.value)} 
                  className="xl:rounded-tr-none xl:rounded-br-none w-full rounded-md p-1 border-2 outline-none focus:border-orange-500 focus:bg-fuchsia-500 hover:bg-fuchsia-400 transition duration-300 ease-in-out"
                  onCopy={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white hover:scale-110 transition duration-300 ease-in-out"
                >
                  <img src={showPassword ? visible : invisible} alt="Toggle visibility" className="w-6 h-6 cursor-pointer" />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <input type="checkbox" className="hover:scale-110 checked:accent-orange-500" />
                <span className="text-sm text-white">Remember Me</span>
              </div>
            </div>
           
            <button type="submit" className="hover:scale-102  text-white px-10 py-2 text-2xl rounded-md bg-violet-500 hover:bg-violet-400 transition duration-300 ease-in-out outline outline-white cursor-pointer">Sign-In</button>
            
            {error && <div className='text-red-200'>{error}</div>}
            {success && <div className='text-green-400'>{success}</div>}
            <p className="text-sm text-white font-semibold">Not Registered? <a href="/adminsignin" className="text-orange-400 hover:underline">Register</a></p>
          </form>
        </div>
        <img src={porsche} alt="" className=' shadow-2xl w - [450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden outline outline-white  hover:shadow-white transition duration-300 ease-in-out'/>
      </div>
    </section>
  )
}

export default Signin;
