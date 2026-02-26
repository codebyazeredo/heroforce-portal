import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export const Dashboard = () => {
  const { user, signOut } = useContext(AuthContext);
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    api.get('/users').then(response => {
      setHeroes(response.data);
    }).catch(err => console.error("Erro ao buscar heróis", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Portal HeroForce</h1>
        <div>
          <span>Olá, {user?.name} </span>
          <button onClick={signOut}>Sair</button>
        </div>
      </header>

      <section style={{ marginTop: '20px' }}>
        <h2>Heróis Cadastrados</h2>
        <ul>
          {heroes.map((hero: any) => (
            <li key={hero.id}>{hero.name} - {hero.character}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};