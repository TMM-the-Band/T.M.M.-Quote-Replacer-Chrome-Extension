# T.M.M. Chrome Extension
A Chrome Extension for replacing quotes on webpages with T.M.M. lyrics!

To use/test this, clone the repository, go to _chrome://extensions_ in Chrome, click "Load Unpacked", and then select the cloned repo's directory. Then Chrome should display it as an extension that you can toggle.

## Limitations:
It currently works with most webpages, but it is incompatible with WordPress websites such as [dbknews.com](https://dbknews.com/) and webpages such as [parade.com/937586/parade/life-quotes/](https://parade.com/937586/parade/life-quotes/) that use HTML tags that include `phoenix-`. Thus, the extension will ignore websites that contain the following strings in their HTML source:
- `wp-rocket`
- `wp-content`
- `phoenix-`

## TODO:
- Fix problem preventing it from working with WordPress websites such as [dbknews.com](https://dbknews.com/)
- Add the rest of the T.M.M. lyrics
- Maybe add a simple UI to make it easier to toggle
