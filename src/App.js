import logo from './logo.svg';
import './App.css';
import React from 'react';
import './App.css'; // Puedes eliminar esto si no lo necesitas
import PokemonList from './PokemonList'; // Importa el componente PokemonList
import './styles.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>El reto de los 100 Pokemons</h1>
      </header>
      <main>
        <PokemonList /> {/* Agrega el componente PokemonList aquí */}
      </main>
    </div>
  );
}

export default App;
