socketRef.current = io.connect('https://mysquidcanvas.shop');

  socketRef.current.emit('joinRoom', { mySessionId, myUserName });  // Emit 'joinRoom' event

  useEffect(() => {
    
    socketRef.current.on('startDrawing', data => {  // Listen for 'startDrawing' events
      try {
        console.log('$$$$$client startDrawing: ', data);
        const { offsetX, offsetY, lineWidth, strokeColor, mySessionId } = data;
        contextRef.current.strokeStyle = strokeColor;  // Update stroke color
        contextRef.current.lineWidth = lineWidth;  // Update line width
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
      } catch(err) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',err);
      }
    });
  
    socketRef.current.on('drawing', data => {
      console.log('$$$$$client Drawing: ', data);
      const { offsetX, offsetY, mySessionId } = data;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    });
  
    socketRef.current.on('endDrawing', (data) => {
      console.log('$$$$client endDrawing: ', data);
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
