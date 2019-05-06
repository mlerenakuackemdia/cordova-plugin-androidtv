package com.kuack.plugins.androidtv;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import java.lang.Boolean;

import android.content.Context;
import android.app.UiModeManager;
import android.content.res.Configuration;

public class TvPlugin extends CordovaPlugin {
    private Boolean isTV = null;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("isTV".equals(action)) {
            if (this.isTV == null) {
                UiModeManager uiModeManager = (UiModeManager) this.cordova.getActivity().getSystemService(Context.UI_MODE_SERVICE);
                this.isTV = uiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION;
            }
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, this.isTV));
            return true;
        }
        return false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onReset() {
        super.onReset();
    }
}
