import React, { useState } from 'react';
import GameBoard from '../components/GameBoard';
import { BoardState, Move } from '../types/game';
import {generateRandomBoard, nextPlayer} from "../utils/GameLogic.ts";

const LocalPage: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(generateRandomBoard());
    const [winner, setWinner] = useState<number | null>(null);

    const handleMove = (move: Move) => {
        if (winner) return;

        const newRows = board.rows.map((row, idx) =>
            idx === move.rowIndex ? row - move.count : row
        );

        if (checkForWinner(newRows)) {
            setBoard({ rows: newRows, playerTurn: board.playerTurn });
        } else {
            setBoard({rows: newRows, playerTurn: nextPlayer(board.playerTurn)});
        }
    };

    const checkForWinner = (rows: number[]) => {
        const totalChocolates = rows.reduce((sum, row) => sum + row, 0);
        if (totalChocolates === 0) {
            setWinner(board.playerTurn);
            return true;
        }
        return false;
    };

    const restartGame = () => {
        setBoard(generateRandomBoard());
        setWinner(null);
    };

    return (
        <div className="page">
            <h2>Take turns eating chocolate</h2>
            <p>Be the one to eat the last chocolate!</p>
            <span className={'spacer'}></span>
            {winner ? (
                <h2>Player {winner} wins!</h2>
            ) : (
                <h2>Player {board.playerTurn}'s turn</h2>
            )}
            <div className={`player-background player-${board.playerTurn === 1 ? 'one' : 'two'}${winner ? '-wins' : ''}`}></div>
            <GameBoard board={board} onMove={handleMove}/>
            <button onClick={restartGame}>Restart Game</button>
        </div>
    );
};

export default LocalPage;
