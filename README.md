# Scoundrel - Dungeon Crawler Card Game

**Scoundrel** is a premium, web-based implementation of the solo dungeon-crawler card game designed by **Zach Gage and Kurt Bieg**.

> [!IMPORTANT]
> This is a fan-made web implementation for educational and personal use. I do not own the rights to the "Scoundrel" game itself; all credit for the original design and rules belongs to Gage and Bieg.

Built with React and Vite, it features a high-end "Dark Dungeon" aesthetic and precise gameplay mechanics.

## ⚔️ The Game

In Scoundrel, you play as a lone adventurer navigating a deck of 44 cards (the Dungeon). Your goal is to clear every card in the deck without your health reaching zero.

### Core Features

- **Strategic Combat**: Use weapons (Diamonds) to mitigate damage from Monsters (Clubs/Spades).
- **Weapon Durability**: Weapons only work against monsters with a rank **strictly lower** than the last one defeated by that weapon.
- **Dynamic Risk Assessment**: Avoid one room per turn to cycle the deck, but beware: those cards will return!
- **Damage Preview**: Hover over any monster to see a real-time prediction of health loss.
- **Glassmorphic UI**: A premium dark-mode interface with Cinzel typography and 3D card animations.

## 🕹️ How to Play

1. **Enter the Dungeon**: Click "ENTER DUNGEON" to deal the first room of 4 cards.
2. **Interact**: In each room, you must play 3 cards. The 4th stays for the next room.
   - **Potions (Hearts)**: Heal up to 20 HP. Only the *first* potion taken in a room is effective.
   - **Weapons (Diamonds)**: Equip to gain defense.
   - **Monsters (Clubs/Spades)**: Fight them! Damage = Monster Rank - Weapon Power.
3. **Sequence Matters**: Plan your path to ensure you have weapons ready for high-rank monsters (J, Q, K, A).
4. **Venture Deeper**: Once 3 cards are played, click "NEXT ROOM" to proceed.

## 🛠️ Tech Stack

- **React 18** (Vite + SWC)
- **Vanilla CSS** (Custom Design System)
- **Antigravity AI** (Core Game Engine)

## 🚀 Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---
*Created with ⚔️ by Antigravity.*
