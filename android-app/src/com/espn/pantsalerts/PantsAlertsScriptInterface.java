package com.espn.pantsalerts;

import android.content.Context;
import android.os.Vibrator;
import android.webkit.WebView;
//import android.hardware.Sensor;
//import android.hardware.SensorEvent;
//import android.hardware.SensorEventListener;
//import android.hardware.SensorManager;
import android.speech.tts.TextToSpeech;
import android.hardware.Camera;
import android.hardware.Camera.Parameters;


public class PantsAlertsScriptInterface {

    Context mContext;
	//private SensorManager mSensorManager;
	//private Sensor mSensor;
	WebView mWebView;
	private TextToSpeech mTts;
	private Camera mCamera;
	private Parameters mCameraParameters;

	/*
 	private final SensorEventListener mListener = new SensorEventListener() {
        public void onSensorChanged(SensorEvent event) {
            //if (Config.LOGD) Log.d(TAG, "sensorChanged (" + event.values[0] + ", " + event.values[1] + ", " + event.values[2] + ")");
			float xcoord = event.values[0];
			int oppId;
			if(xcoord > 135) { oppId = 1; }			//Pass short - far left
			else if(xcoord > 125) { oppId = 2; }		//Pass med - left
			else if(xcoord > 115 ) { oppId = 4; }		//Run Short - mid left
			else if(xcoord > 107) { oppId = 5; }		//Run Med  - mid right
			else if(xcoord < 100) { oppId = 6; }		//Rune long - right
			else { oppId = 3; }						// pass long - far right

			//mWebView.loadUrl("javascript:(function(){var d = document.createElement('div');d.innerHTML = '" + xcoord + "';document.body.insertBefore(d, document.body.firstChild);})()");
			if(oppId != mSelectedOppId) {
				mWebView.loadUrl("javascript:(function(){androidSelectRoute(" + oppId + ");})()");
				mSelectedOppId = oppId;
			}
        }

        public void onAccuracyChanged(Sensor sensor, int accuracy) {
        }
    };
	*/

    /** Instantiate the interface and set the context */
    PantsAlertsScriptInterface(Context c, WebView view, TextToSpeech tts) {
        mContext = c;
		mWebView = view;
		mTts = tts;

		//mSensorManager = (SensorManager)mContext.getSystemService(Context.SENSOR_SERVICE);
        //mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
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
		mCameraParameters.setFlashMode(Parameters.FLASH_MODE_TORCH);
		mCamera.setParameters(mCameraParameters);
	}

	public void setCameraTorchOff() {
		if(mCamera != null) {
			mCameraParameters.setFlashMode(Parameters.FLASH_MODE_OFF);
			mCamera.setParameters(mCameraParameters);
			mCamera.release();
			mCamera = null;
			mCameraParameters = null;
		}
	}

}
