/*
 This work-in-progress script is an attempt to get this extension to work properly
 on websites such as https://dbknews.com, which uses some form of
 lazy loading that causes the whole webpage to become unresponsive
 when combined with the Chrome Extension. I think it might be a Wordpress thing,
 it's the 'data-lazy-src' attribute that seems to break it.

 This script runs at "document_start", unlike quote_replacer.js

 As of 8/24/2022, this script allows all the images on https://dbknews.com
 to load, but the links at the bottom of the page fail to load and
 the user cannot click on anything on the webpage.
*/

// From https://github.com/gslin/load-lazyload-images, with modifications

let clean = function(el){
    const imgs = el.querySelectorAll('img');
    console.log("imgsyeet: " + JSON.stringify(imgs))

    for (const img of imgs) {
        var url;

        img.setAttribute('data-no-lazy', "1")

        if (img.getAttribute('loading')) {
            img.removeAttribute('loading');
        }

        if (img.getAttribute('data-ll-status')) {
            img.removeAttribute('data-ll-status');
        }

        if (url = img.getAttribute('data-original')) {
            img.setAttribute('src', url);
        } else if (url = img.getAttribute('data-src')) {
            img.setAttribute('src', url);
        } else if (url = img.getAttribute('data-lazy-src')) {
            img.removeAttribute('data-lazy-src');
            img.setAttribute('src', url);
        } else if (url = img.getAttribute('file')) {
            img.setAttribute('src', url);
        }
    }
};

// For new elements
let ob = new window.MutationObserver(muts => {
    muts.forEach(mut => {
        if (mut.type !== "childList") {
            return;
        }
        clean(mut.target);
    });
});
ob.observe(document, {
    childList: true,
    subtree: true,
});

const imgs = document.getElementsByTagName('img');
for (const img of imgs) {
    clean(img);
}

