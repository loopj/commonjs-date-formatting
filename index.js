/*
 strftime for Javascript
 Copyright (c) 2008, Philip S Tellis <philip@bluesmoon.info>
 All rights reserved.
 
 This code is distributed under the terms of the BSD licence
 
 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

   * Redistributions of source code must retain the above copyright notice, this list of conditions
     and the following disclaimer.
   * Redistributions in binary form must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other materials provided
     with the distribution.
   * The names of the contributors to this file may not be used to endorse or promote products
     derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Date.ext = {};

//! Utility methods
Date.ext.util = {};

/**
\brief Left pad a number with something
\details Takes a number and pads it to the left with the passed in pad character
\param x  The number to pad
\param pad  The string to pad with
\param r  [optional] Upper limit for pad.  A value of 10 pads to 2 digits, a value of 100 pads to 3 digits.
    Default is 10.

\return The number left padded with the pad character.  This function returns a string and not a number.
*/
Date.ext.util.xPad=function(x, pad, r)
{
  if(typeof(r) == 'undefined')
  {
    r=10;
  }
  for( ; parseInt(x, 10)<r && r>1; r/=10)
    x = pad.toString() + x;
  return x.toString();
};

/**
\brief Currently selected locale.
\details
The locale for a specific date object may be changed using \code Date.locale = "new-locale"; \endcode
The default will be based on the lang attribute of the HTML tag of your document
*/
Date.prototype.locale = 'en-GB';
//! \cond FALSE
if(document.getElementsByTagName('html') && document.getElementsByTagName('html')[0].lang)
{
  Date.prototype.locale = document.getElementsByTagName('html')[0].lang;
}
//! \endcond

/**
\brief Localised strings for days of the week and months of the year.
\details
To create your own local strings, add a locale object to the locales object.
The key of your object should be the same as your locale name.  For example:
   en-US,
   fr,
   fr-CH,
   de-DE
Names are case sensitive and are described at http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
Your locale object must contain the following keys:
\param a  Short names of days of week starting with Sunday
\param A  Long names days of week starting with Sunday
\param b  Short names of months of the year starting with January
\param B  Long names of months of the year starting with February
\param c  The preferred date and time representation in your locale
\param p  AM or PM in your locale
\param P  am or pm in your locale
\param x  The  preferred date representation for the current locale without the time.
\param X  The preferred time representation for the current locale without the date.

\sa Date.ext.locales.en for a sample implementation
\sa \ref localisation for detailed documentation on localising strftime for your own locale
*/
Date.ext.locales = { };

/**
 * \brief Localised strings for English (British).
 * \details
 * This will be used for any of the English dialects unless overridden by a country specific one.
 * This is the default locale if none specified
 */
Date.ext.locales.en = {
  a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  c: '%a %d %b %Y %T %Z',
  p: ['AM', 'PM'],
  P: ['am', 'pm'],
  x: '%d/%m/%y',
  X: '%T'
};

//! \cond FALSE
// Localised strings for US English
Date.ext.locales['en-US'] = Date.ext.locales.en;
Date.ext.locales['en-US'].c = '%a %d %b %Y %r %Z';
Date.ext.locales['en-US'].x = '%D';
Date.ext.locales['en-US'].X = '%r';

// Localised strings for British English
Date.ext.locales['en-GB'] = Date.ext.locales.en;

// Localised strings for Australian English
Date.ext.locales['en-AU'] = Date.ext.locales['en-GB'];
//! \endcond

