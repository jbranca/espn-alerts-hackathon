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
	public volatile boolean isStrobeRunning = false;

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

	public void vibrateMorseCode(String code, long dur) {
		long[] pattern = MorseCodeConverter.pattern(code);
		long[] pattern2 = new long[pattern.length+2];
		for(int i = 0; i < pattern.length; i++) {
			pattern2[i] = pattern[i];
		}
		pattern2[pattern2.length - 2] = 200;
		pattern2[pattern2.length - 1] = dur;

		Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
		vibrator.vibrate(pattern2, -1);
	}

	public void vibrateMorseCode(String code) {
		vibrateMorseCode(code, 500);
	}

	public void textToSpeech(String text) {
		mTts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
	}

	public void setCameraTorchOn() {
		if(mCamera == null) {
			mCamera = Camera.open();
			mCameraParameters = mCamera.getParameters();
		}
		mCameraParameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
		mCamera.setParameters(mCameraParameters);
	}

	public void setCameraTorchOff() {
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
    	if(isStrobeRunning) {
    		return;
		}
    	
    	//requestStrobeStop = false;
    	isStrobeRunning = true;
    	
		if(mCamera == null) { 
			mCamera = Camera.open();
		}
		
    	Camera.Parameters pon = mCamera.getParameters();
		Camera.Parameters poff = mCamera.getParameters();
    	pon.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
    	poff.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
    	
		int count = 0;
    	while(count++ < numFlashes) {// && !requestStrobeStop) {
    		try{
        		mCamera.setParameters(pon);
        		Thread.sleep(strobeDelay);
        		mCamera.setParameters(poff);
        		Thread.sleep(strobeDelayOff);
    		}
    		catch(InterruptedException ex) {
    		}
    		catch(RuntimeException ex) {
    			//requestStrobeStop = true;
    		}
    	}
    	
    	mCamera.release();
		mCamera = null;
		mCameraParameters = null;
    	
    	isStrobeRunning = false;
    	//requestStrobeStop = false;
	}

}
