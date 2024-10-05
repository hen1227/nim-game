import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameBoard from '../components/GameBoard';
import { AvailableGame, BoardState, Move } from '../types/game';
import axios from 'axios';
import { backendIP } from '../utils/Networking';
import { toast } from 'react-toastify';

const socket: Socket = io(backendIP);

const OnlinePage: React.FC = () => {
    const [board, setBoard] = useState<BoardState | null>(null);
    const [winner, setWinner] = useState<number | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [playerNumber, setPlayerNumber] = useState<number>(0); // 1 = Host, 2 = Opponent, 0 = Spectator
    const [availableGames, setAvailableGames] = useState<AvailableGame[]>([]);

    // New state variables
    const [opponentJoined, setOpponentJoined] = useState<boolean>(false);
    const [spectatorCount, setSpectatorCount] = useState<number>(0);
    const [socketConnected, setSocketConnected] = useState<boolean>(socket.connected);

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

        if (playerNumber !== 1 && playerNumber !== 2) {
            toast.error('Spectators cannot make moves!');
            return;
        }

        if (!opponentJoined) {
            toast.error('Waiting for opponent to join!');
            return;
        }

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
        setOpponentJoined(false);
        setSpectatorCount(0);
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
        socket.on('connect', () => {
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
            // toast.error('Socket disconnected. Attempting to reconnect...');
        });

        socket.on('gameHosted', (roomId: string, initialBoard: BoardState) => {
            setGameId(roomId);
            setBoard(initialBoard);
            setPlayerNumber(1);
            setOpponentJoined(false);
            toast.success('Game hosted successfully!');
        });

        socket.on('joinedGame', (roomId: string, boardState: BoardState, playerNum: number) => {
            setGameId(roomId);
            setBoard(boardState);
            setPlayerNumber(playerNum);

            if (playerNum === 2) {
                setOpponentJoined(true);
                toast.success('Joined game as Player 2!');
                socket.emit('notifyPlayerJoined', roomId, playerNum);
            } else if (playerNum === 0) {
                toast.success('Spectating the game!');
            }
        });

        socket.on('playerJoined', (playerNum: number) => {
            if (playerNum === 2) {
                setOpponentJoined(true);
                toast.info('Opponent has joined the game!');
            }
        });

        socket.on('opponentLeft', () => {
            setOpponentJoined(false);
            toast.warn('Opponent has left the game.');
        });

        socket.on('spectatorJoined', (spectators: number) => {
            setSpectatorCount(spectators);
        });

        socket.on('spectatorLeft', (spectators: number) => {
            setSpectatorCount(spectators);
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
            socket.off('connect');
            socket.off('disconnect');
            socket.off('gameHosted');
            socket.off('joinedGame');
            socket.off('playerJoined');
            socket.off('opponentLeft');
            socket.off('spectatorJoined');
            socket.off('spectatorLeft');
            socket.off('updateBoard');
            socket.off('gameOver');
            socket.off('hostLeft');
            socket.off('opponentLeft');
            socket.off('gameRestarted');
        };
    }, []);

    return (
        <div className="page">
            <span className="spacer"></span>
            <span className="spacer"></span>
            <h2>🍫 Chocolate Game Online! 🛜</h2>

            {!socketConnected && (
                <div className="socket-disconnected">
                    <p>Socket is disconnected.</p>
                    <button onClick={() => window.location.reload()}>Reconnect</button>
                </div>
            )}

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
                                          ID: {game.roomId} | Players: {game.players}/2
                                        </span>
                                        <button onClick={() => handleJoinGame(game.roomId)}>
                                            {game.players >= 2 ? 'Spectate' : 'Join Game'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <button onClick={fetchAvailableGames}>Refresh List</button>
                    <span className="spacer"></span>
                    <span className="spacer"></span>
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
                        <h2 className={`player-${winner === 1 ? 'one' : 'two'}-container`}>Player {winner} wins!</h2>
                    ) : (
                        <>
                            <h2>Player {board?.playerTurn}'s turn</h2>
                            {playerNumber === 0 && <p className="spectating">You are spectating the game</p>}
                            {playerNumber === 1 && <p className="player-one-container">You are Player 1</p>}
                            {playerNumber === 2 && <p className="player-two-container">You are Player 2</p>}

                            {playerNumber === 1 && (
                                <p>{!opponentJoined && 'Waiting for opponent to join...'}</p>
                            )}

                            {spectatorCount > 0 && <p className={'spectator-count'}>Spectators: {spectatorCount}</p>}

                            {board && <GameBoard board={board} onMove={handleMove}/>}
                        </>
                    )}
                    {winner && playerNumber !== 0 && <button onClick={playAgain}>Play Again!</button>}
                    <h4>Game Room: {gameId}</h4>
                    <button onClick={leaveGame}>Leave Game</button>
                    <span className="spacer"></span>
                    <span className="spacer"></span>
                </>
            )}
        </div>
    );
};

export default OnlinePage;
