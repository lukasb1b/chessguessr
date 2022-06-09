import React, { useState, useEffect } from "react";
import useChessguessr from "../hooks/useChessguessr";
import { Chessboard } from "react-chessboard";
import Chessground from "@react-chess/chessground";
import { Grid } from "./Grid";
import styled from "styled-components";

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5rem;
  margin-bottom: 5rem;
`;

const Buttons = styled.div`
  display: flex;
`;

export const Chessguessr = ({ data }: any) => {
  const {
    currentGuess,
    onDrop,
    position,
    takeback,
    submitGuess,
    guesses,
    correct,
    turn,
  } = useChessguessr(data);

  useEffect(() => {
    console.log(guesses, turn, correct);
  }, [guesses, turn, correct]);

  return (
    <div>
      current move - {currentGuess}
      <button onClick={takeback}>takeback</button>
      <button onClick={submitGuess}>Submit</button>
      <ChessboardWrapper>
        {position && (
          <Chessboard
            arePiecesDraggable={turn < 5 && !correct}
            position={position.fen()}
            onPieceDrop={onDrop}
          />
        )}
      </ChessboardWrapper>
      <Buttons>
        <button className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Save changes
        </button>
      </Buttons>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
    </div>
  );
};
