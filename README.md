# Oh no you didn't!

Chrome has a habit of crashing, often for no real reason. When running a Kiosk, or Digital Signage - the ability the quickly reload the page is essential. This plugin does exactly that.

This is not a replacement for correcting problems in the first place (memory leaks especially) and isn't particularly useful in an everyday environment, where you can simply press the refresh button yourself.

## Installation

1. Download and unzip package onto disk
2. Open Chrome extensions page ([`chrome://extensions`](chrome://extensions))
3. Enable developer mode
4. Select "Load unpacked", select the base folder ("ohnoyoudidnt"), and click 'ok'
5. Simulate a failure!

## How to test?

Copy this into the javascript console of any tab to crash it. (Causes an out of memory error)

```js
let memoryEater = "nom";
while (true) {
  memoryEater = memoryEater += "nom";
}
```

OR visit the following URL `chrome://crash`
