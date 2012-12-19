package com.espn.pantsalerts;

import android.content.Context;
import android.os.Vibrator;
import android.webkit.WebView;
import android.speech.tts.TextToSpeech;
import android.hardware.Camera;
import android.hardware.Camera.Parameters;
import android.util.Log;


public class PantsAlertsScriptInterface {

    Context mContext;
	WebView mWebView;
	private TextToSpeech mTts;
	private Camera mCamera;
	private Camera.Parameters mCameraParameters;
	private StrobeRunner strobeRunner = new StrobeRunner();
	private Thread strobeThread;

	private class StrobeRunner implements Runnable {
		public volatile boolean isRunning = false;
		public volatile boolean stopRequested = false;
		public volatile int delay = 10;
		public volatile int delayOff = 500;
		public volatile int numFlashes = 5;
		public volatile Camera mCamera;

		public StrobeRunner() { }

		public void run() { 
			if(isRunning) {
				return;
			}
			
			stopRequested = false;
			isRunning = true;

			mCamera = Camera.open();
			
			Camera.Parameters pon = mCamera.getParameters();
			Camera.Parameters poff = mCamera.getParameters();
			pon.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
			poff.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
			
			int count = 0;
			while(count++ < numFlashes && !stopRequested) {
				try{
					if(mCamera != null) {
						mCamera.setParameters(pon);
						Thread.sleep(delay);
					}
					if(mCamera != null) { 
						mCamera.setParameters(poff);
						Thread.sleep(delayOff);
					}
				}
				catch(InterruptedException ex) {
				}
				catch(RuntimeException ex) {
					stopRequested = true;
				}
			}
			
			if(mCamera != null) {
				mCamera.release();
				mCamera = null;
			}
			
			isRunning = false;
			stopRequested = false;
		}
	}


    /** Instantiate the interface and set the context */
    PantsAlertsScriptInterface(Context c, WebView view, TextToSpeech tts) {
        mContext = c;
		mWebView = view;
		mTts = tts;
    }

	/**
	 * Vibrate a single time for a given duration
	 *
	 * @param int duration
	 *	The number of millilseconds to vibrate for
	 */
	public void vibrate(int duration) {
		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate((long)duration);
	}

	/**
	 * Vibrate over a given pattern of vibrations and pauses
	 *
	 * @param long[] pattern
	 *	A series of pause durations followed by vibration durations. The first value indicates the number of milliseconds
	 *	to wait before vibrating, the next value indicates the number of milliseconds to vibrate for. Subsequent values alternate
	 *	between pause and vibrate durations.
	 * @param int repeat
	 *	The number of times to repeat the pattern. -1 indicates do no repeat
	 */
	public void vibrate(long[] pattern, int repeat) {
		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate(pattern, repeat);
	}

	/**
	 * Vibrate a given number times. This is shortcut method for performing a repeated pattern.
	 *
	 * @param int vibrateDuration
	 *	The duration in milliseconds to vibrate for
	 * @param int pauseDuration
	 *	The duration in milliseconds to pause between vibrates for
	 * @param int repeat
	 *	The number of times to vibrate for
	 */
	public void vibrate(int pauseDuration, int vibrateDuration, int repeat) {
		long[] pattern = {pauseDuration, vibrateDuration};
		vibrate(pattern, repeat);
	}

	/**
	 * Vibrate a  morse-code message
	 *
	 * @param String code
	 *	The text message to convert to morse code and vibrated
	 */
	public void vibrateMorseCode(String code) {
		long[] pattern = MorseCodeConverter.pattern(code);
		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate(pattern, -1);
	}

	/**
	 * @deprecated
	 * the dur param was left over from some other code, dont use this method signature...
	 */
	public void vibrateMorseCode(String code, long dur) {
		vibrateMorseCode(code);
	}

	/**
	 * Speak the given text message
	 *
	 * @param String text
	 *	The message to speak
	 */
	public void textToSpeech(String text) {
		mTts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
	}

	/**
	 * Turn the camera light on ("torch" mode)
	 */
	public void setCameraTorchOn() {
		if(strobeRunner.isRunning) {
			strobeRunner.stopRequested = true;
			strobeRunner.mCamera.release();
			strobeRunner.mCamera = null;
		}
		if(mCamera == null) {
			mCamera = Camera.open();
			mCameraParameters = mCamera.getParameters();
		}
		mCameraParameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
		mCamera.setParameters(mCameraParameters);
	}

	/**
	 * Turn the camera light off ("torch" mode)
	 */
	public void setCameraTorchOff() {
		if(strobeRunner.isRunning) {
			strobeRunner.stopRequested = true;
			strobeRunner.mCamera.release();
			strobeRunner.mCamera = null;
		}
		if(mCamera != null) {
			mCameraParameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
			mCamera.setParameters(mCameraParameters);
			mCamera.release();
			mCamera = null;
			mCameraParameters = null;
		}
	}

	/**
	 * Turn the camera light on and off in a strobing fashion
	 *
	 * @param int numFlashes
	 *	The number of times to flash the light on
	 * @param int strobeDelayOff
	 *	The duration in milliseconds to keep the light off between flashes
	 * @param int strobeDelay
	 *	The duration in milliseconds to keep the light on during each flash
	 */
	public void startCameraStrobe(int numFlashes, int strobeDelayOff, int strobeDelay) {
		if(mCamera != null) { 
			mCamera.release();
			mCamera = null;
			mCameraParameters = null;
		}

		strobeRunner.delay = strobeDelay;
		strobeRunner.delayOff = strobeDelayOff;
		strobeRunner.numFlashes = numFlashes;
		strobeRunner.stopRequested = false;
		if(!strobeRunner.isRunning) { 
			strobeThread = new Thread(strobeRunner);
			strobeThread.start();
		}
	}

	/**
	 * Turn the camera light on and off in a strobing fashion
	 * Uses 500ms for pauses between flashes.
	 *
	 * @param int numFlashes
	 *	The number of times to flash the light on
	 * @param int strobeDelay
	 *  The duration in milliseconds to keep the light on during each flash
	 */
	public void startCameraStrobe(int numFlashes, int strobeDelay) {
		startCameraStrobe(numFlashes, 500, strobeDelay);
	}

	/**
	 * Turn the camera light on and off in a strobing fashion
	 *
	 * @param int numFlashes
	 *	The number of times to flash the light on
	 */
	public void startCameraStrobe(int numFlashes) {
		startCameraStrobe(numFlashes, 10);
	}

	/**
	 * Stop the camera strobing at the next available iteration. 
	 */
	public void requestStopCameraStrobe() {
		strobeRunner.stopRequested = true;
	}

}
