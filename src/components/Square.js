import React from 'react';
import './Square.css';

export default function Square({getIsXTurnFunc, handleTurnFunc,checkBoardFunc,setMarkOnBoardFunc,getMarkOnBoardFunc, getCurrentBoardFunc,data}) {
    var drawShape = (e) => {
        if(getMarkOnBoardFunc(data.row,data.column) != null || (getCurrentBoardFunc() != null && getCurrentBoardFunc() != data.boardNumber))
        {
            return;
        }
        if(getIsXTurnFunc()){
            handleTurnFunc(data.row,data.column);
            setMarkOnBoardFunc(data.row,data.column,true);
            drawX(e);
        }
        else{
            handleTurnFunc(data.row,data.column);
            setMarkOnBoardFunc(data.row,data.column,false);
            drawO(e);
        }
        checkBoardFunc();
    }
    var drawX = (e) => {
        (function() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();

        var canvas = e.target;
        var context = canvas.getContext('2d');
        var x = canvas.width / 2;
        var y = canvas.height / 2;

        context.lineWidth = 5;
        context.strokeStyle = '#eb144c';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 10;

        // define the path to plot
        //LeftToRight Cross
        var vertices = [];
        vertices.push({
            x: x-50,
            y: y-50
        });
        vertices.push({
            x: x+50,
            y: y+50
        });
        //RightToLeft Cross
        var vertices2 = [];
        vertices2.push({
            x: x+50,
            y: y-50
        });
        vertices2.push({
            x: x-50,
            y: y+50
        });

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // calc waypoints traveling along vertices
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
        var animate2 = () => {
            if (z < points2.length - 1) {
                requestAnimationFrame(animate2);
            }
            // draw a line segment from the last waypoint
            // to the current waypoint
            context.beginPath();
            context.moveTo(points2[z - 1].x, points2[z - 1].y);
            context.lineTo(points2[z].x, points2[z].y);
            context.stroke();
            context.closePath();

            // increment "t" to get the next waypoint
            z++;
        }
      
        //Animation
        // variable to hold how many frames have elapsed in the animation
        var t = 1;
        var z = 1;
        //Points For Animation
        var points = calcWaypoints(vertices);
        animate(points);
        //Points For Animation
        var points2 = calcWaypoints(vertices2);
        animate2(points2);
    }
    var drawO = (e) => {
        (function() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();
     
        var canvas = e.target;
        var context = canvas.getContext('2d');
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var radius = 50;
        var endPercent = 31;
        var curPerc = 0;
        var counterClockwise = false;
        var circ = Math.PI * 2;
        var quart = Math.PI / 2;
     
        context.lineWidth = 5;
        context.strokeStyle = '#eb144c';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 10;
     
       var animate = (current) => {
           context.clearRect(0, 0, canvas.width, canvas.height);
           context.beginPath();
           context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
           context.stroke();
           curPerc++;
           if (curPerc < endPercent) {
               requestAnimationFrame(function () {
                   animate(curPerc / 30)
               });
           }
       }
       animate();
    };

    return (
        <div className="square">
            <canvas className="squareCanvas" onClick={((e) => drawShape(e))}></canvas>
        </div>
    )
}
