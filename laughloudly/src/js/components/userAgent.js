/**
 * @file 浏览器识别
 * @author firede[firede@firede.us],
 *         zfkun[zfkun@msn.com]
 * @desc thanks zepto.
 */

define(function( require ) {

    //     Zepto.js
    //     (c) 2010-2014 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.

    /**
     * UserAgent Detect
     *
     * @inner
     * @param {string} ua navigator.userAgent
     * @return {Object}
     */
    function detect( ua ) {
		var ua = ua || navigator.userAgent;
        var os = {}, browser = {},
        webkit = ua.match( /Web[kK]it[\/]{0,1}([\d.]+)/ ),
        android = ua.match( /(Android);?[\s\/]+([\d.]+)?/ ),
        osx = !!ua.match( /\(Macintosh\; Intel / ),
        ipad = ua.match( /(iPad).*OS\s([\d_]+)/ ),
        ipod = ua.match( /(iPod)(.*OS\s([\d_]+))?/ ),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/ ),
        webos = ua.match( /(webOS|hpwOS)[\s\/]([\d.]+)/ ),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match( /TouchPad/ ),
        kindle = ua.match( /Kindle\/([\d.]+)/ ),
        silk = ua.match( /Silk\/([\d._]+)/ ),
        blackberry = ua.match( /(BlackBerry).*Version\/([\d.]+)/ ),
        bb10 = ua.match( /(BB10).*Version\/([\d.]+)/ ),
        rimtabletos = ua.match( /(RIM\sTablet\sOS)\s([\d.]+)/ ),
        playbook = ua.match( /PlayBook/ ),
        chrome = ua.match( /Chrome\/([\d.]+)/ ) || ua.match( /CriOS\/([\d.]+)/ ),
        firefox = ua.match( /Firefox\/([\d.]+)/),
        ie = ua.match( /MSIE\s([\d.]+)/) || ua.match( /Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/ ),

        webview = !chrome && ua.match( /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/ ),
        safari = webview || ua.match( /Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/ ),

        wechat = ua.match( /MicroMessenger\/([\d.]+)/ ),
        baidu = ua.match( /baiduboxapp\/[^\/]+\/([\d.]+)_/ )
            || ua.match( /baiduboxapp\/([\d.]+)/ )
            || ua.match( /BaiduHD\/([\d.]+)/ )
            || ua.match( /FlyFlow\/([\d.]+)/ )
            || ua.match( /baidubrowser\/([\d.]+)/ ),
        qq = ua.match( /MQQBrowser\/([\d.]+)/ )
            || ua.match( /QQ\/([\d.]+)/ ),
        uc = ua.match( /UCBrowser\/([\d.]+)/ ),
        sogou = ua.match( /SogouMobileBrowser\/([\d.]+)/ ),
        xiaomi = android && ua.match( /MiuiBrowser\/([\d.]+)/ ),
        liebao = ua.match( /LBKIT/ ),
        mercury = ua.match( /Mercury\/([\d.]+)/ ),
        damaiapp = ua.match( /damaiapp/ ),

        windows = ua.match( /Windows\sNT/ ),
        mac = ua.match( /\(Macintosh\;\sIntel\sMac\sOS\sX\s([\d.]+)/ );

        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes

        if ( ( browser.webkit = !!webkit ) ) {
            browser.version = webkit[1];
        }

        if ( android ) {
            os.android = true;
            os.version = android[2];
        }
        if ( mac ) {
            os.mac = true;
            os.version = mac[1].replace(/_/g, '.');
        }
        if ( osx ) {
            os.mac = true;
            os.version = mac[1].replace(/_/g, '.');
        }
        if ( iphone && !ipod ) {
            os.ios = os.iphone = true;
            os.version = iphone[2].replace(/_/g, '.');
        }
        if ( ipad ) {
            os.ios = os.ipad = true;
            os.version = ipad[2].replace(/_/g, '.');
        }
        if ( ipod ) {
            os.ios = os.ipod = true;
            os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        }
        if ( wp ) {
            os.wp = true;
            os.version = wp[1];
        }
        if ( webos ) {
            os.webos = true;
            os.version = webos[2];
        }
        if ( touchpad ) {
            os.touchpad = true;
        }
        if ( blackberry ) {
            os.blackberry = true;
            os.version = blackberry[2];
        }
        if ( bb10 ) {
            os.bb10 = true;
            os.version = bb10[2];
        }
        if ( rimtabletos ) {
            os.rimtabletos = true;
            os.version = rimtabletos[2];
        }
        if ( playbook ) {
            browser.playbook = true;
        }
        if ( kindle ) {
            os.kindle = true;
            os.version = kindle[1];
        }
        if ( silk ) {
            browser.silk = true;
            browser.version = silk[1];
        }
        if ( !silk && os.android && ua.match( /Kindle Fire/ ) ) {
            browser.silk = true;
        }
        if ( chrome ) {
            browser.chrome = true;
            browser.version = chrome[1];
        }
        if ( firefox ) {
            browser.firefox = true;
            browser.version = firefox[1];
        }
        if ( ie ) {
            browser.ie = true;
            browser.version = ie[1];
        }
        if ( safari && ( osx || os.ios ) ) {
            browser.safari = true;
            if ( osx ) {
                browser.version = safari[1];
            }
        }
        if ( webview ) {
            browser.webview = true;
        }
        if ( wechat ) {
            browser.wechat = true;
            browser.version = wechat[1];
        }
        if ( baidu ) {
            delete browser.webview;
            browser.baidu = true;
            browser.version = baidu[1];
        }
        if ( qq ) {
            browser.qq = true;
            browser.version = qq[1];
        }
        if ( uc ) {
            delete browser.webview;
            browser.uc = true;
            browser.version = uc[1];
        }
        if ( sogou ) {
            delete browser.webview;
            browser.sogou = true;
            browser.version = sogou[1];
        }
        if ( xiaomi ) {
            browser.xiaomi = true;
            browser.version = xiaomi[1];
        }
        if ( liebao ) {
            browser.liebao = true;
            browser.version = '0';
        }
        if ( mercury ) {
            browser.mercury = true;
            browser.version = mercury[1];
        }
        if ( navigator.standalone ) {
            browser.standalone = true;
        }
        if ( damaiapp ) {
            browser.damaiapp = true;
//            browser.version = damaiapp[1];
        }

        os.tablet = !!(
            ipad
            || playbook
            || ( android && !ua.match( /Mobile/ ) )
            || ( firefox && ua.match( /Tablet/ ) )
            || ( ie && !ua.match( /Phone/ ) && ua.match( /Touch/ ) )
        );
        os.phone  = !!(
            !os.tablet
            && !os.ipod
            && ( android
                || iphone
                || webos
                || blackberry
                || bb10
                || (chrome && ua.match( /Android/ ))
                || (chrome && ua.match( /CriOS\/([\d.]+)/ ))
                || (firefox && ua.match( /Mobile/ ))
                || (ie && ua.match( /Touch/ ))
            )
        );
        os.pc = !!(
            ( windows && !wp )
            || mac
        );

        return {
            browser: browser,
            os: os
        };
    }

    return detect;

});