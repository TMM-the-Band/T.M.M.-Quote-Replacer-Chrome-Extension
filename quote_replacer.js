/* 
     Websites such as https://dbknews.com that were made with WordPress and use `wp-rocket` will break
     Might be able to get around this in the future by appending `?nowprocket` to their URLs, but
     the new Manifest v3 Chrome Extensions `declarativeNetRequest` makes that very difficult.

     Websites such as https://parade.com/937586/parade/life-quotes/ that use mysterious <phoenix-___> tags
     also tend to break.

     The following are substrings found in websites that this chrome extension breaks:
     (would be great to find a catch-all solution without having to hardcode the breaking ones in)
     */
const excludedStrings = [
    "wp-rocket",
    "wp-content",
    "wp-stat",
    "nytapp",
    "feeds.npr",
    "nodeassets.nbcnews.com",
    "CNNIcon",
    "defensenews",
    "cbsnewsapp",
    "cbssports",
    "guce.yahoo.com",
    "phoenix-",
    "media.wusa9.com",
    "/public/assets/INSIDER/",
    "assets.axios.com",
    "cnbcfm",
    "nj.com",
    "static.foxnews.com",
    "static.politico.com",
    "news.unl.edu",
    "myslice",
    "github.githubassets.com"
];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let tmm_lyrics = null;

const retrieveLyrics = async () => {
    const resp = await fetch(chrome.runtime.getURL("/lyrics.json"));
    const jsonData = await resp.json();
    console.log(jsonData);
    return jsonData;
};

// Returns a specified number of consecutive lyrics starting at a random point in a random song
async function getLyrics(numLines) {
    if (!tmm_lyrics) {
        tmm_lyrics = await retrieveLyrics();
    }

    let songIdx = getRandomInt(tmm_lyrics.songs.length);
    let songLength = tmm_lyrics.songs[songIdx].lyrics.length;
    // If the song doesn't contain enough lyrics, then return all its lyrics
    // and call the function again to get more lyrics
    if (songLength < numLines) {
        return tmm_lyrics.songs[songIdx].lyrics.concat(await getLyrics(numLines - songLength));
    }
    // Otherwise return a random subsequence of the lyrics
    else {
        return tmm_lyrics.songs[songIdx].lyrics.slice(getRandomInt(songLength - numLines));
    }
}

// Checks whether the given HTML contains one of the excluded strings
function checkIfCompatible(innerHTML) {
    for (let i = 0; i < excludedStrings.length; i++) {
        if (innerHTML.indexOf(excludedStrings[i]) > -1) {
            console.log("The T.M.M. Chrome Extension does not work on this webpage!\nThe page's source contains excluded string \"" + excludedStrings[i] + "\"");
            return false;
        }
    }
    return true;
}

async function replaceQuotes() {
    // Only proceed if the HTML doesn't contain one of the excluded strings
    if (checkIfCompatible(document.body.innerHTML)) {
        
        // Get text from every possible element that could contain text
        const all_text = document.querySelectorAll('h1, h2, h3, h4, h5, p, caption, li, em')

        // Regex for HTML tags
        const htmlReg = /<[^<]+>/gd;
        // Regex for quoted phrases
        const quoteReg = /(?:["“”][^<>"“”]*["“”]|^[^"“”]*$)/gd;

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
            // *** TODO: fix potential infinite loop... ***
            // infinte loop may be the culprite of many of the freezes you are experiencing
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
                lyrics = await getLyrics(quoteSliceIndices.length)

                // Replace any slice that begins with a quotation mark
                for (let j = 0; j < quoteSliceIndices.length; j++) {
                    // Add the T.M.M. lyric, but match the punctuation of the original quote unless the lyric is a question
                    let penultChar = ""
                    if (lyrics[j].charAt(lyrics[j].length - 1) === "?") {
                        penultChar = '?'
                    }
                    else if (".,?!".indexOf(slices[quoteSliceIndices[j]].charAt(slices[quoteSliceIndices[j]].length - 2)) > -1) {
                        penultChar = slices[quoteSliceIndices[j]].charAt(slices[quoteSliceIndices[j]].length - 2);
                    }
                    // Handle the fancy quotes that some news sites use
                    let rightQuote = (slices[quoteSliceIndices[j]].charAt(0) === "\"" ? "\"" : "\“");
                    let leftQuote = (slices[quoteSliceIndices[j]].charAt(0) === "\"" ? "\"" : "\”");

                    slices[quoteSliceIndices[j]] = `${rightQuote}${lyrics[j]}${penultChar}${leftQuote}`;
                }

                // Reassemble the string
                if (all_text[i].innerHTML !== slices.join("")) {
                    console.log("Original: " + all_text[i].innerHTML + "\nNew (with T.M.M. lyrics): " + slices.join(""));
                    all_text[i].innerHTML = slices.join("");
                }
            }
        }
    }
}

replaceQuotes()