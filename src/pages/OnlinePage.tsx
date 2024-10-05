import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameBoard from '../components/GameBoard';
import {AvailableGame, BoardState, Move} from '../types/game';
import axios from 'axios';
import { backendIP } from '../utils/Networking';
import {toast} from "react-toastify";


const socket: Socket = io(backendIP);

const OnlinePage: React.FC = () => {
    const [board, setBoard] = useState<BoardState | null>(null);
    const [winner, setWinner] = useState<number | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState<number>(0); // 1 = Host, 2 = Opponent, 0 = Spectator
    const [availableGames, setAvailableGames] = useState<AvailableGame[]>([]);


    const fetchAvailableGames = async () => {
        try {
            const response = await axios.get(`${backendIP}/games`);
            setAvailableGames(response.data);
        } catch (error) {
            console.error('Error fetching available games:', error);
        }
    };

    const handleHostGame = () => {
        console.log('Host game');
        socket.emit('hostGame');
    };

    const handleJoinGame = (roomId: string) => {
        socket.emit('joinGame', roomId);
    };

    const handleMove = (move: Move) => {
        if (winner || !gameId) return;

        // Check if it's the player's turn
        if (board?.playerTurn !== playerNumber) {
            toast.error('It is not your turn!');
            return;
        }

        socket.emit('playerMove', gameId, move);
    };

    const leaveGame = () => {
        socket.emit('leaveGame');
        resetGame();
    };

    const playAgain = () => {
        socket.emit('playAgain', gameId);
    };

    const resetGame = () => {
        setBoard(null);
        setWinner(null);
        setGameId(null);
        setPlayerNumber(0);
        void fetchAvailableGames();
    };

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        // Socket event listeners
        socket.on('gameHosted', (roomId: string, initialBoard: BoardState) => {
            setGameId(roomId);
            setBoard(initialBoard);
            setPlayerNumber(1);
            toast.success('Game hosted successfully!');
        });

        socket.on('joinedGame', (roomId: string, boardState: BoardState, playerNum: number) => {
            setGameId(roomId);
            setBoard(boardState);
            setPlayerNumber(playerNum);
            toast.success(`Joined game successfully! You are ${(playerNum === 1 || playerNum === 2) ? `Player ${playerNum}` : 'spectating'}`);
        });

        socket.on('updateBoard', (newBoardState: BoardState) => {
            setBoard(newBoardState);
        });

        socket.on('gameOver', (winningPlayer: number) => {
            setWinner(winningPlayer);
        });

        socket.on('hostLeft', () => {
            toast.warn('Host has left the game.');
            resetGame();
        });

        socket.on('opponentLeft', () => {
            toast.warn('Opponent has left the game.');
            resetGame();
        });

        socket.on('gameRestarted', (newBoardState: BoardState) => {
            setBoard(newBoardState);
            setWinner(null);
            toast.info('Game has been restarted!');
        });

        return () => {
            socket.off('gameHosted');
            socket.off('joinedGame');
            socket.off('updateBoard');
            socket.off('gameOver');
            socket.off('hostLeft');
            socket.off('opponentLeft');
            socket.off('gameRestarted');
        };
    }, []);

    return (
        <div className="page">
            <h2>Play the Chocolate Game Online!</h2>
            {!gameId ? (
                <>
                    <button onClick={handleHostGame}>Host New Game</button>
                    {availableGames.length === 0 && <h3>No available games</h3>}
                    {availableGames.length > 0 && (
                        <>
                            <h3>Available Games:</h3>
                            <div className="available-online-games-container">
                                {availableGames.map((game) => (
                                    <div key={game.roomId} className="available-online-game">
                                        <span>
                                            Room ID: {game.roomId} - Players: {game.players}/2
                                        </span>
                                        <button onClick={() => handleJoinGame(game.roomId)}>Join Game</button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <button onClick={fetchAvailableGames}>Refresh List</button>
                </>
            ) : (
                <>
                    <p>Be the one to eat the last chocolate!</p>

                    <div
                        className={`player-background player-${
                            board?.playerTurn === 1 ? 'one' : 'two'
                        }${winner ? '-wins' : ''}`}
                    ></div>
                    {winner ? (
                        <h2>Player {winner} wins!</h2>
                    ) : (
                        <>
                            <h2>
                                {playerNumber === 0
                                    ? `Spectating - Player ${board?.playerTurn}'s turn`
                                    : `Player ${board?.playerTurn}'s turn`}
                            </h2>
                            {playerNumber === 0 && <p className="spectating">You are spectating the game</p>}
                            {playerNumber === 1 && <p className="player-one">You are Player 1</p>}
                            {playerNumber === 2 && <p className="player-two">You are Player 2</p>}

                            {board && <GameBoard board={board} onMove={handleMove} />}
                        </>
                    )}
                    {winner && <button onClick={playAgain}>Play Again!</button>}
                    <h4>Game Room: {gameId}</h4>
                    <button onClick={leaveGame}>Leave Game</button>
                </>
            )}
        </div>
    );
};

export default OnlinePage;
