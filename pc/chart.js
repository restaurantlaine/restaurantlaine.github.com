//
// chart.js from passwordchart.com
//
// (C)opyright 2006 by Doug Martin, All Rights Reserved.
//

// globals
var getSeedTimeout = null;
var getPwdTimeout = null;
var garbageTable = new Array();

function getLetter(mt) 
{
  if (mt.randomInRange(0,1))
    // don't use l or o as they look like the numbers 1 and 0
    return 'abcdefghijkmnpqrstuvwxyz'.charAt(mt.randomInRange(0,23));
  else
    // don't use O and Z as they look like 0 and 2
    return 'ABCDEFGHIJKLMNPQRSTUVWXY'.charAt(mt.randomInRange(0,23));
}

function getNumber(mt) {
  // don't use 0, 1, 2 and 5 as they look like letters
  return '346789'.charAt(mt.randomInRange(0,5));
}

function getPunct(mt) {
  return '~!@#$%^&*_+?'.charAt(mt.randomInRange(0,11));
}

function getCharacter(mt, useNumbers, usePunct)
{
  while (1) {
    switch (mt.randomInRange(0,3)) {
      case 0:
      case 1: return getLetter(mt);
      case 2: 
        if (useNumbers) 
          return getNumber(mt);
        break;
      case 3: 
        if (usePunct) 
          return getPunct(mt);
        break;
    }
  }
}

function getGarbage(mt, useNumbers, usePunct)
{
  var i;
  var garbage = "";

  var len = mt.randomInRange(1,3);
  for (i=0; i < len; i++) {
    character = getCharacter(mt, useNumbers, usePunct);
    // thanks to Steve West for finding and reporting this bug! 
    if (character == "&")
      character = "&amp;";
    garbage += character;
  }

  return garbage;
}

function translatePwd()
{
  // prevent a timeout if we are manually running this function
  if (getPwdTimeout != null) 
  {
    clearInterval(getPwdTimeout);
    getPwdTimeout = null;
  }

  // grab the seed and the password
  var seed = document.forms[0].elements['seed'].value;
  var pwd = document.forms[0].elements['pwd'].value.toUpperCase();

  var chartedResults = document.getElementById('chartResults');

  if (seed.length > 0) 
  {
    if (pwd.length > 0) 
    {
      var results = "Results of the password conversion using the chart: <p><table cellpadding=5 cellspacing=0 id='resultTable'><tr>";
      var password = "";

      var ord0 = '0'.charCodeAt(0);
      var ordA = 'A'.charCodeAt(0);
      var i;
      for (i=0; i<pwd.length; i++) {

        // get the character
        var character = pwd.charAt(i);
        results += "<td><b>" + character + "</b>";

        // get the index into the garbage table for the character
        var garbageIndex = -1;
        if ((character >= '0') && (character <= '9'))
          garbageIndex = 26 + (character.charCodeAt(0) - ord0);
        else if ((character >= 'A') && (character <= 'Z'))
          garbageIndex = character.charCodeAt(0) - ordA;

        // if the character is in the garbageTable then add it to the password
        if (garbageIndex != -1) {
          password += garbageTable[garbageIndex];
          results += "<br><font color='FF0000'>" + garbageTable[garbageIndex] + "</font>";
        }
        
        results += "</td>";
      }
      results += "</tr></table></p><p>Use <span style='font-family:Courier; color:#FF0000; font-size:15pt'>" + password + "</span> as your password.</p>";

      chartedResults.innerHTML = results;
    }
    else
      chartedResults.innerHTML = "<font color='#FF0000'>Now enter a password to convert using the chart.<p>This should be an easy to remember word.</font>";
  }
  else if (pwd.length == 0)
    chartedResults.innerHTML = "<font color='#FF0000'>Enter a phrase to create the chart and a password to convert.<p>Some example phrases:<p>&quot;What me worry?&quot; and &quot;I like green eggs and ham&quot;</font>";
  else
    chartedResults.innerHTML = "<font color='#FF0000'>Now enter a phrase to create the chart.<p>Some example phrases:<p>&quot;What me worry?&quot; and &quot;I like green eggs and ham&quot;</font>";

  displayChart();
}

function makeChart()
{
  // prevent a timeout if we are manually running this function
  if (getSeedTimeout != null) 
  {
    clearInterval(getSeedTimeout);
    getSeedTimeout = null;
  }

  var seed = document.forms[0].elements['seed'].value;
  if (seed.length > 0) 
  {
    // hash the seed phrase and use the first 4 bytes as the random number seed.
    // The Mersenne Twister masks off everything above the first 4 bytes.
    var seedHash = parseInt(hex_md5(seed).substr(0,8), 16);

    // seed the random number generator with the new seed
    var mt = new MersenneTwister(seedHash);

    // get the options from the user
    var useNumbers = document.forms[0].elements['numbers'].checked;
    var usePunct = document.forms[0].elements['punct'].checked;

    // generate and display the chart number
    var quartile = (useNumbers || usePunct ? (useNumbers && usePunct ? 4 : (usePunct ? 3 : 2)) : 1);
    document.getElementById('chartNumber').innerHTML = 'Password Chart # ' + (seedHash * quartile);

    // fill all the cells of the garbage table
    var i;
    for (i=0; i<36; i++)
      garbageTable[i] = getGarbage(mt, useNumbers, usePunct);
  }
  else
    document.getElementById('chartNumber').innerHTML = '&nbsp;';

  // translate the password
  translatePwd();
}

function displayChart() {

  var chart = "<table cellspacing=3 cellpadding=3>";

  var seed = document.forms[0].elements['seed'].value;
  if (seed.length > 0) 
  {
    var pwd = document.forms[0].elements['pwd'].value.toUpperCase();

    var i;
    var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (i=0; i<36; i++) {
      if (i % 4 == 0)
        chart += "<tr>";
      chart += "<td width=75><b>" + keys.charAt(i) + "</b>: ";

      // if the cell is in the current password highlight it 
      if (pwd.indexOf(keys.charAt(i)) != -1)
        chart += ("<font color='FF0000'>" + garbageTable[i] + "</font></td>");
      else
        chart += garbageTable[i];

      chart += "</td>";
      if ((i+1) % 4 == 0)
        chart += "</tr>";
    }
    chart += "</table>";

    document.getElementById('chart').innerHTML = chart;
  }
  else {
    // create an empty chart
    for (i=0; i<9; i++) {
      chart += "<tr>";
      for (j=0; j<4; j++)
        chart += "<td width=75>&nbsp;</td>";
      chart += "</tr>";
    }
    chart += "</table>";
  }

  document.getElementById('chart').innerHTML = chart;
}

function seedKeypressed(e) {
  // stop the old timer
  if (getSeedTimeout != null)
    clearInterval(getSeedTimeout);

  // start a new timer
  getSeedTimeout = setInterval('makeChart();', 50);
}

function pwdKeypressed(e) {
  // stop the old timer
  if (getPwdTimeout != null)
    clearInterval(getPwdTimeout);

  // start a new timer
  getPwdTimeout = setInterval('translatePwd();', 50);
}

