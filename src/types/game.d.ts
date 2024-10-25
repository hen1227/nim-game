export interface BoardState {
    rows: GameRow;
    playerTurn: number;
}

export interface BoardHistoryState {
    board: BoardState;
    move: Move;
    wasComputerMoved: boolean;
    wasOptimalMove: boolean;
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
