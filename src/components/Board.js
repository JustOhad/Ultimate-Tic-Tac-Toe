import React, {useState,useEffect,useImperativeHandle} from 'react';
import './Board.css';
import Square from './Square';
import $ from 'jquery'; 


const Board = React.forwardRef(({getIsXTurnFunc, handleTurnFunc, checkGameBoardFunc, getCurrentBoardFunc,data}, ref) =>  {
    var board = [];
    var emptyBoardMarks = [];
    var [boardMarks, setBoardMarks] = useState(emptyBoardMarks);
    var [winner, setWinner] = useState(null);

    useEffect(() => {
        if(winner != null)
        {
            checkGameBoardFunc();
        }
     }, [winner]);

    //Set board with nulls
    for (var i = 0; i < data.boardSize; i++) {
        var row = [];
        //EmptyColumns
        for (var j = 0; j < data.boardSize; j++) {
            row.push(null);
        }
        emptyBoardMarks.push(row);
    }

    var setMarkOnBoard = (row,column,mark) => {
        var newArr = [...boardMarks];
        newArr[row][column] = mark;
        setBoardMarks(newArr);
    }

    var getMarkOnBoard = (row,column) => {
        return boardMarks[row][column];
    }
    
    var checkStreak = (line) => {
        var firstValue = line[0];
        for (var i = 1; i < data.boardSize; i++)
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
        for(var i = 0; i < data.boardSize; i++)
        {
            leftCross.push(boardMarks[i][i]);
        }
        return leftCross;
    }

    var getRTLCross = () => {
        var rightCross = [];
        for(var i = 0; i < data.boardSize; i++)
        {
            rightCross.push(boardMarks[i][data.boardSize - 1 - i]);
        }
        return rightCross;
    }

    var getColumn = (j) => {
        var column = [];
        for(var i = 0; i < data.boardSize; i++)
        {
            column.push(boardMarks[i][j]);
        } 
        return column;
    }

    var getRow = (i) => {
        var row = [];
        for(var j = 0; j < data.boardSize; j++)
        {
            row.push(boardMarks[i][j]);
        } 
        return row;
    }

    var checkBoard = () => {
        for(var i = 0; i < data.boardSize; i++)
        {
            //Row Check
            var row = getRow(i);
            var streakResult = checkStreak(row);
            if(streakResult != null)
            {
                console.log(streakResult);
                drawFinishLine("row",i);
                setWinner(streakResult);
                return streakResult;
            }
            //Column Check
            var column = getColumn(i);
            streakResult = checkStreak(column);
            if(streakResult != null)
            {
                console.log(streakResult);
                drawFinishLine("column",i);
                setWinner(streakResult);
                checkGameBoardFunc();
                return streakResult;
            }
        }
        //Left Cross Check
        var LTRCross = getLTRCross();
        streakResult = checkStreak(LTRCross);
        if(streakResult != null)
        {
            console.log(streakResult);
            drawFinishLine("LTRCross",0);
            setWinner(streakResult);
            checkGameBoardFunc();
            return streakResult;
        }
        //Right Cross Check
        var RTLCross = getRTLCross();
        streakResult = checkStreak(RTLCross);
        if(streakResult != null)
        {
            console.log(streakResult);
            drawFinishLine("RTLCross",0);
            setWinner(streakResult);
            checkGameBoardFunc();
            return streakResult;
        }
    }
    
    var drawFinishLine = (type,index) => {
        (function() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();

        var canvasDiv = $('#backgroundCanvasDiv' + data.boardNumber);
        canvasDiv.css("display","flex");
        var canvas = $('#backgroundCanvas' + data.boardNumber)[0];
        var context = canvas.getContext('2d');

        context.lineWidth = 5;
        context.strokeStyle = '#eb144c';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 10;

        // define the path to plot
        var vertices = [];
        if(type == "LTRCross"){
            vertices = [{x:0,y:0},{x:canvas.width,y:canvas.height}];
        }
        else if(type == "RTLCross"){
            vertices = [{x:0,y:canvas.height},{x:canvas.width,y:0}];
        }
        else if(type == "row")
        {
            vertices = [{x:0,y:(canvas.height / data.boardSize * index) + (canvas.height / data.boardSize / 2)},
                        {x:canvas.width,y:(canvas.height / data.boardSize * index) + (canvas.height / data.boardSize / 2)}];
        }
        else if(type == "column")
        {
            vertices = [{x:(canvas.width / data.boardSize * index) + (canvas.width / data.boardSize / 2),y:0},
                        {x:(canvas.width / data.boardSize * index) + (canvas.width / data.boardSize / 2),y:canvas.height}];
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Calc waypoints traveling along vertices
        var calcWaypoints = (vertices) => {
            var waypoints = [];
            for (var i = 1; i < vertices.length; i++) {
                if(i%2==1)
                {
                    var pt0 = vertices[i - 1];
                    var pt1 = vertices[i];
                    var dx = pt1.x - pt0.x;
                    var dy = pt1.y - pt0.y;
                    for (var j = 0; j < 30; j++) {
                        var x = pt0.x + dx * j / 30;
                        var y = pt0.y + dy * j / 30;
                        waypoints.push({
                            x: x,
                            y: y
                        });
                    }
                }
            }
            return (waypoints);
        }
        var animate = () => {
            if (t < points.length - 1) {
                requestAnimationFrame(animate);
            }
            // draw a line segment from the last waypoint
            // to the current waypoint
            context.beginPath();
            context.moveTo(points[t - 1].x, points[t - 1].y);
            context.lineTo(points[t].x, points[t].y);
            context.stroke();
            context.closePath();

            // increment "t" to get the next waypoint
            t++;
        }

        //Animation
        // variable to hold how many frames have elapsed in the animation
        var t = 1;
        //Points For Animation
        var points = calcWaypoints(vertices);
        animate(points);
    }

    useImperativeHandle(ref, ()=>({
        cleanBoard: () => {
            setBoardMarks(emptyBoardMarks);
            setWinner(null);
                                  },
        getBoardWinner: () => {
            return winner;
        }
    }));


    var initializeGameBoard = () => {
        for (var i = 0; i < data.boardSize; i++) {
            var tempRow = [];
            for (var j = 0; j < data.boardSize; j++) {
                tempRow.push(<Square key={(i*data.boardSize) + j} getIsXTurnFunc={getIsXTurnFunc} handleTurnFunc={handleTurnFunc} checkBoardFunc={checkBoard} setMarkOnBoardFunc={setMarkOnBoard} getMarkOnBoardFunc={getMarkOnBoard} getCurrentBoardFunc={getCurrentBoardFunc} data={{boardNumber:data.boardNumber,row:i,column:j}}></Square>);
            }
            board.push(<div className="boardRow" key={(i*data.boardSize)}>{tempRow}</div>);
        }
    };
    initializeGameBoard(); 
    
    return (
        <div className={"board " + ((getCurrentBoardFunc() == data.boardNumber) || (getCurrentBoardFunc() == null) ? 'currentBoard ' : ' ') + (winner != null ? 'boardOver' : '')}>
            <div id={"boardLayers" + data.boardNumber} className="boardLayers">
                <div id={"backgroundCanvasDiv" + data.boardNumber} className="backgroundCanvasDiv">
                    <canvas id={"backgroundCanvas" + data.boardNumber} className="backgroundCanvas">
                    </canvas>
                </div>
                <div id="board">
                    {board}
                </div>
            </div>
        </div>
    )
});

export default Board
