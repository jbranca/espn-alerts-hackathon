package com.espn.pantsalerts;

import android.content.Context;
import android.os.Vibrator;
import android.webkit.WebView;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

public class PantsAlertsScriptInterface {

    Context mContext;
	//Boolean mIsPantsAlertsOn;
	//private SensorManager mSensorManager;
	//private Sensor mSensor;
	WebView mWebView;
	//float mXCoord;
	//int mSelectedOppId;

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
    PantsAlertsScriptInterface(Context c, WebView view) {
        mContext = c;
		//mIsPantsAlertsOn = false;
		mWebView = view;

		//mSensorManager = (SensorManager)mContext.getSystemService(Context.SENSOR_SERVICE);
        //mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
    }

    /** Show a toast from the web page */
	/*
    public void pantsModeOn() {
		// see: http://developer.android.com/reference/android/os/PowerManager.html
		// about obtaining a wake lock
		// see: http://developer.android.com/resources/samples/ApiDemos/src/com/example/android/apis/os/Sensors.html
		// about accelerometers
		mIsPantsAlertsOn = true;
        mSensorManager.registerListener(mListener, mSensor, SensorManager.SENSOR_DELAY_GAME);
	}

	public void pantsModeOff() {
		mIsPantsAlertsOn = false;
        mSensorManager.unregisterListener(mListener);
	}

	public void buzzScore() {
		if(mIsPantsAlertsOn) {
			Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
			vibrator.vibrate(400);
		}
    }

	public void handleNewPlay(String downAndDistance) {
		if(mIsPantsAlertsOn) {
			String[] parts = downAndDistance.split(" ");
			String downStr = "" + parts[0].charAt(0);
			int down = Integer.parseInt(downStr);
			int dist = Integer.parseInt("" + parts[2]);
			long dur = 500;
			if(dist > 5) { dur += 500; }
			if(dist > 10) { dur += 500; }
			//long[] pattern = new long[] { 100, 100, 100, dur};
			long[] pattern = MorseCodeConverter.pattern(downStr);
			long[] pattern2 = new long[pattern.length+2];
			for(int i = 0; i < pattern.length; i++) {
				pattern2[i] = pattern[i];
			}
			pattern2[pattern2.length - 2] = 200;
			pattern2[pattern2.length - 1] = dur;

			Vibrator vibrator = (Vibrator)mContext.getSystemService(Context.VIBRATOR_SERVICE);
			vibrator.vibrate(pattern2, -1);
		}
	}
	*/

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

}
