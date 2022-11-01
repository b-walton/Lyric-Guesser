import './App.css';
import axios from 'axios'
import React, {useState} from 'react';
import BaseGame from './components/BaseGame'


function App() {
    const [beginFlag, setBeginFlag] = useState(false)
    const [badSearch, setBadSearch] = useState("")
    const [songInfo, setSongInfo] = useState({songList: [], lyricList: []});
    const [artist, setArtist] = useState("");
    const [decade, setDecade] = useState("")

    //get the search results from the backend
    async function getSongs() {
        const response = await axios.get("http://localhost:5000/songs")
        let tmp = {
            songList: response.data.songList,
            lyricList: response.data.lyricList
        }
        //set song info to search results
        setSongInfo(tmp);
        if (response.data.songList.length >= 1) {
            setBeginFlag(true);
            setBadSearch("");
        }else {
            setBadSearch("Search Failed, please try different settings");
        }
    }
    //give the search preferences to the backend
    async function giveInfo() {
        await axios.post("http://localhost:5000/settings", {
                artist: artist,
                decade: decade
            }
        )
    }
    if (beginFlag) {
        return (
            <BaseGame songInfo={songInfo}/> /*Call the game component, pass along song and artsit Info*/
        )
    } else {
        return (
            <div>
                <h1>Welcome To Lyrics Guesser!!!</h1>
                <h2>Press Begin When You are Ready to Play</h2>
                <p>Enter Settings for Song Generation, Leave a field blank to randomize</p>
                <h4>
                    <input type="text" placeholder="Enter Artist" onChange={(e) => {
                        setArtist(e.target.value.trim()) /*Store specified Artist*/
                    }}/>
                </h4>
                <input type="text" placeholder="Enter Decade (i.e 1980)"
                       onChange={(e) => {
                           setDecade(e.target.value.trim()) /*Store specified decade*/
                       }}/>
                (songs will be from 10 years after entered year (inclusive))
                <h5>

                    <button onClick={async () => { /*Give info to the backend*/
                                await giveInfo();
                    }}>Set Search Settings
                    </button>
                    {badSearch}
                </h5>
                <p>
                    <button onClick={async () => {
                        await getSongs();
                    }}>Begin
                    </button>
                </p>
            </div>
        )
    }
}



export default App;
