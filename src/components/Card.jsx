import React from 'react';
import './Card.css';

const Card = ({ card, onClick, onMouseEnter, onMouseLeave, disabled }) => {
    const getSuitSymbol = (suit) => {
        switch (suit) {
            case 'clubs': return '♣';
            case 'spades': return '♠';
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            default: return '';
        }
    };

    const getValueDisplay = (value) => {
        if (value === 11) return 'J';
        if (value === 12) return 'Q';
        if (value === 13) return 'K';
        if (value === 14) return 'A';
        return value;
    };

    return (
        <div
            className={`card ${card.suit} ${disabled ? 'disabled' : ''}`}
            onClick={!disabled ? () => onClick(card.id) : undefined}
            onMouseEnter={onMouseEnter ? () => onMouseEnter(card) : undefined}
            onMouseLeave={onMouseLeave ? () => onMouseLeave(card) : undefined}
        >
            <div className="card-inner">
                <div className="card-front">
                    <div className="card-value top">{getValueDisplay(card.value)}</div>
                    <div className="card-suit-large">{getSuitSymbol(card.suit)}</div>
                    <div className="card-value bottom">{getValueDisplay(card.value)}</div>
                    <div className="card-type-label">{card.type.toUpperCase()}</div>
                </div>
                <div className="card-back">
                    <div className="card-back-pattern"></div>
                </div>
            </div>
        </div>
    );
};

export default Card;