//! \brief List of supported format specifiers.
/**
 * \details
 * \arg \%a - abbreviated weekday name according to the current locale
 * \arg \%A - full weekday name according to the current locale
 * \arg \%b - abbreviated month name according to the current locale
 * \arg \%B - full month name according to the current locale
 * \arg \%c - preferred date and time representation for the current locale
 * \arg \%C - century number (the year divided by 100 and truncated to an integer, range 00 to 99)
 * \arg \%d - day of the month as a decimal number (range 01 to 31)
 * \arg \%D - same as %m/%d/%y
 * \arg \%e - day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')
 * \arg \%g - like %G, but without the century
 * \arg \%G - The 4-digit year corresponding to the ISO week number
 * \arg \%h - same as %b
 * \arg \%H - hour as a decimal number using a 24-hour clock (range 00 to 23)
 * \arg \%I - hour as a decimal number using a 12-hour clock (range 01 to 12)
 * \arg \%j - day of the year as a decimal number (range 001 to 366)
 * \arg \%m - month as a decimal number (range 01 to 12)
 * \arg \%M - minute as a decimal number
 * \arg \%n - newline character
 * \arg \%p - either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale
 * \arg \%P - like %p, but lower case
 * \arg \%r - time in a.m. and p.m. notation equal to %I:%M:%S %p
 * \arg \%R - time in 24 hour notation equal to %H:%M
 * \arg \%S - second as a decimal number
 * \arg \%t - tab character
 * \arg \%T - current time, equal to %H:%M:%S
 * \arg \%u - weekday as a decimal number [1,7], with 1 representing Monday
 * \arg \%U - week number of the current year as a decimal number, starting with
 *            the first Sunday as the first day of the first week
 * \arg \%V - The ISO 8601:1988 week number of the current year as a decimal number,
 *            range 01 to 53, where week 1 is the first week that has at least 4 days
 *            in the current year, and with Monday as the first day of the week.
 * \arg \%w - day of the week as a decimal, Sunday being 0
 * \arg \%W - week number of the current year as a decimal number, starting with the
 *            first Monday as the first day of the first week
 * \arg \%x - preferred date representation for the current locale without the time
 * \arg \%X - preferred time representation for the current locale without the date
 * \arg \%y - year as a decimal number without a century (range 00 to 99)
 * \arg \%Y - year as a decimal number including the century
 * \arg \%z - numerical time zone representation
 * \arg \%Z - time zone name or abbreviation
 * \arg \%% - a literal `\%' character
 */
Date.ext.formats = {
  a: function(d) { return Date.ext.locales[d.locale].a[d.getDay()]; },
  A: function(d) { return Date.ext.locales[d.locale].A[d.getDay()]; },
  b: function(d) { return Date.ext.locales[d.locale].b[d.getMonth()]; },
  B: function(d) { return Date.ext.locales[d.locale].B[d.getMonth()]; },
  c: 'toLocaleString',
  C: function(d) { return Date.ext.util.xPad(parseInt(d.getFullYear()/100, 10), 0); },
  d: ['getDate', '0'],
  e: ['getDate', ' '],
  g: function(d) { return Date.ext.util.xPad(parseInt(Date.ext.util.G(d)/100, 10), 0); },
  G: function(d) {
      var y = d.getFullYear();
      var V = parseInt(Date.ext.formats.V(d), 10);
      var W = parseInt(Date.ext.formats.W(d), 10);

      if(W > V) {
        y++;
      } else if(W===0 && V>=52) {
        y--;
      }

      return y;
    },
  H: ['getHours', '0'],
  I: function(d) { var I=d.getHours()%12; return Date.ext.util.xPad(I===0?12:I, 0); },
  j: function(d) {
      var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
      ms += d.getTimezoneOffset()*60000;
      var doy = parseInt(ms/60000/60/24, 10)+1;
      return Date.ext.util.xPad(doy, 0, 100);
    },
  m: function(d) { return Date.ext.util.xPad(d.getMonth()+1, 0); },
  M: ['getMinutes', '0'],
  p: function(d) { return Date.ext.locales[d.locale].p[d.getHours() >= 12 ? 1 : 0 ]; },
  P: function(d) { return Date.ext.locales[d.locale].P[d.getHours() >= 12 ? 1 : 0 ]; },
  S: ['getSeconds', '0'],
  u: function(d) { var dow = d.getDay(); return dow===0?7:dow; },
  U: function(d) {
      var doy = parseInt(Date.ext.formats.j(d), 10);
      var rdow = 6-d.getDay();
      var woy = parseInt((doy+rdow)/7, 10);
      return Date.ext.util.xPad(woy, 0);
    },
  V: function(d) {
      var woy = parseInt(Date.ext.formats.W(d), 10);
      var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
      // First week is 01 and not 00 as in the case of %U and %W,
      // so we add 1 to the final result except if day 1 of the year
      // is a Monday (then %W returns 01).
      // We also need to subtract 1 if the day 1 of the year is 
      // Friday-Sunday, so the resulting equation becomes:
      var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
      if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
      {
        idow = 1;
      }
      else if(idow === 0)
      {
        idow = Date.ext.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
      }

      return Date.ext.util.xPad(idow, 0);
    },
  w: 'getDay',
  W: function(d) {
      var doy = parseInt(Date.ext.formats.j(d), 10);
      var rdow = 7-Date.ext.formats.u(d);
      var woy = parseInt((doy+rdow)/7, 10);
      return Date.ext.util.xPad(woy, 0, 10);
    },
  y: function(d) { return Date.ext.util.xPad(d.getFullYear()%100, 0); },
  Y: 'getFullYear',
  z: function(d) {
      var o = d.getTimezoneOffset();
      var H = Date.ext.util.xPad(parseInt(Math.abs(o/60), 10), 0);
      var M = Date.ext.util.xPad(o%60, 0);
      return (o>0?'-':'+') + H + M;
    },
  Z: function(d) { return d.toString().replace(/^.*\(([^)]+)\)$/, '$1'); },
  '%': function(d) { return '%'; }
};

