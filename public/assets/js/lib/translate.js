/**********************************************************************************
	Class: Translate

	This class implements the translation functionality.
*/
Package('Sapphire', {
	Translate : new Class({
		globals : {},
		translations : {},

	/**********************************************************************************
		Constructor: initialize

		Sets up the translation class
	*/
		initialize : function()
		{
			this.globals = window.replacements?window.replacements:{};
			this.translations = window.translations?$H(window.translations):$H({});

			var qs = window.location.search.slice(window.location.search.indexOf('?') + 1).parseQueryString(true, true);

			this.marklar = qs.marklar;

			this.translateReplacements.delay(1, this);
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listenPageEvent('load', '', this.onLoad.bind(this, 'page'));
			SAPPHIRE.application.listenDialogEvent('load', '', this.onLoad.bind(this, 'dialog'));
		},


		onStart : function(finish)
		{
			this.translateDocument();
			SAPPHIRE.application.panels.each(function(panel, name)
			{
				SAPPHIRE.application.listenPanelEvent('load', name, '', this.onLoad.bind(this, 'panel'));
			}, this);

			finish();
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
			if (!this.translations.has(text))
			{
	//			console.log('missing translation', text);
				if (this.marklar == 'missing')
					return 'marklar';
			}
			return this.translations.has(text)?this.translations.get(text):text;
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

		Call this to translate the entire document. It does this by finding every element
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
		},

		onLoad : function(type)
		{
			console.log('translate::onLoad', type);
			this.translateDocument();
		}
	})
});


SAPPHIRE.translate = new Sapphire.Translate();

/**********************************************************************************
	Function: _T

	Call this to translate the given string, using the given replacements. This
	is a shortcut for SAPPHIRE.translate.translateText.

	Parameters:
		text			- the string to lookup
		replacements	- a hash of the replacements to use

	Returns:
		the translated string with all replacements made
*/
function _T(text, replacements)
{
	return SAPPHIRE.translate.translateText(text, replacements);
}
