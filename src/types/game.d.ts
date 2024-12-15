export interface BoardState {
    rows: GameRows;
    playerTurn: number;
}

export interface BoardHistoryState {
    board: BoardState;
    move: Move;
    wasComputerMoved: boolean;
    wasOptimalMove: boolean;
}

export type GameRows = number[];

export interface Move {
    rowIndex: number;
    count: number;
}

export interface AvailableGame {
    roomId: string;
    players: number;
    createdAt: Date;
}
