
/*****************************************************************************
Class: AjaxService

Use this class as a mixin to support ajax in your service. The outer class
is assumed to extend EventManager at some level.

Fires:
	ajaxResponse	- passed the response from the service
	ajaxError		- passed jqXHR, textStatus, errorThrown
*****************************************************************************/


Package('Spa.Services', {
	AjaxService : new Class({
		initializeAjaxService : function()
		{
		},

		call : function(which, data, callback, method, type)
		{
			method = (method=== undefined)?'POST':method;
			type = (type === 'iframe')?'json':type;
			type = (type === undefined)?'json':type;
			$.ajax({
				data: data,
				dataType: type,
				error: this.onAjaxError.bind(this, callback),
				success: this.onAjaxSuccess.bind(this, callback),
				type: method,
				url: which
			});
		},

		onAjaxSuccess : function(callback, response)
		{
			console.log('ajaxSuccess', response);
			if (callback) callback(response);
			this.fire('ajaxResponse', response);
		},

		onAjaxError : function(callback, jqXHR, textStatus, errorThrown)
		{
			console.log('ajaxError', jqXHR, textStatus, errorThrown);
			if (callback) callback(null);
			this.fire('ajaxError', jqXHR, textStatus, errorThrown);
		}
	})
});
