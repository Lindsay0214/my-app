import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square 組件渲染一個<button>正方形  // controlled components，Board Class 有完全控制權
// class Square extends React.Component {
//     // 添加一個構造函數來初始化狀態
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: null,
//         };
//     }
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// Board 渲染 9 個正方形
class Board extends React.Component {
    // 初始狀態：9 個方格＆9 個空值的數組
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),     // Array.prototype.fill()，fill() 方法會將陣列中索引的第一個到最後一個的每個位置全部填入一個靜態的值。
            xIsNext: true,
        };
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />   // 父 Board 組件向子 Square 組件 “傳遞了一個 props”
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// Game 渲染帶有佔位符值的板
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        // slice() 方法會回傳一個新陣列物件，為原陣列選擇之 begin 至 end（不含 end）部分的淺拷貝（shallow copy）。而原本的陣列將不會被修改。 -> immutable
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                //.concat() 合併兩個或多個陣列。此方法不會改變現有的陣列，回傳一個包含呼叫者陣列本身的值，作為代替的是回傳一個新陣列。
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
