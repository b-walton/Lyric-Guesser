const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const Musixmatch = require('musixmatch-node') //import music match api
const mxm = new Musixmatch('672e476617b268e236458adc8c5006a5') //API KEY
const Filter = require('bad-words')
const filter = new Filter();

let artist = "" //declare variables to store data from front-end
let decade = ""
//receive search settings from frontend
app.post('/settings', (req,res) =>{
    artist = req.body.artist;
    decade = req.body.decade;
})


app.get("/songs", async (req,res) => {
    // let artist = "Taylor Swift";
    let language = 'en'
    const songsDesired =  10;
    // search criteria if year is not specified
    let songs;
    if (decade.length === 0)
    {
        songs = await (mxm.searchTrack({
            q_artist: artist, //specify artist
            f_lyrics_language: language, //specify english
            f_has_lyrics: 1, //ensure musicMatch has lyrics for song
            s_track_rating: 'desc', //sort in descending popularity
            page: 1, //get first 100 results (if possible)
            page_size: 100
        }))
    }else{
        //If decade is specified

        //get the string corresponding to the date 10 years after input
        const decadeMax = parseInt(Number(decade) + 10)

        //search for songs
        songs = await (mxm.searchTrack({
            q_artist: artist, //specify artist
            f_lyrics_language: language, //specify english
            f_has_lyrics: 1, //ensure musicMatch has lyrics for song
            f_track_release_group_first_release_date_min: decade + "0101",
            f_track_release_group_first_release_date_max: decadeMax + "0101",
            s_track_rating: 'desc', //sort in descending popularity
            page: 1, //get first 100 results (if possible)
            page_size: 100
        }))
    }

    //get number of results, we will take most popular 100 songs or all songs if less than 100 match criteria
    const numResults = Math.min(100, songs.message.header.available);

    //key-value pair for track-id and songName, ensures we won't duplicate songs and allows lyricSearch later
    let finalSongs = {};

    //loop to ensure we get 10 songs if possible and no duplicate songs
    while (Object.keys(finalSongs).length < songsDesired && Object.keys(finalSongs).length  < numResults) {
        let indx = Math.floor(Math.random() * numResults); //randomizes song choice
        //maps track id to song name for random song from top 100 rated tracks from results
        finalSongs[songs.message.body.track_list[indx].track.track_id] =
            songs.message.body.track_list[indx].track.track_name;
    }

    //create array for song lyrics
    let lyrics = []

    //loop through dictionary of songs to get their lyrics
    for (const [key, value] of Object.entries(finalSongs)) {

        //call musicMatch api to get lyrics
        let lyric = await (mxm.getTrackLyrics(key));
        //get string of lyrics
        lyric = lyric.message.body.lyrics.lyrics_body;

        //split lyrics into each line
        let tmpLyricArray = lyric.split("\n");

        //loop through the array and combine two lines for the given lyric
        let lyricArray = []

        //loop through the split array to combine elem 0,1 , 2,3  , 4,5  ,etc to get longer lyrics
        for (let i = 0; i < tmpLyricArray.length - 2; i += 2){
            lyricArray[i/2] = tmpLyricArray[i] + "\\" + tmpLyricArray[i+1]
        }
        //now I have lyrics in an array, I will sort them so that only longer lines are given as prompts
        lyricArray = lyricArray.sort(function(a,b){return b.length-a.length});

        let specificLyric = "";
        //pick a random lyric out of the longest 3 in the song if possible
        do {
            let lyricInd = Math.floor(Math.random() * Math.min(lyricArray.length, 3))
            specificLyric = lyricArray[lyricInd];
        } while(specificLyric.includes("This Lyrics is NOT for Commercial use")) //ensure we don't get copyright notice

        lyrics.push(filter.clean(specificLyric)); //add lyric to the array
    }
    //convert values from dictionary into a list of song names
    let songNames = Object.values(finalSongs);

    //end the song name once we see parentheses or ' - ' to make guessing easier
    for (let i = 0; i < songNames.length; ++i) {
        if (songNames[i].includes('(')) {
            songNames[i] = songNames[i].split(' (')[0]; //take songName before parentheses start
        }
        if (songNames[i].includes(' - ')) {
            songNames[i] = songNames[i].split(' - ')[0]; //take songName before -
        }
    }
    //send data to local host for frontend to receive
    res.send({
        songList: songNames,
        lyricList: lyrics})
})

app.listen(PORT, () => {console.log(`Server Running on port http://localhost:${PORT}`)});