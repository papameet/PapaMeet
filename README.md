# PapaMeet

A browser extension to stop worrying about boring Google meets!

With the extension you can:
* Join and leave meet automatically.
* Get notified when an alert word is being said. The default is *attendance*.

## Development/ Testing
To develop/test locally on any OS,
* Clone the project with `git clone https://github.com/papameet/PapaMeet`.
* Install latest stable versions of node and npm.
* Run `npm install`.
* Run `npm run build`.

This generates code in `./dist` which you can point to, to load the extension in browser.

To turn the code in `dist/` into a package, run [`web-ext build`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#packaging-your-extension) in `dist/`.
