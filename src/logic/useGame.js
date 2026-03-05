import { useState, useCallback, useEffect } from 'react';
import { createDeck, startNextRoom, avoidRoom as avoidRoomLogic, interactWithCard as interactWithCardLogic, INITIAL_STATE } from './engine';

export const useGame = () => {
    const [state, setState] = useState(() => {
        const deck = createDeck();
        const initialState = { ...INITIAL_STATE, deck };
        return startNextRoom(initialState);
    });

    const startNewGame = useCallback(() => {
        const deck = createDeck();
        const initialState = { ...INITIAL_STATE, deck };
        setState(startNextRoom(initialState));
    }, []);

    const nextRoom = useCallback(() => {
        setState(prev => startNextRoom(prev));
    }, []);

    const avoidRoom = useCallback(() => {
        setState(prev => avoidRoomLogic(prev));
    }, []);

    const interactWithCard = useCallback((cardId) => {
        setState(prev => interactWithCardLogic(prev, cardId));
    }, []);

    /*
    // Auto-start next room if current room is cleared (history contains 3 interactions)
    useEffect(() => {
        const interactions = state.history.filter(h => ['potion', 'weapon', 'monster'].includes(h)).length;
        if (interactions === 3 && state.room.length === 1 && !state.gameOver) {
            setTimeout(() => {
                nextRoom();
            }, 600); // Small delay for visual transition
        }
    }, [state.history, state.room.length, state.gameOver, nextRoom]);
    */

    return {
        state,
        startNewGame,
        nextRoom,
        avoidRoom,
        interactWithCard,
    };
};
