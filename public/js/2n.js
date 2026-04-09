function getRandom(a, b) {
    return Math.floor(Math.random() * (b - a)) + a
  }
  function newgenerateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    });
    console.log(uuid, 'uuid====================');
    return uuid
  };
  function getRandomKey(a) {
    let b = "";
    let c = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let d = c.length;
    for (let i = 0; i < a; i++) {
      pos = getRandom(0, d);
      b += c[pos]
    }
    return b
  }
  
  function getFixedString(a) {
    let b = "0000";
    let c = a.length;
    return b.substring(0, (4 - c)) + a
  }
  
  function dataEncryptSM2(a) {
    let b = new Date().getTime().toString(16);
    a = encryptbySM2(a + b, "04a42997c52be9e66280df06e1a138947e21c7f9ba670226b6323e2d5276bf3f29cb36f38fcaa23a22519ff276ee908a82da28190dadb2e477ba54e47edf8b19b2");
    return a
  }
  
  function dataEncryptSM2New(a, b) {
    let d = newgenerateUUID();
    a = encryptbySM2(a + b + d, "04a42997c52be9e66280df06e1a138947e21c7f9ba670226b6323e2d5276bf3f29cb36f38fcaa23a22519ff276ee908a82da28190dadb2e477ba54e47edf8b19b2");
    // debugger
    console.log(a, 'a===========');
    console.log(d, 'd===========');
    // debugger
    return a
  }
  
  function dataEncryptSM4(a) {
    let b = 4;
    let c = 16;
    let d = 11;
    let e = new Date().getTime().toString(16);
    let f = getRandomKey(c);
    //let g = encryptbySM4(a, f);
    let g = encryptbySM4_CDC(a, f);
    let h = encryptbySM3(a + f);
    let j = g.length;
    let k = getRandom(0, g.length + h.length + d);
    let l = getFixedString(k.toString(16));
    let m = parseInt(j, 16);
    let n = f + getFixedString(j.toString(16));
    let o = g + h + e;dataEncryptSM4
    o = o.substring(0, k) + n + o.substring(k) + l;
    let p = o.length;
    let q = p % 2 == 1 ? true : false;
    let r = "";
    let s, cs2;
    s = o.substring(0, p / 2);
    cs2 = o.substring(p / 2, p);
    let t = s.length;
    let u = cs2.length;
    for (let i = 0; i < Math.max(t, u); i++) {
      if (q) {
        if (i < t) {
          r += s.charAt(i)
        }
        r += cs2.charAt(i)
      } else {
        r += cs2.charAt(i);
        r += s.charAt(i)
      }
    }
    o = r;
    return o
  }
  
  function dataDecryptSM4(plainText) {
    if (plainText != null && plainText != '' && plainText != undefined) {
      let a1 = '';
      let a2 = '';
      for (let i = 0; i < plainText.length; i++) {
        if (i < 32) {
          if ((i % 2) == 0) {
            a1 = a1 + plainText.substring(i + 0, i + 1)
          } else {
            a2 = a2 + plainText.substring(i + 0, i + 1)
          }
        } else {
          a2 = a2 + plainText.substring(i + 0, i + 1)
        }
      }
      return decryptData_CBC(a2, a1)
    }
    return ''
  }
  
  function encryptbySM4_CDC(a, f) {
    let s4 = new SM4Util(f);
    return s4.encryptData_CBC(a);
  }
  
  function decryptData_CBC(a, f) {
    let s4 = new SM4Util(f);
    return s4.decryptData_CBC(a);
  }
  
  