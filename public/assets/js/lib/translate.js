/**********************************************************************************
	Class: Translate

	This class implements the translation functionality.
*/
Package('Spa', {
	Translate : new Class({
		globals : [],
		lookups : {},

	/**********************************************************************************
		Constructor: initialize

		Sets up the translation class
	*/
		initialize : function()
		{
			this.globals = window.globalReplacements?window.globalReplacements:{};
			this.lookups = window.lookups?$H(window.lookups):$H({});

			var qs = window.location.search.slice(window.location.search.indexOf('?') + 1).parseQueryString(true, true);

			this.marklar = qs.marklar;

			this.translateReplacements.delay(1, this);
			SPA.application.listen('ready', this.onReady.bind(this));
		},


		onReady : function()
		{
			this.translateDocument();
		},

		translateReplacements : function()
		{
			if (window.translatedReplacements)
			{
				window.translatedReplacements = $H(window.translatedReplacements)
				window.translatedReplacements.each(function(which)
				{
					if (this.globals.has(which)) this.globals.set(which, _T(this.globals.get(which)));
				}, this);
			}
		},

	/**********************************************************************************
		Method: lookup

		Called to find the translation for a given source string.

		Parameters:
			text		- the string to lookup

		Returns:
			the translated string, or the text that was passed in if it was not found.
	*/
		lookup : function(text)
		{
			if (!this.lookups.has(text))
			{
	//			console.log('missing translation', text);
				if (this.marklar == 'missing')
					return 'marklar';
			}
			return this.lookups.has(text)?this.lookups.get(text):text;
		},

	/**********************************************************************************
		Method: translateText

		Call this to translate the given string, using the given replacements.

		Parameters:
			text			- the string to lookup
			replacements	- a hash of the replacements to use

		Returns:
			the translated string with all replacements made
	*/
		translateText : function(text, replacements)
		{
			text = (text)?text:'';
			replacements = (replacements === undefined)?{}:replacements;

			text = this.lookup(text);

			if (this.marklar == 'sub')
				return text.substitute(replacements) + '-marklar';
			if (this.marklar == 'raw')
				return 'marklar';

			return text.substitute(replacements);
		},

	/**********************************************************************************
		Method: translateDocument

		Call this to translate the entire document. IT does this by finding every element
		with the class 'translate' and runs the innerHTML of that element through
		translateText. The class 'translate' is removed from those elements
	*/
		translateDocument : function()
		{
			$('.translate').each(function(idx, element)
			{
				element = $(element);
				var xlat = this.translateText(element.html());
				element.html(xlat);
			}.bind(this));

			$('.translate').removeClass('translate');


			$('[title]').each(function(idx, element)
			{
				element = $(element);
				var xlat = this.translateText(element.attr('title'));
				element.attr('title', xlat);
			}.bind(this));

			$('[placeholder]').each(function(idx, element)
			{
				element = $(element);
				try
				{
					var xlat = this.translateText(element.attr('placeholder'));
					element.attr('placeholder', xlat);
				}
				catch(e){};
			}.bind(this));


		}
	})
});

SPA.translate = new Spa.Translate();

/**********************************************************************************
	Function: _T

	Call this to translate the given string, using the given replacements. This
	is a shortcut for TRANSLATE.translateText.

	Parameters:
		text			- the string to lookup
		replacements	- a hash of the replacements to use

	Returns:
		the translated string with all replacements made
*/
function _T(text, replacements)
{
	return SPA.translate.translateText(text, replacements);
}
