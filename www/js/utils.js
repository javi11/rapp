/*exported randomString,saveObject,deleteObject */
/*jshint bitwise: false*/

'use strict';

/**
 * RANDOM STRING GENERATOR
 *
 * Use:       randomString(length [,"A"] [,"N"] );
 * Default:   return a random alpha-numeric string
 * Arguments: If you use the optional "A", "N" flags:
 *            "A" (Alpha flag)   return random a-Z string
 *            "N" (Numeric flag) return random 0-9 string
 */
function randomString(len, an) {
  an = an && an.toLowerCase();
  var str = '',
    i = 0,
    min = an === 'a' ? 10 : 0,
    max = an === 'n' ? 10 : 62;
  for (; i++ < len;) {
    var r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }
  return str;
}

function findIndex(array, name) {
  var i = 0,
    found = false;
  for (i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      found = i;
      break;
    }
  }
  return found;
}

function saveObject(db, object, cb) {
  var array = [];
  if (!localStorage[db]) {
    localStorage[db] = [];
  } else {
    array = JSON.parse(localStorage.getItem(db));
  }
  var exist = findIndex(array, object.name);
  if (exist) {
    return cb('El nombre ya existe.');
  } else {
    array.push(object);
  }

  localStorage.setItem(db, JSON.stringify(array));
  cb();
}

function deleteObject(db, object) {
  var array = [];
  if (!localStorage[db]) {
    localStorage[db] = [];
  } else {
    array = JSON.parse(localStorage.getItem(db));
  }

  array = array
    .filter(function(el) {
      return el.name !== object.name;
    });
  localStorage.setItem(db, JSON.stringify(array));
}
