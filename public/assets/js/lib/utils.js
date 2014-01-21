
var Utils = new Class({

	countryCodes :
	{
		'sq_AL' :	     'AL',
		'ar_DZ' :	     'DZ',
		'es_AR' :      'AR',
		'hy_AM' :      'AM',
		'en_AU' :      'AU',
		'de_AT' :      'AT',
		'az_AZ' :      'AZ',
		'ar_BH' :      'BH',
		'eu_ES' :      'ES',
		'be_BY' :      'BY',
		'fr_BE' :      'BE',
		'nl_BE' :      'BE',
		'en_BZ' :      'BZ',
		'es_BO' :      'BO',
		'pt_BR' :      'BR',
		'bg_BG' :      'BG',
		'en_CA' :      'CA',
		'fr_CA' :      'CA',
		'es_CL' :      'CL',
		'zh_CN' :      'CN',
		'zh_HK' :      'HK',
		'zh_TW' :      'TW',
		'es_CO' :      'CO',
		'es_CR' :      'CR',
		'hr_HR' :      'HR',
		'cs_CZ' :      'CZ',
		'da_DK' :      'DK',
		'es_DO' :      'DO',
		'es_EC' :      'EC',
		'ar_EG' :      'EG',
		'es_SV' :      'SV',
		'et_EE' :      'EE',
		'fi_FI' :      'FI',
		'sv_FI' :      'FI',
		'fr_FR' :      'FR',
		'ka_GE' :      'GE',
		'de_DE' :      'DE',
		'el_GR' :      'GR',
		'es_GT' :      'GT',
		'es_HN' :      'HN',
		'hu_HU' :      'HU',
		'is_IS' :      'IS',
		'gu_IN' :      'IN',
		'hi_IN' :      'IN',
		'kn_IN' :      'IN',
		'kok_IN' :     'IN',
		'mr_IN' :      'IN',
		'pa_IN' :      'IN',
		'sa_IN' :      'IN',
		'ta_IN' :      'IN',
		'te_IN' :      'IN',
		'id_ID' :      'ID',
		'fa_IR' :      'IR',
		'ar_IQ' :      'IQ',
		'en_IE' :      'IE',
		'he_IL' :      'IL',
		'it_IT' :      'IT',
		'en_JM' :      'JM',
		'ja_JP' :      'JP',
		'ar_JO' :      'JO',
		'kk_KZ' :      'KZ',
		'sw_KE' :      'KE',
		'ko_KR' :      'KR',
		'ar_KW' :      'KW',
		'ky_KG' :      'KG',
		'lv_LV' :      'LV',
		'ar_LB' :      'LB',
		'ar_LY' :      'LY',
		'lt_LT' :      'LT',
		'de_LU' :      'LU',
		'fr_LU' :      'LU',
		'zh_MO' :      'MO',
		'mk_MK' :      'MK',
		'ms_MY' :      'MY',
		'es_MX' :      'MX',
		'mn_MN' :      'MN',
		'ar_MA' :      'MA',
		'nl-NL' :      'NL',
		'en_NZ' :      'NZ',
		'es_NI' :      'NI',
		'nn_NO' :      'NO',
		'ar_OM' :      'OM',
		'ur_PK' :      'PK',
		'es_PA' :      'PA',
		'es_PY' :      'PY',
		'es_PE' :      'PE',
		'en_PH' :      'PH',
		'pl_PL' :      'PL',
		'pt_PT' :      'PT',
		'ar_QA' :      'QA',
		'ro_RO' :      'RO',
		'ru_RU' :      'RU',
		'tt_RU' :      'RU',
		'ar_SA' :      'SA',
		'sr_SP_Cyrl':	'SP',
		'sr_SP_Latn':	'SP',
		'zh_SG' :      'SG',
		'sk_SK' :      'SK',
		'sl_SI' :      'SI',
		'en_ZA' :      'ZA',
		'af_ZA' :      'ZA',
		'es_ES' :      'ES',
		'sv_SE' :      'SE',
		'de_CH' :      'CH',
		'fr_CH' :      'CH',
		'it_CH' :      'CH',
		'ar_SY' :      'SY',
		'syr_SY' :     'SY',
		'th_TH' :      'TH',
		'en_TT' :      'TT',
		'ar_TN' :      'TN',
		'tr_TR' :      'TR',
		'uk_UA' :      'UA',
		'ar_AE' :      'AE',
		'en_GB' :      'GB',
		'en_US' :      'US',
		'es_UY' :      'UY',
		'uz_UZ_Cyrl' : 'UZ',
		'uz_UZ_Latn' : 'UZ',
		'es_VE' :      'VE',
		'vi_VN' :      'VN',
		'ar_YE' :      'YE'
	},

	countries :
	{
		'AL' :	    'Albania',
		'DZ' :	    'Algeria',
		'AR' :      'Argentina',
		'AM' :      'Armenia',
		'AU' :      'Australia',
		'AT' :      'Austria',
		'AZ' :      'Azerbaijan',
		'BH' :      'Bahrain',
		'BS' :      'Basque',
		'BY' :      'Belarus',
		'BE' :      'Belgium',
		'BZ' :      'Belize',
		'BO' :      'Bolivia',
		'BR' :      'Brazil',
		'BG' :      'Bulgaria',
		'CA' :      'Canada',
		'CL' :      'Chile',
		'CN' :      'China',
		'CO' :      'Colombia',
		'CR' :      'Costa Rica',
		'HR' :      'Croatia',
		'CZ' :      'Czech Republic',
		'DK' :      'Denmark',
		'DO' :      'Dominican Republic',
		'EC' :      'Ecuador',
		'EG' :      'Egypt',
		'SV' :      'El Salvador',
		'EE' :      'Estonia',
		'FI' :      'Finland',
		'FR' :      'France',
		'GE' :      'Georgia',
		'DE' :      'Germany',
		'GR' :      'Greece',
		'GT' :      'Guatemala',
		'HN' :      'Honduras',
		'HK' :      'Hong Kong',
		'HU' :      'Hungary',
		'IS' :      'Iceland',
		'IN' :      'India',
		'ID' :      'Indonesia',
		'IR' :      'Iran',
		'IQ' :      'Iraq',
		'IE' :      'Ireland',
		'IL' :      'Israel',
		'IT' :      'Italy',
		'JM' :      'Jamaica',
		'JP' :      'Japan',
		'JO' :      'Jordan',
		'KZ' :      'Kazakhstan',
		'KE' :      'Kenya',
		'KR' :      'Korea',
		'KW' :      'Kuwait',
		'KG' :      'Kyrgyzstan',
		'LV' :      'Latvia',
		'LB' :      'Lebanon',
		'LY' :      'Libya',
		'LT' :      'Lithuania',
		'LU' :      'Luxembourg',
		'MO' :      'Macao SAR',
		'MK' :      'Macedonia',
		'MY' :      'Malaysia',
		'MX' :      'Mexico',
		'MN' :      'Mongolia',
		'MA' :      'Morocco',
		'NL' :      'The Netherlands',
		'NZ' :      'New Zealand',
		'NI' :      'Nicaragua',
		'NO' :      'Norway',
		'OM' :      'Oman',
		'PK' :      'Pakistan',
		'PA' :      'Panama',
		'PY' :      'Paraguay',
		'PE' :      'Peru',
		'PH' :      'Philippines',
		'PL' :      'Poland',
		'PT' :      'Portugal',
		'QA' :      'Qatar',
		'RO' :      'Romania',
		'RU' :      'Russia',
		'SA' :      'Saudi Arabia',
		'SP':	  'Serbia',
		'SG' :      'Singapore',
		'SK' :      'Slovakia',
		'SI' :      'Slovenia',
		'ZA' :      'South Africa',
		'ES' :      'Spain',
		'SE' :      'Sweden',
		'CH' :      'Switzerland',
		'SY' :      'Syria',
		'TW' :      'Taiwan',
		'TH' :      'Thailand',
		'TT' :      'Trinidad',
		'TN' :      'Tunisia',
		'TR' :      'Turkey',
		'UA' :      'Ukraine',
		'AE' :      'United Arab Emirates',
		'GB' :      'United Kingdom',
		'US' :      'United States',
		'UY' :      'Uruguay',
		'UZ' :      'Uzbekistan',
		'VE' :      'Venezuela',
		'VN' :      'Vietnam',
		'YE' :      'Yemen'
	},


	addCommas : function(str)
	{
		str += '';
		x = str.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},

	validateEmailAddress : function(address)
	{
	   var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	   return pattern.test(address);
	},

	replaceAll : function(string, search, replace)
	{
		while (string.indexOf(search) != -1)
			string = string.replace(search, replace);

		return string;
	},

	replaceFields : function(string, replacements)
	{
		var replacements = $H(replacements);
		replacements.each(function(replace, search)
		{
			string = this.replaceAll(string, '{' + search + '}', replace);
		}, this);

		return string;
	},

	padDigits : function(n, totalDigits)
	{
	    n = n.toString();
	    var pd = '';
	    if (totalDigits > n.length)
	    {
	        for (i=0; i < (totalDigits-n.length); i++)
	        {
	            pd += '0';
	        }
	    }
	    return pd + n.toString();
	},

	capitaliseFirstLetter : function(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	getTimerString : function(time, surpressSeconds, supressZero)
	{
	    time = time / 1000;
	    if (time < 0) time = 0;
	    if (time == 0 && supressZero)
	        return '';

	    var hours = Math.floor(time / 3600);
	    time -= hours * 3600
	    var minutes = Math.floor(time / 60);
	    var seconds = Math.floor(time % 60);
	    var result = '';

  	    if (hours > 0)
	    {
	        result = hours + ':';
	        if (minutes < 10) result += '0';
	    }

	    result += minutes;
	    if (!surpressSeconds)
	    {
	        result += ':';
	        if (seconds < 10) result += '0';
	        result += seconds;
	    }
	    return result;
	},

	getCountry : function(code)
	{
		if (code in this.countryCodes)
			return this.countryCodes[code];
		else return 'none';
	},

	getDistance : function(point1, point2)
	{
		var R = 6371;

		var x = (point2.lng - point2.lng) * Math.cos((point1.lat+point2.lat) / 2);
		var y = (point2.lat - point1.lat);
		var d = Math.sqrt(x*x + y*y) * R;

		return d;
	}
});

UTILS = new Utils();
