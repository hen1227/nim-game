import {BoardState, Move} from "../types/game";

export const generateRandomBoard = (): BoardState => {
    const rows = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, () => Math.floor(Math.random() * 6) + 1);
    return { rows, playerTurn: 1 };
}

export const nextPlayer = (playerTurn: number): number => {
    return playerTurn === 1 ? 2 : 1;
}

export const whoWins = (rows: number[], currentTurn: number): number | null => {
    const binaryXOR = rows.reduce((acc, row) => acc ^ row, 0);

    return binaryXOR === 0 ? currentTurn : (currentTurn) % 2 + 1;
}


export const findNextBestMove = (rows: number[]): {
    move: Move,
    optimal?: boolean | null
} | null => {
    const binaryXOR = rows.reduce((acc, row) => acc ^ row, 0);
    // Move on the row with a 1 bit at left most xor bit 1
    // Once we have the row, we just remove the required number of chocolates to make the xor 0000

    if (binaryXOR === 0) {
        const rowsWithNonZeroChocolates = rows.map((_row, idx) => idx).filter(idx => rows[idx] > 0);

        const randomRowIndex = rowsWithNonZeroChocolates[Math.floor(Math.random() * rowsWithNonZeroChocolates.length)];
        const randomCount = Math.floor(Math.random() * rows[randomRowIndex]) + 1;

        return {
            move: { rowIndex: randomRowIndex, count: randomCount },
            optimal: false
        };
    }

    const leftMostBit = Math.floor(Math.log2(binaryXOR)) || 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const hasLeftMostBit = ((row >> leftMostBit) & 1) === 1;
        if (hasLeftMostBit) {
            const xorWithoutRow = rows.reduce((acc, r, idx) => idx !== i ? acc ^ r : acc, 0);
            const shouldRemove = row - xorWithoutRow

            return {
                move: {rowIndex: i, count: shouldRemove },
                optimal: true
            };
        }
    }


    console.error('No move was found despite having a best move!');
    return null;
}
