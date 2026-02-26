import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { GuestLayout } from '../layouts/GuestLayout';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
    } catch (err) {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <GuestLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">E-mail do Herói</label>
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
            type="email" 
            placeholder="ex: stark@avengers.com" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Senha Secreta</label>
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
            type="password" 
            placeholder="••••••••" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
          Entrar no Portal
        </button>

        <p className="text-center text-sm text-slate-600 pt-2">
          Novo por aqui? <Link to="/register" className="text-blue-600 font-bold hover:underline">Recrute-se agora</Link>
        </p>
      </form>
    </GuestLayout>
  );
};