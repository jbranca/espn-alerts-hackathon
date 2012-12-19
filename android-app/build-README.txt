Build Instructions
------------------

1) Make sure to download the Android SDK and have java jdk in your classpath

2) From the android-app/ root directory run, via command line run:
ant clean && ant debug

3) If the build is successfull, you can install per below

Installing
-----------
Method 1)
- plug your device into your computer via usb
- from the command line type "adb devices" to have your device recognized
- from the android-app directory type:
	adb -d install -r bin/PantsAlerts-debug.apk

Method 2)
you can email the apk file and open it on the device in the gmail app. You should be prompted to install it

TROUBLESHOOTING
---------------
- I committed the local.properties file with the path to the sdk as it is on my machine, you need to change it to what your path is
- project.properties is targeting "android-10". You need that platform installed in your sdk. From your sdk root tools/ directory
	- run "android sdk" and install Android 2.3 platform 
	- run "android list targets" from the command line and verify that "android-10" is listed.
- The PantsAlerts-debug.apk build you are installing is signed by a debug certificate for development purposes. This may conflict when building across different computers. Just make sure to un-install the app the first time building from a new computer, then try installing once more.
- You may need to wipe out your debug.keystore before attempting to build, run "rm ~/.android/debug.keystore" and try building and installing once more
