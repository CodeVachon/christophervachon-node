
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
}
