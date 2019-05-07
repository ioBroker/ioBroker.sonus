<h1>
    <img src="admin/sonus.png" width="64"/>
    ioBroker.sonus
</h1>

[![NPM version](http://img.shields.io/npm/v/iobroker.sonus.svg)](https://www.npmjs.com/package/iobroker.sonus)
[![Downloads](https://img.shields.io/npm/dm/iobroker.sonus.svg)](https://www.npmjs.com/package/iobroker.sonus)
[![Dependency Status](https://img.shields.io/david/GermanBluefox/iobroker.sonus.svg)](https://david-dm.org/GermanBluefox/iobroker.sonus)
[![Known Vulnerabilities](https://snyk.io/test/github/GermanBluefox/ioBroker.sonus/badge.svg)](https://snyk.io/test/github/GermanBluefox/ioBroker.sonus)

[![NPM](https://nodei.co/npm/iobroker.sonus.png?downloads=true)](https://nodei.co/npm/iobroker.sonus/)

**Tests:** Linux/Mac: [![Travis-CI](http://img.shields.io/travis/GermanBluefox/ioBroker.sonus/master.svg)](https://travis-ci.org/GermanBluefox/ioBroker.sonus)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/GermanBluefox/ioBroker.sonus?branch=master&svg=true)](https://ci.appveyor.com/project/GermanBluefox/ioBroker-sonus/)

## sonus adapter for ioBroker

With this adapter you can control ioBroker with voice in many different languages

## Installation on linux
```
sudo apt-get install libmagic-dev libatlas-base-dev build-essential sox libsox-fmt-all
```

### Check microphone
``` arecord -l```

If you have extra micro, you must set the default microphone:
```
**** List of CAPTURE Hardware Devices ****
card 1: SpkUAC20 [miniDSP VocalFusion Spk (UAC2.0], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
in 
```
sudo nano /usr/share/alsa/alsa.conf
```
and replace `defaults.pcm.card 0` with `defaults.pcm.card 1`, because in example there is a microphone on card 1.

You can test the microphone with `rec test.wav`.

## Changelog

### 0.0.1
* (bluefox) initial release

## License
MIT License

Copyright (c) 2019 bluefox

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.