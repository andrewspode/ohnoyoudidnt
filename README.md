# Oh no you didn't!

Chrome has a habit of crashing, often for no real reason. When running a Kiosk, or Digital Signage - the ability the quickly reload the page is essential. This plugin does exactly that.

This is not a replacement for correcting problems in the first place (memory leaks especially) and isn't particularly useful in an everyday environment, where you can simply press the refresh button yourself.

## Installation (Manual)

1. Download and unzip package onto disk
2. **Optional:** Run `$ yarn install` for improved editor support
3. Open Chrome extensions page ([`chrome://extensions`](chrome://extensions))
4. Enable developer mode
5. Select "Load unpacked", select the base folder ("ohnoyoudidnt"), and click 'ok'
6. Simulate a failure!

## Installation (Packaged)

Install the package from the [Chrome Store](https://chrome.google.com/webstore/detail/oh-no-you-didnt/acdablfhjbhkjbcifldncdkmlophfgda?hl=en).

## How to test?

Copy this into the javascript console of any tab to crash it. (Causes an out of memory error)

```js
let memoryEater = "nom";
while (true) {
  memoryEater = memoryEater += "nom";
}
```

OR visit the following URL [`chrome://crash`](chrome://crash)
