// The example code uses crypto-js library (http://code.google.com/p/crypto-js/#SHA-2) to generate the signature
var express = require('express');
var crypto = require('crypto');
var returnURL = 'https://calm-coast-6141.herokuapp.com';
var thirdpartyID = '1283';
var thirdpartySecretKey = '8529874849d34d35a48da71448aad16a';

var params = {
    'return-url' : returnURL,
    'third-party-id' : thirdpartyID,
};

// Construct the hash string
// This utility will make it easier by letting us work with js objects
var constructURIEncodedQS = function(params, keyList) {
    // This function takes in query parameters as a js object and converts it to a URI encoded query string. It will construct it in the keyList order if it is provided.
    keyList = keyList || Object.keys(params);
    var qs = keyList[0] + '=' + encodeURIComponent(params[keyList[0]]);
    var keyLength = keyList.length;
    for (var i=1; i < keyLength; i++) {
        var key = keyList[i];
        qs += '&' + key + '=' + encodeURIComponent(params[key]);
    }
    return qs;
};
// Define a utility function that will take in query parameters as a js object, with the secret key to construct the signature
var generateRequestAccessSignature = function(params, secretKey) {
    // Extract the parameter keys and alphanumerically sort it in place
    var objectKeys = Object.keys(params);
    objectKeys.sort();

    // Create the string to hash and hash it using SHA-256
    var stringToHash = secretKey + ':' + constructURIEncodedQS(params, objectKeys);
    return crypto.createHash('sha256').update(stringToHash).digest('hex');
};
params['signature'] = generateRequestAccessSignature(params, thirdpartySecretKey);

var requestAccessURL = 'https://shreddr.captricity.com/accounts/request-access/?' + constructURIEncodedQS(params);

// console.log(requestAccessURL)

var router = express.Router();

/* Routes */
router.get('/captricity', function (req, res) {
    res.redirect(requestAccessURL);
})


module.exports = router;