import {BoardState} from "../types/game";

export const generateRandomBoard = (): BoardState => {
    const rows = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, () => Math.floor(Math.random() * 6) + 1);
    return { rows, playerTurn: 1 };
}

export const nextPlayer = (playerTurn: number): number => {
    return playerTurn === 1 ? 2 : 1;
}
