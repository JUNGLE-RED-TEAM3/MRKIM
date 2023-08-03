import React, { useContext, useRef, useState, useEffect } from "react";
import io from 'socket.io-client';

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children, mySessionId, myUserName }) => {
  console.log('mySessionId!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ', mySessionId, myUserName);
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socketRef = useRef(null);

  const [lineWidth, setLineWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState('black');

  //서버 연결부분
  socketRef.current = io.connect('https://mysquidcanvas.shop');

  socketRef.current.emit('joinRoom', { mySessionId, myUserName });  // Emit 'joinRoom' event
  
  useEffect(() => {
      
      socketRef.current.on('startDrawing', data => {  // Listen for 'startDrawing' events
        const { offsetX, offsetY, lineWidth, strokeColor, mySessionId } = data;
        contextRef.current.strokeStyle = strokeColor;  // Update stroke color
        contextRef.current.lineWidth = lineWidth;  // Update line width
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
    });
    
    socketRef.current.on('drawing', data => {
        const { offsetX, offsetY, mySessionId } = data;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    });
    
    socketRef.current.on('endDrawing', (data) => {
        const { mySessionId } = data;
        contextRef.current.closePath();
        setIsDrawing(false);
    });
    
    socketRef.current.on('clearCanvas', () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)
    });
}, []);

    useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    }, [lineWidth, strokeColor]);

const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth*0.7}px`;
    canvas.style.height = `${window.innerHeight*0.7}px`;
    canvas.style.boxShadow = "10px 10px 5px grey"; // 그림자 추가

    const context = canvas.getContext("2d")
    context.scale(1.42, 1.42);
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    if (socketRef.current) {
      socketRef.current.on('drawing', (data) => {
          console.log(data);
      });
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    const { clientX, clientY } = nativeEvent;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = (clientX - canvasRect.left) * 2;
    const offsetY = (clientY - canvasRect.top) * 2;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY, lineWidth, strokeColor);
    setIsDrawing(true);

    if (socketRef.current) {
      socketRef.current.emit('startDrawing', { offsetX, offsetY, lineWidth, strokeColor, mySessionId, myUserName });
    }
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

    if (socketRef.current) {
    socketRef.current.emit('endDrawing', {mySessionId, myUserName});
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
        return;
    }
    const { clientX, clientY } = nativeEvent;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = (clientX - canvasRect.left) * 2;
    const offsetY = (clientY - canvasRect.top) * 2;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    if (socketRef.current) {
      socketRef.current.emit('drawing', { offsetX, offsetY, mySessionId, myUserName});
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (socketRef.current) {
      socketRef.current.emit('clearCanvas');
    }
  }


  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        socketRef,
        lineWidth,
        strokeColor,
        setStrokeColor,
        setLineWidth,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
      }}
    >
      <div>
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </div>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
