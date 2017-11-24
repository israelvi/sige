window.formatThousands = function (n, dp) {
    var s = '' + (Math.floor(n)), d = n % 1, i = s.length, r = '';
    while ((i -= 3) > 0) {
        r = ',' + s.substr(i, 3) + r;
    }
    return s.substr(0, i + 3) + r + (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
};

window.decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');
    function decodeHtmlEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    }
    return decodeHtmlEntities;
})();


window.splitToHtml = (function(str, separator, htmlIni, htmlEnd) {
    var res = str.split(separator);
    var ret = "";
    for (var i = 0, len = res.length; i < len; i++) {
        ret += htmlIni + res[i] + htmlEnd;
    }
    return ret;
});