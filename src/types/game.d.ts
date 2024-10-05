export interface BoardState {
    rows: GameRow;
    playerTurn: number;
}

export type GameRow = number[];

export interface Move {
    rowIndex: number;
    count: number;
}

export interface AvailableGame {
    roomId: string;
    players: number;
    createdAt: Date;
}
