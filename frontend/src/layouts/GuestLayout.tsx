import React from 'react';

export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">HeroForce Portal</h1>
          <p className="text-slate-500">Bem vindo(a)</p>
        </div>
        {children}
      </div>
    </div>
  );
};