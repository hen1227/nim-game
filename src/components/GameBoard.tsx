// GameBoard.tsx
import React, { useState } from 'react';
import '../styles/Game.css';
import { BoardState, Move } from '../types/game';

interface GameBoardProps {
    board: BoardState;
    onMove: (move: Move, byComputer?: boolean) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onMove }) => {
    const [hoverState, setHoverState] = useState<{ rowIndex: number; hoverIndex: number } | null>(
        null
    );

    const handleMouseEnter = (rowIndex: number, hoverIndex: number) => {
        setHoverState({ rowIndex, hoverIndex });
    };

    const handleMouseLeave = () => {
        setHoverState(null);
    };

    return (
        <div className="game-board">
            {board.rows.map((chocolates: number, rowIndex: number) => (
                <div key={rowIndex} className="row">
                    <div className="row-details">
                        <p><b>{chocolates} 🍫</b></p>
                        <p>{chocolates.toString(2).padStart(4, '0')}</p>
                    </div>
                    <div className="chocolates">
                        {Array.from({ length: chocolates }, (_, i) => (
                            <button
                                key={i}
                                className={`chocolate-button ${
                                    hoverState &&
                                    hoverState.rowIndex === rowIndex &&
                                    i <= hoverState.hoverIndex
                                        ? `highlight-${board.playerTurn === 1 ? 'player-one' : 'player-two'}`
                                        : ''
                                }`}
                                onMouseEnter={() => handleMouseEnter(rowIndex, i)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => {
                                    onMove({ rowIndex, count: i + 1 });
                                    setHoverState(null);
                                }}
                            >
                                🍫
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
