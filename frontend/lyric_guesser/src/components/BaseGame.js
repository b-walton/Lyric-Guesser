import React, {useState} from 'react';
import Stats from './Stats';


function BaseGame(props) {

    const [questionNum, setQuestionNum] = useState(0);
    const [numCorrect, setNumCorrect] = useState(0);
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [prevSong, setPrevSong] = useState(""); //allows printing previous correct answer
    const [seeStats, setSeeStats] = useState(false)

    //if the player clicks to see stats
    if (seeStats) {
        let stats = {numSongs: questionNum, numCorrect: numCorrect}
        return (
            <Stats stats={stats}/> // pass along the stats from game state to
        )
        //if we just received answer to final question
    }else if (questionNum >= props.songInfo.songList.length){
        return (
            <div>
                <p>{message}</p>
                <i>{prevSong}</i>
                <p>
                    <button
                        onClick = {() => {
                            setSeeStats(true);
                        }}>End Round!
                    </button>
                </p>
            </div>
        )
    }
    //standard game loop
     else {
        return (
            <div>
                <p>What song is this lyric from?: </p>
                <p>"{props.songInfo.lyricList[questionNum]}"</p>
                <input type="text" onChange={(e) => {
                    setAnswer(e.target.value)
                }}/>

                <button onClick={() => {
                    //check if the answer is correct, ignore leading spaces and caps
                    if (answer.toLowerCase().trim() === props.songInfo.songList[questionNum].toLowerCase()) {
                        setNumCorrect(numCorrect + 1)
                        setMessage("Correct!!")
                        setPrevSong("")
                    } else {
                        setMessage(`Incorrect :( That was from:`);
                        setPrevSong(props.songInfo.songList[questionNum]);
                    }
                    setQuestionNum(questionNum + 1)
                    setAnswer("")
                }}>Guess
                </button>
                <p>{message}</p>
                <i>{prevSong}</i>
                <p>Your answer: {answer}</p>
                <button
                    onClick = {() => {
                        setSeeStats(true);
                    }}>End Round!
                </button>
            </div>
        )
    }
}

export default BaseGame;