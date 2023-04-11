import React, { useState } from 'react';


const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Dragonborn', 'Half-Elf', 'Half-Orc', 'Tiefling'];

const generateRace = () => {
  const randomIndex = Math.floor(Math.random() * races.length);
  return races[randomIndex];
};

const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

const generateClass = () => {
  const randomIndex = Math.floor(Math.random() * classes.length);
  return classes[randomIndex];
};



  const generateAbilities = () => {
    // ...
    const abilities = [];

    return abilities || [];
  };

function generateAbilityScore() {
  const rolls = [];
  for (let i = 0; i < 4; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  rolls.sort((a, b) => b - a);
  rolls.pop();
  return rolls.reduce((acc, roll) => acc + roll, 0);
}

const abilityScores = {
  Strength: generateAbilityScore(),
  Dexterity: generateAbilityScore(),
  Constitution: generateAbilityScore(),
  Intelligence: generateAbilityScore(),
  Wisdom: generateAbilityScore(),
  Charisma: generateAbilityScore(),
};

const backgrounds = ['Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'];

const generateBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};


  const generateEquipment = (characterClass) => {
 
    const equipmentByClass = {

    };
  
    return equipmentByClass[characterClass] || [];
  };

  
  

  function generateCharacter() {
    const characterRace = races[Math.floor(Math.random() * races.length)];
    const characterClass = classes[Math.floor(Math.random() * classes.length)];
    const characterBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  
    // Generate equipment based on characterClass and characterBackground
    const equipment = generateEquipment(characterClass, characterBackground);
  
    return {
      race: characterRace,
      class: characterClass,
      abilityScores: abilityScores,
      background: characterBackground,
      equipment: equipment,
    };
  }

const CharacterGenerator = () => {
    const [character, setCharacter] = useState(null);
  
    const handleGenerateCharacter = () => {
      const generatedRace = generateRace();
      const generatedClass = generateClass();
      const generatedAbilities = generateAbilities();
      const generatedBackground = generateBackground();
      const generatedEquipment = generateEquipment();
  
      setCharacter({
        race: generatedRace,
        characterClass: generatedClass,
        abilities: generatedAbilities,
        background: generatedBackground,
        equipment: generatedEquipment,
      });
    };
  
    return (
        <div className="character-generator">
        <button onClick={handleClick}>Generate Character</button>
        {character && (
             <div className="character-info">
            <p>Race: {character.race}</p>
            <p>Class: {character.characterClass}</p>
            <p>Abilities: {character.abilities ? character.abilities.join(", ") : ""}</p>
            <p>Background: {character.background}</p>
            <p>Equipment: {character.equipment ? character.equipment.join(", ") : ""}</p>
            </div>
        )}
      </div>
    );
  };

  export default CharacterGenerator;
