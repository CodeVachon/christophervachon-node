
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} // close getRandomInt

exports.generatePassword = function (minLength, maxLength, specialChars) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (typeof(specialChars) == "Undefined") { specialChars = true; }
    if (specialChars) {
        possible += "!@%$";
    }
    var textLength = getRandomInt(minLength || 20, maxLength || 25);

    for( var i=0; i < textLength; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
} // close generatePassword

exports.prettyDate = function(_incomingDate, format) {
    var _date,
        _format = format || "MMM D, YYYY",
        _outputString = "",
        Months_Short = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        Months_Long = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        Days_Short = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        Days_Long = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    ;

    if (_incomingDate instanceof Date) {
        _date = _incomingDate
    } else {
        _date = new Date(_incomingDate);
    }

    if (_format === "short") {
        _format = "m/d/yyyy";
    } else if (_format === "medium") {
        _format = "mmm d, yyyy";
    } else if (_format === "long") {
        _format = "mmmm d, yyyy";
    } else if (_format === "full") {
        _format = "dddd, mmmm d, yyyy";
    }

    var _formatSplit = _format.toLowerCase().split(/(m{1,4}|d{1,4}|y{4}|y{2}|\s{1,}|,|-|\/)/gi);

    for (var i=0, x=_formatSplit.length; i<x; i++) {
        switch(_formatSplit[i]) {
            case "m":
                _outputString += (_date.getMonth() + 1)
                break;
            case "mm":
                var _thisString = (_date.getMonth() + 1).toString();
                if (_thisString.length === 1) {
                    _thisString = "0" + _thisString;
                }
                _outputString += _thisString;
                break;
            case "mmm":
                _outputString += Months_Short[_date.getMonth()];
                break;
            case "mmmm":
                _outputString += Months_Long[_date.getMonth()];
                break;
            case "yy":
                _outputString += _date.getFullYear().toString().substr(2);
                break;
            case "yyyy":
                _outputString += _date.getFullYear().toString();
                break;
            case "d":
                _outputString += _date.getDate().toString();
                break;
            case "dd":
                var _thisString = _date.getDate().toString();
                if (_thisString.length === 1) {
                    _thisString = "0" + _thisString;
                }
                _outputString += _thisString;
                break;
            case "ddd":
                _outputString += Days_Short[_date.getDay()];
                break;
            case "dddd":
                _outputString += Days_Long[_date.getDay()];
                break;
            default:
                _outputString += _formatSplit[i];
                break;
        } // close switch
    } // close for

    return _outputString;
} // close prettyDate

exports.format_url_text = function (_string) {
    return _string
        .replace(/<[^>]+>/gi,"")
        .replace(/\W{1,}/g,"-")
        .replace(/^-?([a-zA-Z0-9]{1,}[a-zA-Z0-9-]{0,}[a-zA-Z0-9]{1,})-?$/gi,"$1")
        .toLowerCase()
    ;
} // close format_url_text

exports.isInt = function(_valueToCheck) {
    return ( parseInt( _valueToCheck ) == _valueToCheck );
} // close isInt
