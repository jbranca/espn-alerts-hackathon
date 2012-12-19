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

	public void vibrate(int duration) {
		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate((long)duration);
	}

	public void vibrateMorseCode(String code) {
		long[] pattern = MorseCodeConverter.pattern(code);
		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate(pattern, -1);
	}

	// the dur param was left over from some other code, dont use this method signature...
	public void vibrateMorseCode(String code, long dur) {
		vibrateMorseCode(code);
	}

	public void textToSpeech(String text) {
		mTts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
	}

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

	public void startCameraStrobe(int numFlashes) {
		startCameraStrobe(numFlashes, 10);
	}

	public void startCameraStrobe(int numFlashes, int strobeDelay) {
		startCameraStrobe(numFlashes, strobeDelay, 500);
	}

	public void startCameraStrobe(int numFlashes, int strobeDelay, int strobeDelayOff) {
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

	public void requestStopCameraStrobe() {
		strobeRunner.stopRequested = true;
	}

}
