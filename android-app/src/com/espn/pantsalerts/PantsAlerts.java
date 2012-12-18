package com.espn.pantsalerts;

import android.app.Activity;
import android.os.Bundle;
import android.os.Vibrator;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.KeyEvent;


public class PantsAlerts extends Activity
{
	WebView mWebView;
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

		mWebView = (WebView)findViewById(R.id.webview);
		mWebView.setWebViewClient(new PantsAlertsClient());
		mWebView.getSettings().setJavaScriptEnabled(true);
		mPantsAlertsScriptInterface = new PantsAlertsScriptInterface(this, mWebView);
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
}
