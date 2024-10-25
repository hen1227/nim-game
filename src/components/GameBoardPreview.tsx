import {BoardHistoryState} from "../types/game";
import React from "react";

type GameBoardPreviewProps = {
    historyState: BoardHistoryState;
}

const GameBoardPreview: React.FC<GameBoardPreviewProps> = ({historyState}) => {
    return (
        <div className={'game-board-preview'}>
            <div className={'game-board-preview-details'}>
                {historyState.wasComputerMoved ? (historyState.wasOptimalMove ?
                    <p>🖥 🌟</p> : <p>🖥 🎲</p>) :
                    (historyState.board.playerTurn === 2 ?
                        <p>👤🔴</p> : <p>👤🔵</p>)}
            </div>
            <div className={'game-board-preview-table'}>
                {historyState.board.rows.map((chocolates: number, rowIndex: number) => (
                    <div className={'game-board-preview-row'} key={rowIndex}>
                    <span>
                        {Array.from({length: chocolates}, (_, i) => (
                            <span key={i}>🍫</span>
                        ))}
                    </span>
                        <p>{chocolates}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GameBoardPreview;

