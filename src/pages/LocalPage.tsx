import React, {useCallback, useEffect, useState} from 'react';
import GameBoard from '../components/GameBoard';
import {BoardHistoryState, BoardState, Move} from '../types/game';
import {generateRandomBoard, findNextBestMove, nextPlayer, whoWins} from "../utils/GameLogic.ts";
import GameBoardPreview from "../components/GameBoardPreview.tsx";

const LocalPage: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(generateRandomBoard());
    const [winner, setWinner] = useState<number | null>(null);

    const [smallScreen, setSmallScreen] = useState<boolean>(window.innerWidth < 800);

    useEffect(() => {
        const handleResize = () => {
            setSmallScreen(window.innerWidth < 800);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const [boardHistory, setBoardHistory] = useState<BoardHistoryState[]>([{
        board: board,
        move: {rowIndex: -1, count: -1},
        wasComputerMoved: false,
        wasOptimalMove: false
    }]);

    const checkForWinner = useCallback((rows: number[]) => {
        const totalChocolates = rows.reduce((sum, row) => sum + row, 0);
        if (totalChocolates === 0) {
            setWinner(board.playerTurn);
            return true;
        }
        return false;
    }, [board.playerTurn]);


    const handleMove = useCallback((move: Move, byComputer: boolean = false, optimal: (boolean | null) = false) => {
        if (winner) return;

        const newRows = board.rows.map((row, idx) =>
            idx === move.rowIndex ? row - move.count : row
        );

        if (checkForWinner(newRows)) {
            setBoard({rows: newRows, playerTurn: board.playerTurn});
        } else {
            setBoard({rows: newRows, playerTurn: nextPlayer(board.playerTurn)});
        }

        setBoardHistory([
            ...boardHistory,
            {
                board: {rows: newRows, playerTurn: nextPlayer(board.playerTurn)},
                move,
                wasComputerMoved: byComputer,
                wasOptimalMove: optimal || false
            }
        ]);
    }, [board.playerTurn, board.rows, boardHistory, checkForWinner, winner]);

    const undoMove = () => {
        if (boardHistory.length <= 1) return;
        const newHistory = [...boardHistory];
        newHistory.pop();
        setBoardHistory(newHistory);
        setBoard(newHistory[newHistory.length - 1].board);
        setWinner(null);
    }

    const makeBestMove = () => {
        const bestMove = findNextBestMove(board.rows);
        if (bestMove) {
            handleMove(bestMove.move, true, bestMove.optimal);
        }
    }

    const restartGame = () => {
        const newBoard = generateRandomBoard();
        setBoard(newBoard);
        setWinner(null);
        setBoardHistory([
            {
                board: newBoard,
                move: {rowIndex: -1, count: -1},
                wasComputerMoved: false,
                wasOptimalMove: false
            }]);
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            if (event.key === 'r') {
                restartGame();
            }
            if (event.key === 'm') {
                const bestMove = findNextBestMove(board.rows);
                if (bestMove) {
                    handleMove(bestMove.move, true, bestMove.optimal);
                }
            }
        }

        window.addEventListener('keydown', keyboardListener);

        return () => {
            window.removeEventListener('keydown', keyboardListener);
        };
    }, [board, handleMove]);


    return (
        <div className="page">
            {!smallScreen &&
                <div className={'info-section'}>
                    <div className={'game-rules'}>
                        <h2>Rules</h2>
                        <p>• There are multiple rows of chocolates</p>
                        <p>• Players take turns eating chocolates</p>
                        <p>• Player can eat any number of chocolates from a single row</p>
                        <p>• Player who eats the last chocolate wins</p>
                    </div>
                    <div className={'keyboard-shortcuts'}>
                        <p>Press "r" to restart the game</p>
                        <p>Press "m" to make the best move</p>
                    </div>
                </div>
            }
            <div className={'game-section'}>
                <span className="spacer"></span>
                <h1>Chocolate Game</h1>
                <span className="spacer"></span>
                <h2>Take turns eating chocolate</h2>
                <p>Be the one to eat the last chocolate!</p>
                <span className={'spacer'}></span>
                {winner ? (
                    <h2>Player {winner} wins!</h2>
                ) : (
                    <h2 className={`${board.playerTurn === 1 ? 'player-one' : 'player-two'}-container`}>
                        Player {board.playerTurn}'s turn</h2>
                )}
                <div
                    className={`player-background player-${board.playerTurn === 1 ? 'one' : 'two'}${winner ? '-wins' : ''}`}></div>
                <GameBoard board={board} onMove={handleMove}/>
                <div className={'game-buttons'}>
                    <button disabled={boardHistory.length <= 1} onClick={undoMove}>Undo Move</button>
                    <button disabled={winner !== null} onClick={makeBestMove}>Make Best Move</button>
                    <button onClick={restartGame}>Restart Game</button>
                </div>
                <span className="spacer"></span>
                <span className="spacer"></span>
            </div>
            {!smallScreen &&
                <div className={'info-section'}>
                    <h2>Move History</h2>
                    {winner ? <p>Game Over</p> :
                        whoWins(board.rows, board.playerTurn) === 1 ?
                            <p>Blue can force a win</p> :
                            <p>Red can force a win</p>
                    }
                    <div className={'move-history'}>
                        {boardHistory.map((history, idx) => (
                            <div key={idx} className={'move'}>
                                <GameBoardPreview historyState={history}/>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default LocalPage;
