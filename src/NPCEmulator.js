import React, { useState } from 'react';
import {
  npcModifierTable,
  npcNounTable,
  npcPowerLevelTable,
  npcMotivationVerbTable,
  npcMotivationNounTable,
  npcMoodTable,
  npcBearingTable,
} from './npcData'; 

function NPCEmulator() {
    const [npcDescription, setNPCDescription] = useState('');
    const [npcPowerLevel, setNpcPowerLevel] = useState('');
    const [rLevel, setRLevel] = useState('Order');
    const [npcMotivations, setNpcMotivations] = useState([]);
    const [npcMood, setNpcMood] = useState('');
    const [npcRelationship, setNpcRelationship] = useState('');
  
    const calculateNPCPowerLevel = (rLevel, d100Roll) => {
      const rLevelData = npcPowerLevelTable.find((entry) => entry.rLevel === rLevel);
  
      const powerLevel = rLevelData.ranges.find((entry) =>
        entry.range[0] <= d100Roll && entry.range[1] >= d100Roll
      ).description;
  
      return powerLevel;
    };
  
    const generateMotivation = () => {
      let motivationNouns = [];
      let motivation;
      do {
        const verbRoll = Math.floor(Math.random() * 100) + 1;
        const nounRoll = Math.floor(Math.random() * 100) + 1;
  
        const verb = npcMotivationVerbTable.find(
          (entry) => entry.value === verbRoll
        ).verb;
        const noun = npcMotivationNounTable.find(
          (entry) => entry.value === nounRoll
        ).noun;
  
        motivation = `${verb} ${noun}`;
        if (!motivationNouns.includes(noun)) {
          motivationNouns.push(noun);
        }
      } while (motivationNouns.length < 3);
  
      setNpcMotivations(
        motivationNouns.map(
          (noun, index) => `${npcMotivationVerbTable[index].verb} ${noun}`
        )
      );
    };

    const generateMood = (relationship) => {
      const d100Roll = Math.floor(Math.random() * 100) + 1;
      const relationshipData = npcMoodTable.find(
        (entry) => entry.npcRelationship === relationship
      );
  
      const mood = relationshipData.ranges.find(
        (entry) => entry.range[0] <= d100Roll && entry.range[1] >= d100Roll
      ).description;
  
      return mood;
    };

    function rollDemeanor() {
      const roll = Math.floor(Math.random() * 100) + 1;
      const demeanor = npcBearingTable.demeanors.find(
        (entry) => roll >= entry.range[0] && roll <= entry.range[1]
      );
      return demeanor.demeanor;
    }
  
    function rollBearing(demeanor) {
      const roll = Math.floor(Math.random() * 100) + 1;
      const bearingData = npcBearingTable.bearings[demeanor];
      const bearing = bearingData.find(
        (entry) => roll >= entry.range[0] && roll <= entry.range[1]
      );
      return bearing.description;
    }
  
    const generateNPC = () => {
      const modifierRoll = Math.floor(Math.random() * 100) + 1;
      const nounRoll = Math.floor(Math.random() * 100) + 1;
      const powerLevelRoll = Math.floor(Math.random() * 100) + 1;
  
      const modifier = npcModifierTable.find((entry) => entry.value === modifierRoll)
        .modifier;
      const noun = npcNounTable.find((entry) => entry.value === nounRoll).noun;
      const powerLevel = calculateNPCPowerLevel(rLevel, powerLevelRoll);
  
      const npcDescription = `${modifier} ${noun}`;
  
      setNPCDescription(npcDescription);
      setNpcPowerLevel(powerLevel);
      generateMotivation();

      if (npcRelationship) {
        const mood = generateMood(npcRelationship);
        setNpcMood(mood);
      }
    };
  
    const handleRelationshipChange = (event) => {
      setNpcRelationship(event.target.value);
    
    };
  
    return (
      <div>
        <h2>NPC Emulator</h2>
        <label htmlFor="r-level">R-level:</label>
        <select
          id="r-level"
          value={rLevel}
          onChange={(e) => setRLevel(e.target.value)}
        >
          {npcPowerLevelTable.map((entry) => (
            <option key={entry.rLevel} value={entry.rLevel}>
              {entry.rLevel} ({entry.value})
            </option>
          ))}
        </select>
        <button onClick={generateNPC}>Generate NPC</button>
        {npcDescription && <p>NPC Description: {npcDescription}</p>}
        {npcPowerLevel && <p>NPC Power Level: {npcPowerLevel}</p>}
        {npcMotivations.length > 0 && (
          <div>
            <h3>NPC Motivations:</h3>
            <ul>
              {npcMotivations.map((motivation, index) => (
                <li key={index}>{motivation}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label htmlFor="npc-relationship">NPC Relationship: </label>
          <select
            id="npc-relationship"
            value={npcRelationship}
            onChange={handleRelationshipChange}
          >
            <option value="">Select Relationship</option>
            {npcMoodTable.map((entry) => (
              <option key={entry.npcRelationship} value={entry.npcRelationship}>
                {entry.npcRelationship}
              </option>
            ))}
          </select>
        </div>
        {npcMood && <p>NPC Mood: {npcMood}</p>}
      </div>
    );
    
  }
  
  export default NPCEmulator;
  
