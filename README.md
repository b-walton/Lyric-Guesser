Author: Benjamin Walton
Email: benjamin.t.walton@vanderbilt.edu


Project instructions:

Prereq's:
Node.js installed. 

To set up node packages:

Backend

   1. cd into backend
   2. run npm install

Frontend

    1. cd into lyric_guesser
    2. run npm install

Gameplay:

Start Backend
    1. cd into backend
    2. run npm start
Start Frontend
    1. cd into lyric_guesser
    2. run npm start
    3. visit http://localhost:3000/ if you are not automatically directed there

Have Fun!

Note:
Music Match only allows 2k calls per day with their free plan, so during gameplay search results may begin returning
empty no matter what. If that happens, I have provided 1 more API key that you can use. To replace the key, enter
the backend/server.js and find the API Key on line 12 and enter the key below in string format

Additional Key:

'cad6fbc4cb96b924400a057ea31201be'


Brief:

I really enjoyed this project and the opportunity to learn new languages and packages. I came in with no experience
with Javascript or HTML, so I spent a lot of my time researching and referencing documentation in order to meet the 
requirements. My project allows the player to filter songs by artist or by the decade of song release. The MusicMatch
API only allows 2k calls per day with their free plan, and setting up a filter for album would double the number of API
calls per game, so I replaced that functionality with the decade filter. I used a restAPI in node, with a frontend
in React to implement this project.
