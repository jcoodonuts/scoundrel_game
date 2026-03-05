import React, { useState } from 'react';
import { useGame } from './logic/useGame';
import Card from './components/Card';
import { CARD_TYPES } from './logic/engine';
import './App.css';

function App() {
  const { state, startNewGame, nextRoom, avoidRoom, interactWithCard } = useGame();
  const [hoveredMonster, setHoveredMonster] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  let potentialDamage = 0;
  if (hoveredMonster) {
    potentialDamage = hoveredMonster.value;
    if (state.weapon && (state.weapon.lastMonsterValue === null || state.weapon.lastMonsterValue > hoveredMonster.value)) {
      potentialDamage = Math.max(0, hoveredMonster.value - state.weapon.value);
    }
  }

  const projectedHealth = Math.max(0, state.health - potentialDamage);

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="title-container">
          <h1 className="title-font">Scoundrel</h1>
          <button className="help-button" onClick={() => setShowHelp(true)} title="How to Play?">?</button>
        </div>
        <div className="stats glass-panel">
          <div className="stat-item">
            <span className="stat-label">HEALTH</span>
            <div className="health-bar-container">
              <div
                className="health-bar-fill"
                style={{ width: `${(state.health / 20) * 100}%` }}
              ></div>
              {hoveredMonster && potentialDamage > 0 && (
                <div
                  className="health-bar-preview"
                  style={{
                    width: `${(potentialDamage / 20) * 100}%`,
                    left: `${(projectedHealth / 20) * 100}%`
                  }}
                ></div>
              )}
            </div>
            <span className="stat-value">{state.health} / 20</span>
          </div>
          <div className={`stat-item ${state.lastEvent?.type === 'weapon_break' ? 'break-shake' : ''}`} key={state.lastEvent?.timestamp || 'weapon'}>
            <span className="stat-label">WEAPON</span>
            <span className="stat-value gold">
              {state.weapon ? `${state.weapon.value} (Last: ${state.weapon.lastMonsterValue || 'None'})` : 'NONE'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">DUNGEON</span>
            <span className="stat-value">{state.deck.length} CARDS LEFT</span>
          </div>
        </div>
      </header>

      <main className="game-board">
        {state.room.length > 0 ? (
          <div className="room-grid">
            {state.room.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={interactWithCard}
                onMouseEnter={(c) => c.type === CARD_TYPES.MONSTER && setHoveredMonster(c)}
                onMouseLeave={() => setHoveredMonster(null)}
                disabled={state.gameOver}
              />
            ))}
          </div>
        ) : !state.gameOver ? (
          <div className="empty-room">
            <p>The path is clear. Venture deeper?</p>
            <button className="btn-primary" onClick={nextRoom}>ENTER DUNGEON</button>
          </div>
        ) : null}

        {!state.gameOver && state.room.length === 1 && state.history.filter(h => ['potion', 'weapon', 'monster'].includes(h)).length === 3 && (
          <div className="next-room-overlay">
            <button className="btn-primary" onClick={nextRoom}>NEXT ROOM</button>
          </div>
        )}

        {state.lastEvent?.type === 'weapon_break' && (
          <div key={state.lastEvent.timestamp} className="weapon-break-notification">
            <span className="break-icon">⚔️</span>
            <span className="break-text title-font">WEAPON FAILED!</span>
          </div>
        )}

        {state.gameOver && (
          <div className="game-over-overlay glass-panel">
            <h2 className="title-font">{state.won ? 'VICTORY' : 'DEFEAT'}</h2>
            <p>{state.won ? 'You have cleared the dungeon!' : 'You fell in the darkness.'}</p>
            <button className="btn-primary" onClick={startNewGame}>TRY AGAIN</button>
          </div>
        )}
      </main>

      <footer className="game-controls">
        <button
          className="btn-secondary"
          onClick={avoidRoom}
          disabled={!state.canAvoid || state.room.length !== 4 || state.gameOver}
        >
          AVOID ROOM
        </button>
        <button className="btn-primary" onClick={startNewGame}>
          NEW GAME
        </button>
      </footer>

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHelp(false)}>&times;</button>
            <h2 className="title-font gold">HOW TO PLAY SCOUNDREL?</h2>
            <div className="rules-scroll">
              <section>
                <h3>OBJECTIVE</h3>
                <p>Clear the entire 44-card dungeon deck without your health reaching zero.</p>
              </section>
              <section>
                <h3>THE ROOM</h3>
                <p>Each room has 4 cards. You must interact with 3 cards to "clear" the room and venture deeper. The 4th card stays for the next room.</p>
              </section>
              <section>
                <h3>CARDS</h3>
                <ul>
                  <li><strong>Monsters (♣/♠):</strong> Damage you. Barehanded, you take full damage equal to their rank (2-14).</li>
                  <li><strong>Weapons (♦):</strong> Equip to mitigate monster damage. (Damage taken = Monster Rank - Weapon Power).</li>
                  <li><strong>Potions (♥):</strong> Heal you up to 20 HP. Note: Only the first potion in a room is effective!</li>
                </ul>
              </section>
              <section>
                <h3>WEAPON DURABILITY</h3>
                <p>A weapon can only kill monsters with a rank <strong>strictly lower</strong> than the last one it defeated. If you encounter a stronger monster, you must fight barehanded!</p>
              </section>
              <section>
                <h3>AVOIDANCE</h3>
                <p>Once per room, you can choosing to "AVOID ROOM". All 4 cards move to the bottom of the deck. You cannot avoid two rooms in a row.</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
