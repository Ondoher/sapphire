
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
		initializeAjaxService : function(useSessionHeader)
		{
			this.useSessionHeader = (useSessionHeader === undefined)?false:useSessionHeader;
			this.sessionId = undefined;
			this.headers = {};
		},

		addHeader : function(key, value)
		{
			this.headers[key] = value;
		},

		call : function(which, data, method, type)
		{
			var deferred = Q.defer();
			var headers = this.headers;
			if (this.sessionId && this.useSessionHeader) this.headers['X-Sapphire-Session'] = this.sessionId;

			method = (method=== undefined)?'POST':method;
			method = (SAPPHIRE.forceMethod !== false)?SAPPHIRE.forceMethod:method;

			type = (type === 'iframe')?'json':type;
			type = (type === undefined)?'json':type;

			$.ajax({
				data: data,
				dataType: type,
				headers: headers,
				error: this.onAjaxError.bind(this, deferred),
				success: this.onAjaxSuccess.bind(this, deferred),
				type: method,
				url: which
			});

			return deferred.promise;
		},

		onAjaxSuccess : function(deferred, response, status, xhr)
		{

			deferred.resolve(response);
			if (xhr.getResponseHeader('X-Sapphire-Session'))
				this.sessionId = xhr.getResponseHeader('X-Sapphire-Session');
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
