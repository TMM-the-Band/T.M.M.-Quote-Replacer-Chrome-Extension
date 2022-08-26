# T.M.M. Chrome Extension
A Chrome Extension for replacing quotes on webpages with T.M.M. lyrics!

To use/test this, clone the repository, go to _chrome://extensions_ in Chrome, click "Load Unpacked", and then select the cloned repo's directory. Then Chrome should display it as an extension that you can toggle.

## Limitations:
It currently works with most webpages, but it is incompatible with WordPress websites such as [dbknews.com](https://dbknews.com/) and a variety of other webpages. Thus, the extension will ignore websites that contain certain strings in their source. A message will be printed to the console any time such a website is encountered.

Currently, there isn't a good way to determine if a website is compatible with this extension on-the-fly, so some sites you visit may break. Feel free to report such sites by opening a GitHub issue. Also, if you know of a way to make the extension either work with all websites or automatically ignore incompatible websites, feel free to submit a pull request!

## TODO:
- Fix problem preventing it from working with WordPress websites such as [dbknews.com](https://dbknews.com/) and other websites
- Add the rest of the T.M.M. lyrics
- Maybe add a simple UI to make it easier to toggle
