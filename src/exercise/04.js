// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const emptyArray = Array(9).fill(null)

function Game() {
  const [squares, setSquares] = useLocalStorageState('squares', emptyArray)

  const [history, setHistory] = React.useState(() =>
    window.localStorage.getItem('historySquares')
      ? JSON.parse(window.localStorage.getItem('historySquares'))
      : [emptyArray],
  )

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  React.useEffect(() => {
    if (squares.filter(Boolean).length === 0) {
      setHistory([emptyArray])
    } else if (squares.filter(Boolean).length === history.length) {
      const historyTmp = [...history, squares]
      setHistory(historyTmp)
    }
  }, [squares])

  React.useEffect(() => {
    window.localStorage.setItem('historySquares', JSON.stringify(history))
  }, [history])

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  const Button = ({text, isDisabled, onClick}) => (
    <button disabled={isDisabled} onClick={onClick}>
      {text}
    </button>
  )

  const onSelect = ({stepSquare, index}) => {
    const historyTmp = history.filter((stepSquare, ind) => ind <= index)
    setSquares(prev => stepSquare)
    setHistory(historyTmp)
  }

  const moves = history.map((stepSquare, index) => {
    const isCurrent = index === history.length - 1
    const currentText = isCurrent ? '(current)' : ''
    const text =
      index === 0
        ? `Go to game start ${currentText}`
        : `Go to move #${index} ${currentText}`
    return (
      <li key={index}>
        <Button
          text={text}
          isDisabled={isCurrent}
          onClick={() => onSelect({stepSquare, index})}
        />
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={squares => selectSquare(squares)} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
