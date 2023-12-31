import React from 'react'
import { Canvas } from './Canvas'
import { ClearCanvasButton } from './ClearCanvasButton';
import { ColorPicker } from './painter_tool';
import { LineWidthButtons } from './painter_tool';

import './GameCanvas.css'

function GameCanvas() {
  return (
    <>
      <Canvas/>
      <div className='ButtonZone'>
        <div className='ClearButton'>
          <ClearCanvasButton/>
        </div>
        <div className='Tool'>
          <LineWidthButtons/>
          <ColorPicker/>
        </div>
      </div>
    </>
  );
}

export default GameCanvas;
