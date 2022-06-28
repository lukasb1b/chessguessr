import React from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { AiOutlineShareAlt } from "react-icons/ai";
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown";

const getSolvedPercentage = (puzzleStats) => {
  if (!puzzleStats?.solved || !puzzleStats?.faild) {
    return null;
  }

  return Math.round(
    (puzzleStats.solved / (puzzleStats.solved + puzzleStats.failed)) * 100
  );
};

const Correct = ({ game, gameUrlText, solvedPercentage }) => {
  return (
    <div className="relative p-6 flex-auto">
      <p className="my-4 text-slate-500 text-lg leading-relaxed">
        This game was played between {game.white} and {game.black}. Check out
        the game{" "}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={game.gameUrl}
          target="_blank"
        >
          {gameUrlText(game)}
        </a>
        .
      </p>
      {solvedPercentage && (
        <>
          <h1 className="my-4  text-lg leading-relaxed">
            {solvedPercentage}% got this one right.
          </h1>
          <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className="h-full bg-green-500 absolute"
              style={{ width: `${solvedPercentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

const Failed = ({ game, gameUrlText, solvedPercentage }) => {
  return (
    <div className="relative p-6 flex-auto">
      <p className="my-4 text-slate-500 text-lg leading-relaxed">
        You didn't find the 5 moves played in the game. This game was played
        between {game.white} and {game.black}. Check out the game (and the
        solution){" "}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={game.gameUrl}
          target="_blank"
        >
          {gameUrlText(game)}
        </a>
        .
      </p>
      {solvedPercentage && (
        <>
          <h1 className="my-4  text-lg leading-relaxed">Progress Bar</h1>
          <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className="h-full bg-green-500 absolute"
              style={{ width: "10%" }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Modal({
  correct,
  showModal,
  setShowModal,
  game,
  guesses,
  turn,
  playerStats,
  puzzleStats,
}) {
  const [value, copy] = useCopyToClipboard();

  const solvedPercentage = getSolvedPercentage(puzzleStats);

  const gameUrlText = (game) => {
    if (game.gameUrl.includes("lichess.org")) {
      return "on lichess";
    }

    return "here";
  };

  const getShareGameText = (
    guesses: any,
    game: any,
    turn: number,
    correct: boolean
  ) => {
    let text = `Chessguessr #${game.id} ${correct ? turn : "X"}/5\n\n`;

    guesses.forEach((guess) => {
      if (!guess[0]) return;

      guess.forEach((move) => {
        if (move && move.color) {
          if (move.color === "green") {
            text += "🟩";
          } else if (move.color === "yellow") {
            text += "🟨";
          } else if (move.color === "grey") {
            text += "⬜";
          }
        }
      });

      text += "\n";
    });

    text += "\nhttps://chessguessr.com";

    return text;
  };

  let tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);

  const nextDate =
    tomorrow.getFullYear().toString() +
    "-" +
    (tomorrow.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    tomorrow.getDate().toString();

  const renderer = ({ hours, minutes, seconds }) => (
    <span>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  const shareGameText = getShareGameText(guesses, game, turn, correct);

  const numWins =
    playerStats.guesses[1] +
    playerStats.guesses[2] +
    playerStats.guesses[3] +
    playerStats.guesses[4] +
    playerStats.guesses[5];

  const winPercentage = Math.round(
    (numWins / (numWins + playerStats.guesses["failed"])) * 100
  );

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Statistics</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                <div className="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-3">
                  <div
                    id="jh-stats-positive"
                    className="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded"
                  >
                    <div>
                      <p className="text-3xl font-semibold text-center text-gray-800">
                        {playerStats.gamesPlayed}
                      </p>
                      <p className="text-lg text-center text-gray-500">
                        Games played
                      </p>
                    </div>
                  </div>
                  <div
                    id="jh-stats-positive"
                    className="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded"
                  >
                    <div>
                      <p className="text-3xl font-semibold text-center text-gray-800">
                        {winPercentage}
                      </p>
                      <p className="text-lg text-center text-gray-500">Win %</p>
                    </div>
                  </div>
                  <div
                    id="jh-stats-positive"
                    className="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded"
                  >
                    <div>
                      <p className="text-3xl font-semibold text-center text-gray-800">
                        {playerStats.currentStreak}
                      </p>
                      <p className="text-lg text-center text-gray-500">
                        Current streak
                      </p>
                    </div>
                  </div>
                </div>
                {/*body*/}
                {correct ? (
                  <Correct
                    game={game}
                    gameUrlText={gameUrlText}
                    solvedPercentage={solvedPercentage}
                  />
                ) : (
                  <Failed
                    game={game}
                    gameUrlText={gameUrlText}
                    solvedPercentage={solvedPercentage}
                  />
                )}
                {/*footer*/}

                <div className="flex space-x-12 items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                  <div className="font-bold">
                    NEXT GUESSR IN{" "}
                    <Countdown
                      date={nextDate}
                      zeroPadTime={2}
                      renderer={renderer}
                    />{" "}
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => copy(shareGameText)}
                      className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {!value ? "SHARE SCORE" : "Copied to clipboard"}
                    </button>

                    <button
                      className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
