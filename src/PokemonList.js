import React, { useState, useEffect } from 'react';

function PokemonList() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [timer, setTimer] = useState(10);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100') // Ahora 100 pokemones
        .then(response => response.json())
        .then(data => setPokemonList(data.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
    let intervalId;
    if (gameStarted) {
        intervalId = setInterval(() => {
        setTimer(prevTimer => {
            if (prevTimer === 0) {
            handleOptionClick(null);
            return 10; // Reiniciar temporizador cuando llega a 0
            }
            return prevTimer - 1;
        });
        }, 1000);
    }
    return () => clearInterval(intervalId);
    }, [gameStarted]);

    const fetchPokemonDetails = async url => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        setSelectedPokemon(data);
        setGameStarted(true);
        setOptions(generateOptions(data));
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
    };

    const generateOptions = selectedPokemon => {
    const options = [selectedPokemon.name];
    while (options.length < 4) {
      const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)].name;
        if (!options.includes(randomPokemon) && !selectedOptions.includes(randomPokemon)) {
        options.push(randomPokemon);
        }
    }
    return shuffleArray(options);
    };

    const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
    };

    const handleOptionClick = option => {
    if (option === selectedPokemon?.name) {
        if (!selectedOptions.includes(option)) {
        setScore(prevScore => prevScore + 1);
        setSelectedOptions(prevOptions => [...prevOptions, option]);
        alert('¡Correcto! Adivinaste el Pokemon');
        } else {
        alert('Ya has seleccionado este Pokemon antes. Por lo que no recibiras puntos por ello.');
        }
    } else {
        alert('Incorrecto. Vuelve a intentarlo');
    }
    setTimer(10); // Reiniciar temporizador
    setGameStarted(false);
    };

    useEffect(() => {
    if (score >= 10 * level) {
        setLevel(prevLevel => prevLevel + 1);
    }
    }, [score, level]);

    return (
    <div>
        <h1>Adivina el Pokemon!</h1>
        <p>Puntuación: {score}</p>
        <p>Nivel: {level}</p>
        {gameStarted && <p>Tiempo restante: {timer} segundos</p>}
        {!gameStarted && (
        <ul>
            {pokemonList.map((pokemon, index) => (
            <li key={index} onClick={() => fetchPokemonDetails(pokemon.url)}>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`} alt={pokemon.name} />
            </li>
            ))}
        </ul>
        )}
        {gameStarted && selectedPokemon && (
        <div>
            <h2>¿Cómo se llama este Pokemon?</h2>
            <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
            <div>
            {options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option)}>{option}</button>
            ))}
            </div>
        </div>
        )}
    </div>
    );
}

export default PokemonList;
