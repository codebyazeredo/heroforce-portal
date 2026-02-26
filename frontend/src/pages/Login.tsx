import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn({ email, password });
      alert('Bem-vindo, Herói!');
    } catch (err) {
      alert('Falha no login. Verifique e-mail e senha.');
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>HeroForce</h1>
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}