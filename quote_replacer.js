// T.M.M. lyrics are stored for now in this file because
// I cannot get the Chrome extension to read a JSON file properly...
// feel free to fix this in a pull request if you know how to do it!
var tmm_lyrics = {
    "songs": [
        {
            "title": "Work Song",
            "lyrics": [
                "I've been working all day",
                "I've been doing work with my friends",
                "All the day",
                "Well I woke up this morning and I fixed me some breakfast",
                "And I poured myself some milk",
                "I took my dog outside for a walk",
                "And I went to shoot an elk",
                "Well I was down in the field and I was doing some tilling",
                "And I found myself a rock",
                "I took that rock and I threw it at my chickens",
                "But I missed and hit my cock",
                "Well autumn is coming and the leaves are falling",
                "So I got myself a rake",
                "Well I've been raking all day long",
                "So I think I'll take a break",
                "I've been sleeping all day",
                "I've been sleeping with my dog"
            ]
        },
        {
            "title": "Underneath the Moon",
            "lyrics": [
                "I met you for the first time in class",
                "And I knew I could make you laugh",
                "I watched your eyes turn away from me",
                "And that's when I could finally see",
                "'Cause when you see me",
                "Underneath the moon",
                "You think of all the things that we could be",
                "And when I see you",
                "Standing in the sun",
                "I wish that we were more than you and me",
                "We were out, staring at the stars",
                "Playing music, strumming our guitars",
                "There was something we both could not dismiss",
                "This night would not be through without a kiss",
                "You're the only one, the one for me",
                "I promise you that I will never leave",
                "I always love to have you by my side",
                "Just you and me, on this endless ride",
                "You and me"
            ]
        },
        {
            "title": "The Asshole Card",
            "lyrics": [
                "I'm just sitting in the yard",
                "Throwing beer cans at my neighbor's car",
                "And I went down to the store",
                "So that I could buy some more",
                "I'm just sitting in the grass",
                "Throwing quarters in my neighbor's ass",
                "Could've spent them on a case of beer",
                "But instead I'm sitting right here",
                "Now me and my neighbor don't get along",
                "And that's why I'm singing this song",
                "His dog took a crap in my backyard",
                "Now I'm pulling out the asshole card",
                "I'm just sitting in my chair",
                "Looking at the birds up in the air",
                "I took a shot with my BB gun",
                "But I missed and hit my neighbor's son",
                "I'm just sitting on my porch",
                "Looking at my neighbor's brand-new Porche",
                "It was bright and yellow like a duck",
                "Too bad I rammed into it with my truck",
                "I'm just sitting by the pool",
                "My neighbor's out back acting like a fool",
                "Screaming babbling like a chimpanzee",
                "Surprised his wife ain't left him yet for me",
                "The moving crew is working pretty hard",
                "My neighbor said he's headed on his way",
                "So I threw one final can to end the day"
            ]
        }
    ]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Returns a specified number of consecutive lyrics starting at a random point in a random song
function getLyrics(numLines) {
    let songIdx = getRandomInt(tmm_lyrics.songs.length);
    let songLength = tmm_lyrics.songs[songIdx].lyrics.length;
    // If the song doesn't contain enough lyrics, then return all its lyrics
    // and call the function again to get more lyrics
    if (songLength < numLines) {
        return tmm_lyrics.songs[songIdx].concat(getLyrics(numLines - songLength));
    }
    // Otherwise return a random subsequence of the lyrics
    else {
        return tmm_lyrics.songs[songIdx].lyrics.slice(getRandomInt(songLength - numLines));
    }
}


// Get text from every possible element that could contain text
const all_text = document.querySelectorAll('h1, h2, h3, h4, h5, p, caption')

// Regex for HTML tags
const htmlReg = /<[^<]+>/gd;
// Regex for quoted phrases
const quoteReg = /(?:["“”][^"“”]*["“”]|^[^"“”]*$)/gd;

for (let i = 0; i < all_text.length; i++) {
    // Array of indices to avoid
    let tagIndices = [];
    // Flattened array of indices of where quotes begin and end
    let quoteIndices = [0];

    // Find all the start and end indices of HTML tags
    while ((tagResult = htmlReg.exec(all_text[i].innerHTML)) !== null) {
        tagIndices = tagIndices.concat(tagResult.indices);
    }

    // Find all the start and end indices of the quotes that aren't inside HTML tags
    while ((quoteResult = quoteReg.exec(all_text[i].innerHTML)) !== null) {
        // First determine if the quoted string is in an HTML tag
        let inTag = false;
        for (let j = 0; j < tagIndices.length; j++) {
            if (tagIndices[j][0] < quoteResult.indices[0][0] && tagIndices[j][1] > quoteResult.indices[0][1]) {
                inTag = true;
                break;
            }
        }

        // Record its indicies if it isn't part of an HTML tag
        if (!inTag) {
            quoteIndices = quoteIndices.concat(quoteResult.indices).flat();
        }
    }

    // Pad the array (if necessary) with first and/or last string index
    // to ensure that the entire string will be sliced
    if (quoteIndices[0] != 0) {
        quoteIndices = [0].concat(quoteIndices);
    }
    if (quoteIndices[-1] != all_text[i].innerHTML.length - 1) {
        quoteIndices = quoteIndices.concat([all_text[i].innerHTML.length]);
    }


    // If there are quotes, replace the quoted phrases with T.M.M. lyrics
    if (quoteIndices.length > 0) {

        // Slice up the string to separate the quoted sections from the non-quoted sections
        let slices = []
        //let slices = [all_text[i].innerHTML.slice(0, quoteIndices[0])]
        for (let j = 0; j < quoteIndices.length - 1; j++) {
            slices = slices.concat(all_text[i].innerHTML.slice(quoteIndices[j], quoteIndices[j + 1]));
        }

        // Keep track of the slice indices that we'll need to replace
        let quoteSliceIndices = []
        for (let j = 0; j < slices.length; j++) {
            if (slices[j].charAt(0) === "\"" || slices[j].charAt(0) === "\“") {
                quoteSliceIndices = quoteSliceIndices.concat(j);
            }
        }

        // Get the appropriate number of lyrics to replace the quotes with
        lyrics = getLyrics(quoteSliceIndices.length)

        // Replace any slice that begins with a quotation mark
        for (let j = 0; j < quoteSliceIndices.length; j++) {
            // Add the T.M.M. lyric, but match the punctuation of the original quote
            let penultChar = ""
            if (".,?!".indexOf(slices[quoteSliceIndices[j]].charAt(slices[quoteSliceIndices[j]].length - 2)) > -1) {
                penultChar = slices[quoteSliceIndices[j]].charAt(slices[quoteSliceIndices[j]].length - 2);
            }
            // Handle the fancy quotes that some news sites use
            let rightQuote = (slices[quoteSliceIndices[j]].charAt(0) === "\"" ? "\"" : "\“");
            let leftQuote = (slices[quoteSliceIndices[j]].charAt(0) === "\"" ? "\"" : "\”");

            slices[quoteSliceIndices[j]] = `${rightQuote}${lyrics[j]}${penultChar}${leftQuote}`;
        }

        // Reassemble the string
        all_text[i].innerHTML = slices.join("");
    }
}