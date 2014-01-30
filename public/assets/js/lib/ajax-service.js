
/*****************************************************************************
Class: AjaxService

Use this class as a mixin to support ajax in your service. The outer class
is assumed to extend Eventer at some level.

Fires:
	ajaxResponse	- passed the response from the service
	ajaxError		- passed jqXHR, textStatus, errorThrown
*****************************************************************************/


Package('Sapphire.Services', {
	AjaxService : new Class({
		initializeAjaxService : function()
		{
		},

		call : function(which, data, method, type)
		{
			var deferred = Q.defer();
			method = (method=== undefined)?'POST':method;
			type = (type === 'iframe')?'json':type;
			type = (type === undefined)?'json':type;
			$.ajax({
				data: data,
				dataType: type,
				error: this.onAjaxError.bind(this, deferred),
				success: this.onAjaxSuccess.bind(this, deferred),
				type: method,
				url: which
			});

			return deferred.promise;
		},

		onAjaxSuccess : function(deferred, response)
		{
			deferred.resolve(response);
			this.fire('ajaxResponse', response);
		},

		onAjaxError : function(deferred, jqXHR, textStatus, errorThrown)
		{
			console.log('ajaxError', jqXHR, textStatus, errorThrown);
			deferred.reject(errorThrown);
			this.fire('ajaxError', jqXHR, textStatus, errorThrown);
		}
	})
});
