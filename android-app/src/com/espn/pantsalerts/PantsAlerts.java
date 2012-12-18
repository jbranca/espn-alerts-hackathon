package com.espn.pantsalerts;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Vibrator;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.KeyEvent;
import android.speech.tts.TextToSpeech;
import android.speech.tts.TextToSpeech.OnInitListener;
import java.util.Locale;
import android.widget.Toast;


public class PantsAlerts extends Activity implements OnInitListener
{
	WebView mWebView;
	private TextToSpeech mTts;
	private int MY_TTS_DATA_CHECK_CODE = 0;
	PantsAlertsScriptInterface mPantsAlertsScriptInterface;

	private class PantsAlertsClient extends WebViewClient {

		/*
		private void injectPlaySelectScript(WebView view) {
			String s = "javascript:(function(){window.androidSelectRoute=function(oppId){var routes=ESPN.Gamecast.routes,fieldRoutes=ESPN.Gamecast.field.routes,routeId=null,i,n;for(i=0,n=routes.length;i<n;i++){if(routes[i].oppId==oppId){routeId=routes[i].id;break;}}if(routeId){for(i=0,n=fieldRoutes.length;i<n;i++){if(routeId==fieldRoutes[i].id){ESPN.Gamecast.field.selectRoute(fieldRoutes[i]);break;}}}};})()";
			view.loadUrl(s);
			//view.loadUrl("javascript:(function(){window.setTimeout(function(){androidSelectRoute(2);},1000);})()");
		}
		*/

		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			view.loadUrl(url);
			return true;
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			//injectPlaySelectScript(view);
		}
	}

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

		Intent checkIntent = new Intent();
		checkIntent.setAction(TextToSpeech.Engine.ACTION_CHECK_TTS_DATA);
		startActivityForResult(checkIntent, MY_TTS_DATA_CHECK_CODE);

		//setupWebView();
    }

	protected void setupWebView() {
		mWebView = (WebView)findViewById(R.id.webview);
		mWebView.setWebViewClient(new PantsAlertsClient());
		mWebView.getSettings().setJavaScriptEnabled(true);
		mPantsAlertsScriptInterface = new PantsAlertsScriptInterface(this, mWebView, mTts);
		mWebView.addJavascriptInterface(mPantsAlertsScriptInterface, "Android");
		//mWebView.loadUrl("https://dl.dropbox.com/u/11303433/hackathon.html");
		mWebView.loadUrl("http://ec2-72-44-62-42.compute-1.amazonaws.com/espn-alerts-hackathon/index.html");
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if((keyCode == KeyEvent.KEYCODE_BACK) && mWebView.canGoBack()) {
			mWebView.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if(requestCode == MY_TTS_DATA_CHECK_CODE) {
			if(resultCode == TextToSpeech.Engine.CHECK_VOICE_DATA_PASS) {
				// success, create the TTS instance, and no we are ready to launch the webview
				mTts = new TextToSpeech(this, this);
			} else {
				// missing data, install it
				Intent installIntent = new Intent();
				installIntent.setAction(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
				startActivity(installIntent);
			}
		}
	}

	public void onInit(int initStatus) {
		//check for successful instantiation
		if(initStatus == TextToSpeech.SUCCESS) {
			//@TODO: WTF, why doesnt this check work?
			//if(mTts.isLanguageAvailable(Locale.US)==TextToSpeech.LANG_AVAILABLE) {
				mTts.setLanguage(Locale.US);
				setupWebView();
			//}
		}
		else if(initStatus == TextToSpeech.ERROR) {
			Toast.makeText(this, "Sorry! Text To Speech failed...", Toast.LENGTH_LONG).show();
		}
	}

	public TextToSpeech getTTS() {
		return mTts;
	}
}
