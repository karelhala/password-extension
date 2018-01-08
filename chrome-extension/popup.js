document.addEventListener('DOMContentLoaded', function () {
  var notifyPage = document.getElementById('notify-page');
  var pubkey;
  var privkey;
  openpgp.config.aead_protect = true;

  openpgp.generateKey({
    userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
    numBits: 4096,                                            // RSA key size
    passphrase: 'super long and hard to guess secret'         // protects the private key
  })
  .then(function(key) {
    privkey = key.privateKeyArmored;
    pubkey = key.publicKeyArmored;

    console.log(pubkey);
    options = {
      data: 'Hello, World!',                             // input as String (or Uint8Array)
      publicKeys: openpgp.key.readArmored(pubkey).keys  // for encryption
    };

    openpgp.encrypt(options).then(function(ciphertext) {
      encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
      console.log(encrypted);
    });
  });
  notifyPage.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {
      var privKeyObj = openpgp.key.readArmored(privkey).keys[0];
      privKeyObj.decrypt('super long and hard to guess secret');

      openpgp.decrypt({
        message: openpgp.message.readArmored(encrypted),     // parse armored message
        publicKeys: openpgp.key.readArmored(pubkey).keys,    // for verification (optional)
        privateKey: privKeyObj // for decryption
      }).then(function(plaintext) {
        console.log(plaintext);
      });

    });
  });
});

function encryptMessage(message, pubkey) {

}
