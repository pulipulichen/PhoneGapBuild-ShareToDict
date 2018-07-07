ready = function () {
    try {
        window.plugins.intent.setNewIntentHandler(function (intent) {
            /*
            try {
                intent_handler(intent);
            } catch (e) {
                alert(e);
                navigator.app.exitApp();
            }
            */
        }, function (e) {
            
        });

        window.plugins.intent.getCordovaIntent(function (intent) {
            try {
                intent_handler(intent);
            } catch (e) {
                alert(e);
                navigator.app.exitApp();
            }
        });
    } catch (e) {
        alert("ready fail: " + e);
    }
};

var FILTER_SUBJECT = [
    "Text Scanner"
];

intent_handler = function (intent) {
    //alert("換了 可以嗎？");
    //alert(JSON.stringify(intent));
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
        // 沒有要檢索的東西，回家吧。
        //alert("空空");
        openActivity();
        //return;
        navigator.app.exitApp();
    }

    var _search_items = [];

    var _has_string = function (_item) {
        return (typeof (_item) === "string"
                && _item.trim() !== "");
    };

    if (typeof (intent.extras) === "object") {
        var _extras = intent.extras;

        var _key_list = [
            "android.intent.extra.SUBJECT",
            "android.intent.extra.TEXT",
            "android.intent.extra.PROCESS_TEXT",
        ];

        for (var _i = 0; _i < _key_list.length; _i++) {
            if (_has_string(_extras[_key_list[_i]])) {
                var _subject = _extras[_key_list[_i]].trim();
                for (var _j = 0; _j < FILTER_SUBJECT.length; _j++) {
                    var _needle = FILTER_SUBJECT[_j];
                    if (_subject === _needle) {
                        //_text = _text.substring(_needle.length, _text.length).trim();
                        _subject = null;
                        break;
                    }
                }
                if (null !== _subject) {
                    _search_items.push(_subject);
                }
            }
        }
        /*
         if (_has_string(_extras["android.intent.extra.SUBJECT"])) {
         _search_items.push(_extras["android.intent.extra.SUBJECT"].trim());
         }
         if (_has_string(_extras["android.intent.extra.TEXT"])) {
         _search_items.push(_extras["android.intent.extra.TEXT"].trim());
         }
         if (_has_string(_extras["android.intent.extra.PROCESS_TEXT"])) {
         _search_items.push(_extras["android.intent.extra.PROCESS_TEXT"].trim());
         }
         */
    }

    var _test_url = _search_items.join(" ");
    _test_url = _test_url.split("\n").join(" ");
    var _url_list = [];

    var _http_list = _test_url.split("http://");
    for (var _i = 1; _i < _http_list.length; _i++) {
        var item = _http_list[_i];
        var pos = item.indexOf(" ");
        if (pos === -1) {
            pos = item.indexOf("\n");
        }
        if (pos === -1) {
            pos = item.length;
        }
        _url_list.push("http://" + item.substring(0, pos));
    }

    var _https_list = _test_url.split("https://");
    for (var _i = 1; _i < _https_list.length; _i++) {
        var item = _https_list[_i];
        var pos = item.indexOf(" ");
        if (pos === -1) {
            pos = item.indexOf("\n");
        }
        if (pos === -1) {
            pos = item.length;
        }
        _url_list.push("https://" + item.substring(0, pos));
    }

    //alert(JSON.stringify(_url_list));
    if (_url_list.length > 0) {
        for (var i = 0; i < _url_list.length; i++) {
            //setTimeout(function () {
            window.open(_url_list[i], "_system");
            //}, 0);
        }
        navigator.app.exitApp();
        return;

    }

    if (_search_items.length > 0) {
        if (_search_items.length === 1
                && (_search_items[0].startsWith("http://") || _search_items[0].startsWith("https://"))) {
            //alert(encodeURIComponent(_search_items[0]));
            window.open(_search_items[0], "_system");
            navigator.app.exitApp();
        } else {
            var _search_text = _search_items.join(" ");

            var _config = {
                //action: "android.app.SearchManager.INTENT_ACTION_GLOBAL_SEARCH",
                action: "com.ngc.fora.action.LOOKUP",
                //data: _search_text,
                //uri: _search_text,
                //url: _search_text,
                //pacakge: "com.google.android.googlequicksearchbox",
                extras: {
                    //"android.intent.extra.SUBJECT": _search_text,
                    "android.intent.extra.TEXT": _search_text,
                    //"ACTION_MSG": 1,
                    //"ACTION_MSG": 1,
                    //"query": _search_text,
                    //"SearchManager": {
                    //    "QUERY": _search_text,
                    //}
                }
            };

            try {
                window.plugins.webintent.startActivity(_config,
                        function () {
                            navigator.app.exitApp();
                        },
                        function () {
                            alert('Failed:' + JSON.stringify(_search_items.join(" "), null, 2));
                            navigator.app.exitApp();
                        }
                );
            } catch (e) {
                alert(e);
            }
        }
    }
    else {
        openActivity();
    }
};

openActivity = function () {
    //return;
    var _config = {
        action: "com.ngc.fora.action.LOOKUP",
        extras: {
            "android.intent.extra.TEXT": "",
        }
    };

    try {
        window.plugins.webintent.startActivity(_config,
                function () {
                    navigator.app.exitApp();
                },
                function () {
                    navigator.app.exitApp();
                }
        );
    } catch (e) {
        alert(e);
    }
};
