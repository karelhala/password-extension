'use strict';
var formInfo;

document.addEventListener('DOMContentLoaded', function () {
  var notifyPage = document.getElementById('notify-page');
  var formFill = document.getElementById('form-fill');
  var pubkey;
  var privkey;
  var encrypted;
  openpgp.config.aead_protect = true;


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      formInfo = request;
      if (formInfo.fields && formInfo.key) {
        pubkey = formInfo.key;
        createFields(formInfo.fields, formFill);
      }
    }
  );

  var loginInfo = {
    name: 'admin',
    password: 'admin'
  };

  notifyPage.addEventListener('click', function () {
    console.log(fetchFromContainer(formFill));
    encryptMessage(JSON.stringify(fetchFromContainer(formFill)), pubkey).then(function(ciphertext) {
      sendToBrowser(ciphertext);
      // close();
    });
  });
});

function fetchFromContainer(container) {
  var formInfo = {};
  console.log(container.querySelectorAll('div input'));
  container.querySelectorAll('div input').forEach(function(input) {
    formInfo[input.getAttribute('id')] = input.value;
  });
  return formInfo;
}

function createFields(fields, container) {
  fields.forEach(function (field, key) {
    var div = document.createElement('div');
    var input = document.createElement('input');
    input.setAttribute('type', field.type);
    input.setAttribute('id', field.name);
    div.appendChild(input);
    container.appendChild(div);
  });
}

function sendToBrowser(data) {
  var port = chrome.extension.connect();
  port.postMessage({data: data});
}

function encryptMessage(message, pubkey) {
  return openpgp.encrypt({
    data: message,
    publicKeys: openpgp.key.readArmored(pubkey).keys
  }).then(function(ciphertext) {
    return ciphertext.data;
  });
}

function decryptMessage(encrypted) {
  var privKeyObj = openpgp.key.readArmored(getPrivKey()).keys[0];
  privKeyObj.decrypt('super long and hard to guess secret');

  openpgp.decrypt({
    message: openpgp.message.readArmored(encrypted),     // parse armored message
    publicKeys: openpgp.key.readArmored(getPubKey()).keys,    // for verification (optional)
    privateKey: privKeyObj // for decryption
  }).then(function(plaintext) {
    console.log(JSON.parse(plaintext.data));
  });
}

function getPubKey() {
  return `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v2.6.1
Comment: https://openpgpjs.org

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
=MiVz
-----END PGP PUBLIC KEY BLOCK-----

`;
}

function getPrivKey() {
  return `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v2.6.1
Comment: https://openpgpjs.org

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
6TuWnSNIdXTC/DbRQQ==
=Vf4S
-----END PGP PRIVATE KEY BLOCK-----
`;
}
