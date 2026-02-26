import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { GuestLayout } from '../layouts/GuestLayout';
import { UserCharacter, UserCharacterLabel } from '../../../backend/src/users/enums/user-character.enum';

export const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', character: UserCharacter.OTHERS });
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            alert('Cadastro realizado! Agora faça login.');
            navigate('/');
        } catch (err) {
            alert('Erro ao cadastrar. Verifique os dados.');
        }
    }

    return (
        <GuestLayout>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nome Completo" onChange={e => setFormData({ ...formData, name: e.target.value })} required />

                <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="email" placeholder="E-mail" onChange={e => setFormData({ ...formData, email: e.target.value })} required />

                <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="password" placeholder="Senha" onChange={e => setFormData({ ...formData, password: e.target.value })} required />

                <select
                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.character}
                    onChange={e => setFormData({ ...formData, character: Number(e.target.value) })}
                >
                    {Object.entries(UserCharacterLabel).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Cadastrar Herói
                </button>

                <p className="text-center text-sm text-slate-600">
                    Já tem conta? <Link title="voltar para login" to="/" className="text-blue-600 font-bold">Entrar</Link>
                </p>
            </form>
        </GuestLayout>
    );
};