export const SUITS = {
    CLUBS: 'clubs',
    SPADES: 'spades',
    HEARTS: 'hearts',
    DIAMONDS: 'diamonds',
};

export const CARD_TYPES = {
    MONSTER: 'monster',
    POTION: 'potion',
    WEAPON: 'weapon',
};

export const getCardType = (suit) => {
    if (suit === SUITS.CLUBS || suit === SUITS.SPADES) return CARD_TYPES.MONSTER;
    if (suit === SUITS.HEARTS) return CARD_TYPES.POTION;
    if (suit === SUITS.DIAMONDS) return CARD_TYPES.WEAPON;
    return null;
};

export const createDeck = () => {
    const deck = [];
    const suits = [SUITS.CLUBS, SUITS.SPADES, SUITS.HEARTS, SUITS.DIAMONDS];
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11=J, 12=Q, 13=K, 14=A

    for (const suit of suits) {
        for (const value of values) {
            // Scoundrel rules: 
            // - No red face cards (K, Q, J of Hearts/Diamonds)
            // - No red Aces (Ace of Hearts/Diamonds)
            const isRed = (suit === SUITS.HEARTS || suit === SUITS.DIAMONDS);
            const isFaceOrAce = value >= 11;

            if (isRed && isFaceOrAce) continue;

            deck.push({
                id: `${suit}-${value}`,
                suit,
                value,
                type: getCardType(suit),
                faceUp: false,
            });
        }
    }
    return shuffle(deck);
};

export const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const INITIAL_STATE = {
    health: 20,
    weapon: null, // { value: number, lastMonsterKilled: number | null }
    deck: [],
    room: [],
    discard: [],
    history: [], // For avoiding logic and potion limits
    canAvoid: true,
    gameOver: false,
    won: false,
    lastEvent: null, // { type: string, timestamp: number }
};

export const startNextRoom = (state) => {
    const { deck, room, weapon } = state;
    const newRoom = [...room];
    const newDeck = [...deck];

    while (newRoom.length < 4 && newDeck.length > 0) {
        const card = newDeck.shift();
        newRoom.push({ ...card, faceUp: true });
    }

    // Can avoid if last turn was not an avoid
    const lastAction = state.history[state.history.length - 1];
    const canAvoid = lastAction !== 'avoid' && newRoom.length === 4;

    return {
        ...state,
        room: newRoom,
        deck: newDeck,
        weapon, // Explicitly preserve weapon state
        canAvoid,
        history: [], // Reset room history for potion limit
    };
};

export const avoidRoom = (state) => {
    if (!state.canAvoid) return state;

    return {
        ...state,
        deck: [...state.deck, ...state.room.map(c => ({ ...c, faceUp: false }))],
        room: [],
        history: ['avoid'],
        canAvoid: false,
    };
};

export const interactWithCard = (state, cardId) => {
    const cardIndex = state.room.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return state;

    const card = state.room[cardIndex];
    let { health, weapon, room, discard, history, gameOver, won } = state;

    const newRoom = [...room];
    newRoom.splice(cardIndex, 1);
    const newHistory = [...history];

    if (card.type === CARD_TYPES.POTION) {
        // Only first potion in a room heals
        if (!history.includes('potion')) {
            health = Math.min(20, health + card.value);
        }
        newHistory.push('potion');
    } else if (card.type === CARD_TYPES.WEAPON) {
        weapon = { value: card.value, lastMonsterValue: null };
        newHistory.push('weapon');
    } else if (card.type === CARD_TYPES.MONSTER) {
        let damage = card.value;
        let event = null;
        // Weapon can be used if it's the first monster OR if this monster is weaker than the last one killed
        if (weapon && (weapon.lastMonsterValue === null || weapon.lastMonsterValue > card.value)) {
            damage = Math.max(0, card.value - weapon.value);
            weapon = { ...weapon, lastMonsterValue: card.value };
        } else if (weapon) {
            // Weapon exists but cannot be used (fails DURABILITY check)
            event = { type: 'weapon_break', timestamp: Date.now() };
        }
        health -= damage;
        newHistory.push('monster');
        return {
            ...state,
            health: Math.max(0, health),
            weapon,
            room: newRoom,
            discard: [...discard, card],
            history: newHistory,
            gameOver: health <= 0,
            won: state.deck.length === 0 && newRoom.length === 0,
            lastEvent: event
        };
    }

    const newDiscard = [...discard, card];

    if (health <= 0) {
        health = 0;
        gameOver = true;
    }

    if (state.deck.length === 0 && newRoom.length === 0) {
        won = true;
        gameOver = true;
    }

    return {
        ...state,
        health,
        weapon,
        room: newRoom,
        discard: newDiscard,
        history: newHistory,
        gameOver,
        won
    };
};
