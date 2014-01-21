

Date.implement({
	dateSequences :
	{
		  'AL' :	    'B',   // Albania
		  'DZ' :	    'L',   // Algeria
		  'AR' :      'L',   // Argentina
		  'AM' :      'L',   // Armenia
		  'AU' :      'L',   // Australia
		  'AT' :      'L',   // Austria
		  'AZ' :      'L',   // Azerbaijan
		  'BH' :      'L',   // Bahrain
		  'BS' :      'B',   // Basque
		  'BY' :      'L',   // Belarus
		  'BE' :      'L',   // Belgium
		  'BZ' :      'M',   // Belize
		  'BO' :      'L',   // Bolivia
		  'BR' :      'L',   // Brazil
		  'BG' :      'L',   // Bulgaria
		  'CA' :      'B',   // Canada
		  'CL' :      'L',   // Chile
		  'CN' :      'B',   // China
		  'CO' :      'L',   // Colombia
		  'CR' :      'L',   // Costa Rica
		  'HR' :      'L',   // Croatia
		  'CZ' :      'L',   // Czech Republic
		  'DK' :      'L',   // Denmark
		  'DO' :      'L',   // Dominican Republic
		  'EC' :      'L',   // Ecuador
		  'EG' :      'L',   // Egypt
		  'SV' :      'L',   // El Salvador
		  'EE' :      'L',   // Estonia
		  'FI' :      'L',   // Finland
		  'FR' :      'L',   // France
		  'GE' :      'L',   // Georgia
		  'DE' :      'B',   // Germany
		  'GR' :      'L',   // Greece
		  'GT' :      'L',   // Guatemala
		  'HN' :      'L',   // Honduras
		  'HK' :      'B',   // Hong Kong SAR
		  'HU' :      'B',   // Hungary
		  'IS' :      'L',   // Iceland
		  'IN' :      'L',   // India
		  'ID' :      'L',   // Indonesia
		  'IR' :      'B',   // Iran
		  'IQ' :      'L',   // Iraq
		  'IE' :      'L',   // Ireland
		  'IL' :      'L',   // Israel
		  'IT' :      'L',   // Italy
		  'JM' :      'L',   // Jamaica
		  'JP' :      'B',   // Japan
		  'JO' :      'L',   // Jordan
		  'KZ' :      'L',   // Kazakhstan
		  'KE' :      'B',   // Kenya
		  'KR' :      'B',   // Korea
		  'KW' :      'L',   // Kuwait
		  'KG' :      'L',   // Kyrgyzstan
		  'LV' :      'B',   // Latvia
		  'LB' :      'L',   // Lebanon
		  'LY' :      'L',   // Libya
		  'LT' :      'B',   // Lithuania
		  'LU' :      'L',   // Luxembourg
		  'MO' :      'B',   // Macao SAR
		  'MK' :      'L',   // Macedonia
		  'MY' :      'L',   // Malaysia
		  'MX' :      'L',   // Mexico
		  'MN' :      'B',   // Mongolia
		  'MA' :      'L',   // Morocco
		  'NL' :      'L',   // Netherlands
		  'NZ' :      'L',   // New Zealand
		  'NI' :      'L',   // Nicaragua
		  'NO' :      'L',   // Norway
		  'OM' :      'L',   // Oman
		  'PK' :      'L',   // Pakistan
		  'PA' :      'L',   // Panama
		  'PY' :      'L',   // Paraguay
		  'PE' :      'L',   // Peru
		  'PH' :      'M',   // Philippines
		  'PL' :      'L',   // Poland
		  'PT' :      'L',   // Portugal
		  'QA' :      'L',   // Qatar
		  'RO' :      'L',   // Romania
		  'RU' :      'L',   // Russia
		  'SA' :      'L',   // Saudi Arabia
		  'SP':	    'L',   // Serbia
		  'SG' :      'L',   // Singapore
		  'SK' :      'L',   // Slovakia
		  'SI' :      'B',   // Slovenia
		  'ZA' :      'B',   // South Africa
		  'ES' :      'L',   // Spain
		  'SE' :      'L',   // Sweden
		  'CH' :      'L',   // Switzerland
		  'SY' :      'L',   // Syria
		  'TW' :      'B',   // Taiwan
		  'TH' :      'L',   // Thailand
		  'TT' :      'L',   // Trinidad and Tobago
		  'TN' :      'L',   // Tunisia
		  'TR' :      'L',   // Turkey
		  'UA' :      'L',   // Ukraine
		  'AE' :      'L',   // United Arab Emirates
		  'GB' :      'L',   // United Kingdom
		  'US' :      'M',   // United States
		  'UY' :      'L',   // Uruguay
		  'UZ' :      'L',   // Uzbekistan
		  'VE' :      'L',   // Venezuela
		  'VN' :      'L',   // Vietnam
		  'YE' :      'L'    // Yemen
	},

	getDateSequence : function(country)
	{
		if (country in this.dateSequences)
			return this.dateSequences[country];
		else return 'M';
	},

	age : function (date)
	{
		var DoB = date.getTime();
		var DoC = this.getTime();

		var ToDate = new Date();
		var ToDateYr = ToDate.getFullYear();

		var DateofB = date;
		var DoBYr = DateofB.getFullYear();
		var DoBMo = DateofB.getMonth();
		var DoBDy = DateofB.getDate();

		var DateofC = new Date(DoC);
		var DoCYr = DateofC.getFullYear();
		var DoCMo = DateofC.getMonth();
		var DoCDy = DateofC.getDate();

		if (DoB > DoC)
			return {error: "The Date of Birth is after the specified date."};

		if (DoC > ToDate)
			return {error: "The specified date is in the future."};

		var AgeDays = 0;
		var AgeWeeks = 0;
		var AgeMonth = 0;
		var AgeYears = 0;
		var AgeRmdr = 0;

		mSecDiff = DoC - DoB;
		AgeDays = mSecDiff / 86400000;
		AgeWeeks = AgeDays / 7;
		AgeMonth = AgeDays / 30.4375;
		AgeYears = AgeDays / 365.24;
		AgeYears = Math.floor(AgeYears);
		AgeRmdr = (AgeDays - AgeYears * 365.24) / 30.4375;

		AgeDays = Math.round(AgeDays * 10) / 10;
		AgeWeeks = Math.round(AgeWeeks * 10) / 10;
		AgeMonth = Math.round(AgeMonth * 10) / 10;
		AgeRmdr = Math.round(AgeRmdr * 10) / 10;

		return {days: AgeDays, weeks: AgeWeeks, months: AgeMonth, years: AgeYears, remainder: AgeRmdr};
	}
});
