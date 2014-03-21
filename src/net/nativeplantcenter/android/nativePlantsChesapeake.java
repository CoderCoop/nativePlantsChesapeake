package net.nativeplantcenter.android;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;

public class nativePlantsChesapeake extends Activity
{
  // create the webview object
  protected WebView myWebView;
   

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        myWebView = (WebView) findViewById(R.id.webview);
        
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        
        
        if (savedInstanceState == null) {
        
          myWebView.loadUrl("file:///android_asset/index.html");
          
        }
        
    }
    
    // save the state of the webview
    @Override
    protected void onSaveInstanceState(Bundle outState) {
      super.onSaveInstanceState(outState);
      // Save the state of the WebView
      myWebView.saveState(outState);
    }
    
    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState)
    {
      super.onRestoreInstanceState(savedInstanceState);
   
      // Restore the state of the WebView
      myWebView.restoreState(savedInstanceState);
    }

    
}
