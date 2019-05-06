#!/usr/bin/env node

'use strict';

var fs = require('fs');
var xml2js = require('xml2js');

module.exports = function (context) {
    var TV_ACTIVITY_NAME = 'com.kuack.plugins.androidtv.TvActivity';
    // manifest
    var manifestPath = context.opts.projectRoot + '/platforms/android/app/src/main/AndroidManifest.xml';
    var androidManifest = fs.readFileSync(manifestPath).toString();
    if (androidManifest) {
        xml2js.parseString(androidManifest, function(err, manifest) {
            if (err) return console.error(err);
            
            var manifestRoot = manifest['manifest'];
            var applicationTag = manifestRoot.application[0]['$'];
            applicationTag['android:banner'] = '@drawable/banner';

            var activityTags = manifestRoot.application[0].activity;
            var tvActivityFound = false;
            activityTags.some(function(activity, i){
                if (activity['$']['android:name'] === TV_ACTIVITY_NAME) {
                    tvActivityFound = true;
                    return true;
                }
            });
            if (!tvActivityFound) {
                activityTags.push({
                    '$': {
                        'android:name': TV_ACTIVITY_NAME,
                        'android:label': '@string/app_name',
                        'android:theme': '@style/Theme.Leanback',
                        'android:screenOrientation': 'landscape',
                    },
                    'intent-filter': [{
                        action: [{
                            '$': {
                                'android:name': 'android.intent.action.MAIN'
                            }
                        }],
                        category: [{
                            '$': {
                                'android:name': 'android.intent.category.LEANBACK_LAUNCHER'
                            }
                        }],
                    }]
                });
            }

            var nonRequiredFeatures = [
                'android.software.leanback',
                'android.hardware.touchscreen',
                'android.hardware.faketouch',
                'android.hardware.telephony',
                'android.hardware.camera',
                'android.hardware.nfc',
                'android.hardware.location.gps',
                'android.hardware.microphone',
                'android.hardware.sensor',
                'android.hardware.screen.portrait',
            ];
            manifestRoot['uses-feature'] = manifestRoot['uses-feature'] || [];
            if (manifestRoot['uses-feature'].length > 0) {
                manifestRoot['uses-feature'].forEach(function(manifestFeature){
                    var currFeature = manifestFeature['$'];
                    var currFeatureIndex = nonRequiredFeatures.indexOf(currFeature['android:name']);
                    if (currFeatureIndex > -1) {
                        nonRequiredFeatures.splice(currFeatureIndex, 1);
                        if (!currFeature['android:required'] || currFeature['android:required'] !== false) {
                            currFeature['android:required'] = false;
                        }    
                    }
                });
            }
            manifestRoot['uses-feature'] = manifestRoot['uses-feature'].concat(
                nonRequiredFeatures.map(function(featureName){
                    return {
                        '$': {
                            'android:name': featureName,
                            'android:required': false
                        }
                    };
                })
            );

            var builder = new xml2js.Builder();
            fs.writeFileSync(manifestPath, builder.buildObject(manifest), { encoding: 'utf8' });
        });
    }
};
