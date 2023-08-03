import React, { useContext } from "react";
import "./WhiteCanvas.css";
import GameCanvas from './JUNHO/GameCanvas';
import { CanvasProvider } from "./JUNHO/CanvasContext";

// YEONGWOO: context 추가
import SessionContext from "../Openvidu/SessionContext";

function WhiteCanvas() {
    const { mySessionId, myUserName } = useContext(SessionContext);
    console.log('##################################mySessionId: ', mySessionId, myUserName);
    return(
        <div className="GameCanvas">
            <CanvasProvider mySessionId = { mySessionId } myUserName = {myUserName}>
                <GameCanvas />
            </CanvasProvider>
        </div>
    )
}
export default WhiteCanvas;