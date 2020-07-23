# handwaving

A Javascript library for detection of accelerometer gestures in smartphones.
Detection is based on the magnitude spectrum of the accelerometer signals, which is fed into a neural network classifier.
The library was developed for participatory music performance. For more information on the library and the context of the project, see:

G. Roma, A. Xambó and J.Freeman (2018). User-independent Accelerometer Gesture Recognition for Participatory Mobile Music.
Journal of the Audio Engineering Society (JAES) .66 (6), pp. 430-438.

# dependencies
- convnetjs
- dsp.js

# usage
The library can be used with the pre-trained network or to train a new one to detect new gesture dictionaries.
A default dictionary of gestures is available in two datasets: "original" and "multiuser" (the latter was generated from more users and more consistently sampled across users, so it should generalize better).

Gestures reflect 7 classes of oscillatory movements: left / right , up / down, tilt, circles, forward / backwards, concave and convex.
The expressjs web application in the webapp directory can be used to collect training data.
Training is typically done offline by running the script train.js on nodejs.
An example of detection is provided in example.js (needs to be browserified).
