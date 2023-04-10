import React, { useState } from 'react'
import './App.css'
import { MythicGMEmulatorData } from './MythicGMEmulatorData.js'
import MIDIPlayerComponent from './MIDIPlayer'
import MIDIPlayer from './MIDIPlayer'
import NPCEmulator from './NPCEmulator'

function App() {
  const [chaosFactor, setChaosFactor] = useState(5)
  const [sceneSetup, setSceneSetup] = useState("")
  const [actions, setActions] = useState([])
  const [gameLog, setGameLog] = useState([])
  const [threads, setThreads] =useState([])
  const [NPCs, setNPCs] = useState([])
  const [generatedNames, setGeneratedNames] = useState([])

  const generateEventFocus = () => {
    const randomNumber = Math.floor(Math.random() * 100) +1
    return MythicGMEmulatorData.eventFocusTable.find(entry => randomNumber >= entry.range[0] && randomNumber <= entry.range[1])
  }

  const generateEventMeaning = () => {
    const randomActionIndex = Math.floor(Math.random() * MythicGMEmulatorData.eventMeaningTable.actions.length)
    const randomSubjectIndex = Math.floor(Math.random() * MythicGMEmulatorData.eventMeaningTable.subjects.length)
    return {
      action: MythicGMEmulatorData.eventMeaningTable.actions[randomActionIndex],
      subject: MythicGMEmulatorData.eventMeaningTable.subjects[randomSubjectIndex]
    }
  }

  const generateEventElements = () => {
    const randomLocationIndex = Math.floor(Math.random() * MythicGMEmulatorData.eventMeaningTableElements.locations.length)
    const randomCharactersIndex = Math.floor(Math.random() * MythicGMEmulatorData.eventMeaningTableElements.characters.length)
    const randomObjectsIndex = Math.floor(Math.random() * MythicGMEmulatorData.eventMeaningTableElements.objects.length)
    return {
      locations: MythicGMEmulatorData.eventMeaningTableElements.locations[randomLocationIndex],
      characters: MythicGMEmulatorData.eventMeaningTableElements.characters[randomCharactersIndex],
      objects: MythicGMEmulatorData.eventMeaningTableElements.objects[randomObjectsIndex]
    }
  }

  const handleAction = (playerAction) => {
    setActions([...actions, playerAction])
    const eventFocus = generateEventFocus()
    const eventMeaning = generateEventMeaning()
    const eventElements = generateEventElements()
    const gameResponse = {
      eventFocus: eventFocus.description,
      action: eventMeaning.action,
      subject: eventMeaning.subject,
      locations: eventElements.locations,
      characters: eventElements.characters,
      objects: eventElements.objects
    }
    setGameLog([...gameLog, { playerAction, gameResponse }])
  }

  const fetchGeneratedNames = async () => {
    try {
      const response = await fetch("http://localhost:3001/generate-fantasy-name");
      const data = await response.json();
      setGeneratedNames(data.names);
    } catch (error) {
      console.error(error);
    }
  };

  const oracleCheck = (probabilityIndex) => {
    const odds = MythicGMEmulatorData.oracleProbabilityTable[probabilityIndex].odds;
    const targetNumber = odds[chaosFactor - 1];
    const roll = Math.floor(Math.random() * 10) + 1;

    return roll <= targetNumber;
  };

  const [oracleResult, setOracleResult] = useState(null);

  const handleOracleCheck = (probabilityIndex) => {
    const result = oracleCheck(probabilityIndex);
    setOracleResult(result);
  };

  return (
    <div className='App'>
      <audio src="/creepy.mid" autoPlay loop />
      <MIDIPlayerComponent />
      <MIDIPlayer />
      <SceneSetup  sceneSetup={sceneSetup} setSceneSetup={setSceneSetup} />
      <ChaosFactor chaosFactor={chaosFactor} setChaosFactor={setChaosFactor} />
      <PlayerActions handleAction={handleAction} />
      <GameLog gameLog={gameLog} />
      <EventFocusTable data={MythicGMEmulatorData.eventFocusTable} />
      <EventMeaningTable data={MythicGMEmulatorData.eventMeaningTable} />
      <EventMeaningElements data={MythicGMEmulatorData.eventMeaningTableElements} />
      <Threads threads={threads} setThreads={setThreads} />
      <NPCList NPCs={NPCs} setNPCs={setNPCs} />
      <NPCEmulator />
      <FantasyNameGenerator fetchGeneratedNames={fetchGeneratedNames} generatedNames={generatedNames} />
      <div className="oracle-check-container">
        <h2>Oracle Check</h2>
        <div className="oracle-probabilities">
          {MythicGMEmulatorData.oracleProbabilityTable.map((probability, index) => (
            <button
              key={probability.probability}
              onClick={() => handleOracleCheck(index)}
            >
              {probability.probability}
            </button>
          ))}
        </div>
        {oracleResult !== null && (
          <div className="oracle-result">
            <strong>Result: </strong> {oracleResult ? "Yes" : "No"}
          </div>
        )}
      </div>
    </div>
  )
}

