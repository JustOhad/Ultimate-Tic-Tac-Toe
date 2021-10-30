import React, {useState,useEffect,createRef} from 'react'
import './Game.css';
import Board from './Board';
import $ from 'jquery'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Confetti from './Confetti';

export default function Game() {

    var boards = [];
    var [currentBoard, setCurrentBoard] = useState(null);
    var [isXTurn, setIsXTurn] = useState(true);
    var [boardSize, setBoardSize] = useState(3);
    var [boardsRefArray, setBoardsRefArray] = useState([]);
    var [winner, setWinner] = useState(null);
    var [winnerMoves, setWinnerMoves] = useState(null);
    var [winnerName, setWinnerName] = useState("");
    var [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        // add or remove refs
        setBoardsRefArray(boardsRefArray => (
          Array(boardSize*boardSize).fill().map((_, i) => boardsRefArray[i] || createRef())
        ));
    }, [boardSize]);

    useEffect(() => {
        if(boardSize > 0)
        {
            clearBoards();
        }
    }, [boardsRefArray]);

    var changeWinnerName = (name) => {
        setWinnerName(name);
    };
    
    var changeSize = (size) => {
        setBoardSize(size);
    };
    
    var increaseBoardSize = () => {
        changeSize(boardSize + 1);
    };

    var decreaseBoardSize = () => {
        if(boardSize > 1)
        {
            changeSize(boardSize - 1);
        }
    };

    var getCurrentBoard = () => {
        return currentBoard;
    }

    var handleShowDialog = () => {
        setShowDialog(true);
    };

    var handleCloseDialog = () => {
        clearBoards();
        setShowDialog(false);
    };
    
    var clearBoards = () => {
        //Clear Boards Variables
        setIsXTurn(true);
        setWinnerMoves(0);
        setCurrentBoard(null);
        boardsRefArray.forEach(board => {
            board.current.cleanBoard();
        });
        //Clear XO Paints
        var canvases = $('.squareCanvas');
        for(var i = 0; i < canvases.length; i++)
        {
            var context = canvases[i].getContext('2d');
            context.clearRect(0, 0, canvases[i].width, canvases[i].height);
        }
        //Clear Finish Lines
        var backgroundCanvases = $('.backgroundCanvas')[0];
        for(var i = 0; i < backgroundCanvases.length; i++)
        {
            var context = backgroundCanvases[i].getContext('2d');
            context.clearRect(0, 0, backgroundCanvases[i].width, backgroundCanvases[i].height);
        }
        //Finish Lines Canvases 'display' to none
        var canvasDiv = $('.backgroundCanvasDiv');
        canvasDiv.css("display","none");
    }

    var handleTurn = (boardRowPosition,boardColPosition) => {
        //Every X Turn
        if(isXTurn == true)
        {
            setWinnerMoves(winnerMoves + 1);
        }
        //Change Turn
        setIsXTurn(!isXTurn);
        if(boardsRefArray[boardRowPosition * boardSize + boardColPosition].current.getBoardWinner() == null)
        {
            setCurrentBoard(boardRowPosition * boardSize + boardColPosition);
        }
        else {
            setCurrentBoard(null);
        }
    }

    var getIsXTurn = () => {
        return isXTurn;
    }

    var handleRegister = () => {
        //Get Leader Board Records
        var leaderBoardRecords = localStorage.getItem("LeaderBoardRecords");
        //If Storage Empty - First Time
        if(leaderBoardRecords == null)
        {
            leaderBoardRecords = [];
        }
        var winnerRecord = {id:leaderBoardRecords.length,
            name:winnerName,
            boardSize:boardSize,
            moves:winnerMoves};
        leaderBoardRecords.push(winnerRecord);
        //Update list in storage
        localStorage.setItem("LeaderBoardRecords", JSON.stringify(leaderBoardRecords));
        clearBoards();
        setShowDialog(false);
    };

    var setWinnerDeatils = () =>
    {
        if(!isXTurn)
        {
            setWinner("X");
        }
        else
        {
            setWinner("O");
        }
        setWinnerMoves(winnerMoves);
        handleShowDialog();
    }

    var checkStreak = (line) => {
        var firstValue = line[0];
        for (var i = 1; i < boardSize; i++)
        {
            if(line[i] != firstValue || line[i] == null)
            {
                //Incomplete line
                return null;
            }
        }
        //false for O and true for X
        return firstValue;
    }

    var getLTRCross = () => {
        var leftCross = [];
        for(var i = 0; i < boardSize; i++)
        {
            leftCross.push(boardsRefArray[i*boardSize + i].current.getBoardWinner());
        }
        return leftCross;
    }

    var getRTLCross = () => {
        var rightCross = [];
        for(var i = 0; i < boardSize; i++)
        {
            rightCross.push(boardsRefArray[i*boardSize + (boardSize-1-i)].current.getBoardWinner());
        }
        return rightCross;
    }

    var getColumn = (j) => {
        var column = [];
        for(var i = 0; i < boardSize; i++)
        {
            column.push(boardsRefArray[i*boardSize + j].current.getBoardWinner());
        } 
        return column;
    }

    var getRow = (i) => {
        var row = [];
        for(var j = 0; j < boardSize; j++)
        {
            row.push(boardsRefArray[i*boardSize + j].current.getBoardWinner());
        } 
        return row;
    }

    var checkGameBoard = () => {
        if(currentBoard !=null && boardsRefArray[currentBoard].current.getBoardWinner() != null)
        {
            setCurrentBoard(null);
        }
        for(var i = 0; i < boardSize; i++)
        {
            //Row Check
            var row = getRow(i);
            var streakResult = checkStreak(row);
            if(streakResult != null)
            {
                setWinnerDeatils();
                return streakResult;
            }
            //Column Check
            var column = getColumn(i);
            streakResult = checkStreak(column);
            if(streakResult != null)
            {
                setWinnerDeatils();
                return streakResult;
            }
        }
        //Left Cross Check
        var LTRCross = getLTRCross();
        streakResult = checkStreak(LTRCross);
        if(streakResult != null)
        {
            setWinnerDeatils();
            return streakResult;
        }
        //Right Cross Check
        var RTLCross = getRTLCross();
        streakResult = checkStreak(RTLCross);
        if(streakResult != null)
        {
            setWinnerDeatils();
            return streakResult;
        }
    }

    var initializeGameBoards = () => {
        //localStorage.clear();
        for (var i = 0; i < boardSize; i++) {
            var tempRow = []
            for (var j = 0; j < boardSize; j++) {
                tempRow.push(
                <div className="boards" key={(i*boardSize) + j + 1}>
                    <Board ref={boardsRefArray[(i*boardSize) + j]} 
                        getIsXTurnFunc={getIsXTurn} handleTurnFunc={handleTurn} checkGameBoardFunc={checkGameBoard} getCurrentBoardFunc={getCurrentBoard} 
                        data={{boardSize:boardSize,boardNumber:(i*boardSize) + j}}>
                    </Board>
                </div>);
            }
            boards.push(<div className="boardRow" key={(i*3) + 1}>{tempRow}</div>);
        }
    };
    initializeGameBoards(); 

    return (
        <div id="gameContainer">
            <h1 id="logo">Ultimate Tic Tac Toe</h1>
            {boards}
            <div id="gameFooter">
                <div id="currentTurnText">
                    {isXTurn ? "X Turn" : "O Turn"}
                </div>
                <div id="resize">
                    <div>
                        <Button id="clearButton" onClick={clearBoards} variant="danger">Clear</Button>
                    </div>
                    <div className="def-number-input number-input">
                        <button onClick={decreaseBoardSize} className="minus"></button>
                        <input type="number" onChange={(e) => changeSize(e.target.value)} value={boardSize}></input>
                        <button onClick={increaseBoardSize} className="plus"></button>
                    </div>
                </div>
            </div>
            <Modal show={showDialog} onHide={handleCloseDialog} id="congratzDialog" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Congratz!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>{String(winner)} Wins!</h3>
                    <h6>In {winnerMoves} moves</h6>
                    <input type="text" placeholder="Enter winner name..." onChange={(e) => changeWinnerName(e.target.value)} ></input>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDialog}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </Modal.Footer>
                <Confetti></Confetti>
            </Modal>
        </div>
    )
}
