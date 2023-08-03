import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
    socketRef,  // NOTE: socket.io code
    lineWidth,  
    setLineWidth,  
    strokeColor,  
    setStrokeColor,  
    // drawCircle,    //JUNHO: 일단 도형 그리는 코드는 복잡성 증가때문에 보류
    // drawSquare,
    // drawTriangle,
  } = useCanvas();

  // 선굵기와 선색상을 캔버스에 적용하는 코드
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
  }, [lineWidth, strokeColor]);


  // 소켓으로 데이터를 받아서 캔버스에 그리는 코드
  useEffect(() => {
    prepareCanvas();

    if (socketRef.current) {
      socketRef.current.on('drawing', (data) => {
          console.log(data);
          // const { offsetX, offsetY, mySessionId } = data;
          // const context = canvasRef.current.getContext("2d");
          // context.lineTo(offsetX, offsetY);
          // context.stroke();
      });
    }
  }, [socketRef]);  // NOTE: socketRef를 dependency로 추가


  return (
    <div>
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
    </div>
  );
}