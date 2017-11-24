var stringExt = {};

stringExt.format = function() {
    var args = arguments;

    if (!args || args.length == 0 || args[0] === undefined) {
        return "";
    }

    var result = args[0].replace(/{(\d+)}/g, function (match, number) {
        if (typeof args[parseInt(number) + 1] != 'undefined')
            return args[parseInt(number) + 1];
        return match;
    });

    return result;
};

module.exports = stringExt;