/**
\brief List of aggregate format specifiers.
\details
Aggregate format specifiers map to a combination of basic format specifiers.
These are implemented in terms of Date.ext.formats.

A format specifier that maps to 'locale' is read from Date.ext.locales[current-locale].

\sa Date.ext.formats
*/
Date.ext.aggregates = {
  c: 'locale',
  D: '%m/%d/%y',
  h: '%b',
  n: '\n',
  r: '%I:%M:%S %p',
  R: '%H:%M',
  t: '\t',
  T: '%H:%M:%S',
  x: 'locale',
  X: 'locale'
};

//! \cond FALSE
// Cache timezone values because they will never change for a given JS instance
Date.ext.aggregates.z = Date.ext.formats.z(new Date());
Date.ext.aggregates.Z = Date.ext.formats.Z(new Date());
//! \endcond

//! List of unsupported format specifiers.
/**
 * \details
 * All format specifiers supported by the PHP implementation are supported by
 * this javascript implementation.
 */
Date.ext.unsupported = { };


/**
 * \brief Formats the date according to the specified format.
 * \param fmt The format to format the date in.  This may be a combination of the following:
 * \copydoc formats
 *
 * \return  A string representation of the date formatted based on the passed in parameter
 * \sa http://www.php.net/strftime for documentation on format specifiers
*/
Date.prototype.strftime=function(fmt)
{
  // Fix locale if declared locale hasn't been defined
  // After the first call this condition should never be entered unless someone changes the locale
  if(!(this.locale in Date.ext.locales))
  {
    if(this.locale.replace(/-[a-zA-Z]+$/, '') in Date.ext.locales)
    {
      this.locale = this.locale.replace(/-[a-zA-Z]+$/, '');
    }
    else
    {
      this.locale = 'en-GB';
    }
  }

  var d = this;
  // First replace aggregates
  while(fmt.match(/%[cDhnrRtTxXzZ]/))
  {
    fmt = fmt.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1)
        {
          var f = Date.ext.aggregates[m1];
          return (f == 'locale' ? Date.ext.locales[d.locale][m1] : f);
        });
  }


  // Now replace formats - we need a closure so that the date object gets passed through
  var str = fmt.replace(/%([aAbBCdegGHIjmMpPSuUVwWyY%])/g, function(m0, m1) 
      {
        var f = Date.ext.formats[m1];
        if(typeof(f) == 'string') {
          return d[f]();
        } else if(typeof(f) == 'function') {
          return f.call(d, d);
        } else if(typeof(f) == 'object' && typeof(f[0]) == 'string') {
          return Date.ext.util.xPad(d[f[0]](), f[1]);
        } else {
          return m1;
        }
      });
  d=null;
  return str;
};