function SceneSetup({ sceneSetup, setSceneSetup }) {
  return (
    <div>
      <h2>Scene Setup</h2>
      <textarea value={sceneSetup} onChange={(e) => setSceneSetup(e.target.value)} />
    </div>
  );
}

function ChaosFactor({ chaosFactor, setChaosFactor }) {
  return (
    <div>
      <h2>Chaos Factor</h2>
      <input type='number' value={chaosFactor} onChange={(e) => setChaosFactor(parseInt(e.target.value, 10))} />
    </div>
  )
}

function PlayerActions({ handleAction }) {
  const [action, setAction] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAction(action)
    setAction("")
  }

  return (
    <div>
      <h2>Player Actions</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' value={action} onChange={(e) => setAction(e.target.value)} />
        <button type='submit'>Submit Actions</button>
      </form>
    </div>
  )
}

function GameLog({ gameLog }) {
  return (
    <div>
      <h2>Game Log</h2>
      <ul>
        {gameLog.map((entry, index) => (
          <li key={index}>
            <p><strong>Player Action:</strong> {entry.playerAction}</p>
            <p><strong>Event Focus:</strong> {entry.gameResponse.eventFocus}</p>
            <p><strong>Action:</strong> {entry.gameResponse.action}</p>
            <p><strong>Subject:</strong> {entry.gameResponse.subject}</p>
            <p><strong>Location:</strong> {entry.gameResponse.locations}</p>
            <p><strong>Character:</strong> {entry.gameResponse.characters}</p>
            <p><strong>Object:</strong> {entry.gameResponse.objects}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Threads({ threads, setThreads }) {
  const [newThread, setNewThread] = useState("")

  const handleAddThread = () => {
    setThreads([...threads, { text: newThread, completed: false}])
    setNewThread("")
  }

  const toggleThreadCompletion = (index) => {
    const updatedThreads = threads.map((thread, i) => 
      i === index ? { ...thread, completed: !thread.completed } : thread
    )
    setThreads(updatedThreads)
  }

  return (
    <div>
      <h2>Threads</h2>
      <input
        type="text"
        value={newThread}
        onChange={(e) => setNewThread(e.target.value)}
      />
      <button onClick={handleAddThread}>Add Thread</button>
      <ul>
        {threads.map((thread, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={thread.completed}
              onChange={() => toggleThreadCompletion(index)}
            />
            {thread.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NPCList({ NPCs, setNPCs }) {
  const [newNPC, setNewNPC] = useState("")

  const handleAddNPC = () => {
    setNPCs([...NPCs, newNPC]);
    setNewNPC(""); 
  };
  

  return (
    <div>
      <h2>NPCs</h2>
      <input
        type="text"
        value={newNPC}
        onChange={(e) => setNewNPC(e.target.value)}
      />
      <button onClick={handleAddNPC}>Add NPC</button>
      <ul>
        {NPCs.map((NPC, index) => (
          <li key={index}>{NPC}</li>
        ))}
      </ul>
    </div>
  )
}


function EventFocusTable({ data }) {
  return (
    <div>
      <h2>Event Focus</h2>
      <table>
        <thead>
          <tr>
            <th>Range</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.range[0]}--{entry.range[1]}</td>
              <td>{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


function EventMeaningTable({ data }) {
  const [rolledAction, setRolledAction] = useState(null);
  const [rolledSubject, setRolledSubject] = useState(null);
  const [showActionTable, setShowActionTable] = useState(false);
  const [showSubjectTable, setShowSubjectTable] = useState(false);

  const rollTables = () => {
    const randomActionIndex = Math.floor(Math.random() * data.actions.length);
    const randomSubjectIndex = Math.floor(Math.random() * data.subjects.length);
    setRolledAction(data.actions[randomActionIndex]);
    setRolledSubject(data.subjects[randomSubjectIndex]);
  };

  return (
    <div>
      <h2>Event Meaning Table</h2>
      <button onClick={rollTables}>Roll Tables</button>
      {rolledAction && rolledSubject && (
        <p>
          Rolled Action: {rolledAction} - Rolled Subject: {rolledSubject}
        </p>
      )}
      <button onClick={() => setShowActionTable(true)}>Show Action Table</button>
      <button onClick={() => setShowSubjectTable(true)}>Show Subject Table</button>
      {showActionTable && (
        <div className="modal" onClick={() => setShowActionTable(false)}>
          <div className="modal-content">
            <button className="close-icon" onClick={() => setShowActionTable(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
            <h3>Action Table</h3>
            <table className="multi-column-table">
              <tbody>
                {data.actions.map((action, index) => (
                  <tr key={index}>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showSubjectTable && (
        <div className="modal" onClick={() => setShowSubjectTable(false)}>
          <div className="modal-content">
          <button className="close-icon" onClick={() => setShowActionTable(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
            <h3>Subject Table</h3>
            <table className="multi-column-table">
              <tbody>
                {data.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function EventMeaningElements({ data }) {
  const [rolledLocation, setRolledLocation] = useState(null);
  const [rolledCharacter, setRolledCharacter] = useState(null);
  const [rolledObject, setRolledObject] = useState(null);
  const [showLocationTable, setShowLocationTable] = useState(false);
  const [showCharacterTable, setShowCharacterTable] = useState(false);
  const [showObjectTable, setShowObjectTable] = useState(false);

  const rollTables = () => {
    const randomLocationIndex = Math.floor(Math.random() * data.locations.length);
    const randomCharacterIndex = Math.floor(Math.random() * data.characters.length);
    const randomObjectIndex = Math.floor(Math.random() * data.objects.length);
    setRolledLocation(data.locations[randomLocationIndex]);
    setRolledCharacter(data.characters[randomCharacterIndex]);
    setRolledObject(data.objects[randomObjectIndex]);
  };

  return (
    <div>
      <h2>Event Meaning Elements</h2>
      <button onClick={rollTables}>Roll Tables</button>
      {rolledLocation && rolledCharacter && rolledObject && (
        <p>
          Rolled Location: {rolledLocation} - Rolled Charater: {rolledCharacter} - Rolled Object: {rolledObject}
        </p>
      )}
      <button onClick={() => setShowLocationTable(true)}>Show Location Table</button>
      <button onClick={() => setShowCharacterTable(true)}>Show Character Table</button>
      <button onClick={() => setShowObjectTable(true)}>Show Object Table</button>
      {showLocationTable && (
        <div className="modal" onClick={() => setShowLocationTable(false)}>
          <div className="modal-content">
            <button className="close-icon" onClick={() => setShowLocationTable(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
            <h3>Location Table</h3>
            <table className="multi-column-table">
              <tbody>
                {data.locations.map((location, index) => (
                  <tr key={index}>
                    <td>{location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showCharacterTable && (
        <div className="modal" onClick={() => setShowCharacterTable(false)}>
          <div className="modal-content">
          <button className="close-icon" onClick={() => setShowCharacterTable(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
            <h3>Character Table</h3>
            <table className="multi-column-table">
              <tbody>
                {data.characters.map((character, index) => (
                  <tr key={index}>
                    <td>{character}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showObjectTable && (
        <div className="modal" onClick={() => setShowObjectTable(false)}>
          <div className="modal-content">
          <button className="close-icon" onClick={() => setShowObjectTable(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
            <h3>Object Table</h3>
            <table className="multi-column-table">
              <tbody>
                {data.objects.map((object, index) => (
                  <tr key={index}>
                    <td>{object}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}



function FantasyNameGenerator({ fetchGeneratedNames, generatedNames }) {
  return (
    <div>
      <h2>Fantasy Name Generator</h2>
      <button onClick={fetchGeneratedNames}>Generate Names</button>
      <ul>
        {generatedNames && generatedNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App