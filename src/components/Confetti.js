import React from 'react'
//Jquery
import $ from 'jquery'; 
//Confetti
import ReactCanvasConfetti from 'react-canvas-confetti';

export default function Confetti() {
    //Confetti
    $( "#boardConfetti" ).ready(function() {
        handlerClickStart(true)
    });
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const canvasStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }
    var isAnimationEnabled = false;
    var animationInstance = null;
    var intervalId = null;

    var getAnimationSettings = (originXA, originXB) => {
        return {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount: 150,
          origin: {
            x: randomInRange(originXA, originXB),
            y: Math.random() - 0.2
          }
        }
      }

    var nextTickAnimation=()=> {
        animationInstance && animationInstance(getAnimationSettings(0.1, 0.3));
        animationInstance && animationInstance(getAnimationSettings(0.7, 0.9));
    }

    var startAnimation=()=> {
        if (!isAnimationEnabled) {
          isAnimationEnabled = true;
          intervalId = setInterval(nextTickAnimation, 400);
          setTimeout(function( ) { clearInterval( intervalId ); }, 5000);
        }
      }
    
    var handlerClickStart=()=> {
        startAnimation();
      }

    var getInstance = (instance) => {
        animationInstance = instance
      }

    return (
        <ReactCanvasConfetti id="boardConfetti" refConfetti={getInstance} style={canvasStyles}/>
    )
}
