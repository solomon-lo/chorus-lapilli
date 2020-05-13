import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      turn_number: 0,
      xIsNext: true,
      current_player: null,
      alert: "here are player alerts",
      prevRemove: -1,
    };
  }

  handleClick(i) {

    var selectedInvalidSquare = false;
    const squares = this.state.squares.slice();

    if (calculateWinner(squares)) {
      return;
    }

    if ((this.state.turn_number > 5) && (this.state.turn_number % 2 === 0)) {

      //if statement to check if center contains the current player
      let center_checker = this.state.xIsNext ? 'X' : 'O';
      if (squares[4] === center_checker) {
        this.setState({
          squares: squares,
          alert: "checking center"
        });
        var temp_content_i = squares[i];
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        if (calculateWinner(squares)) {
          this.setState({
            alert: "Player " + center_checker + " won!",
            squares: squares,
          });
          return;
        }
        else {
          squares[i] = temp_content_i;
          //didn't return because it didn't win. Must clear middle and increase turn number
          this.setState({
            squares: squares,
            alert: "removing your piece from center"
          });
          //clears the middle
          squares[4] = null;


          this.setState({
            squares: squares,
            alert: "removing your piece from center",
            prevRemove: 4,
          });



          //increases turn number
          this.setState({ turn_number: this.state.turn_number + 1 });
        }
      }



      else {
        squares[i] = null;

        this.setState({
          squares: squares,
          prevRemove: i,
          turn_number: this.state.turn_number + 1,
        });
      }
    }


    else if (this.state.turn_number > 5) {
      var validMoves = [0, 3, 4, 5, 2];
      switch (this.state.prevRemove) {
        case 0:
          validMoves = [3, 4, 1];
          break;
        case 1:
          validMoves = [0, 3, 4, 5, 2]
          break;
        case 2:
          validMoves = [1, 4, 5]
          break;
        case 3:
          validMoves = [0, 1, 4, 7, 8]
          break;
        case 4:
          validMoves = [0, 1, 2, 3, 5, 6, 7, 8]
          break;
        case 5:
          validMoves = [1, 2, 4, 7, 8]
          break;
        case 6:
          validMoves = [3, 4, 7]
          break;
        case 1:
          validMoves = [6, 3, 4, 5, 8]
          break;
        case 1:
          validMoves = [7, 4, 5]
          break;
        default:
      }

      if (validMoves.includes(i)) {
        squares[i] = this.state.xIsNext ? 'X' : 'O';
      }
      else {
        this.setState({ alert: "not a valid move because it's not adjacent, randomly selecting a move for you, or skipping turn if none is possible" });
        selectedInvalidSquare = true;
        for (var index = 0; index < validMoves.length; index++) {
          if (squares[validMoves[index]] == null) {
            squares[validMoves[index]] = this.state.xIsNext ? 'X' : 'O';
            break;
          }
        }
      }


      if (!selectedInvalidSquare) {
        squares[i] = this.state.xIsNext ? 'X' : 'O';
      }
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        turn_number: this.state.turn_number + 1,
      });

      //ending bracket for the huge else statement
    }

    else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        turn_number: this.state.turn_number + 1,
      });
    }
    if (calculateWinner(squares)) {
      return;
    }
  }


  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    let display_number = this.state.turn_number;


    return (
      <div>
        <div className="status">{status}</div>
        <div className="current_player">{this.state.current_player}</div>
        <div className="alert">{this.state.alert}</div>
        <div className="turn number">{display_number}</div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
