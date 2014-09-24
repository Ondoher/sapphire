
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

		setTimeout : function(timeout)
		{
			this.timeout = timeout;
		},

		call : function(which, data, method, headers, contentType)
		{
			headers = (headers === undefined)?{}:headers;
			if (this.sessionId && this.useSessionHeader) this.headers['X-Sapphire-Session'] = this.sessionId;

			var deferred = Q.defer();
			var headers = Object.merge({}, this.headers, headers);
			var type = 'json';
			var xssCode = Cookie.read('sapphire-xss');
			if (xssCode) data.xssCode = xssCode;

			method = (method=== undefined)?'POST':method;
			method = (SAPPHIRE.forceMethod !== false)?SAPPHIRE.forceMethod:method;

			$.ajax({
				data: data,
				dataType: type,
				contentType: contentType?contentType:undefined,
				headers: headers,
				error: this.onAjaxError.bind(this, deferred),
				success: this.onAjaxSuccess.bind(this, deferred),
				type: method,
				url: which,
				timeout : this.timeout
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
			deferred.reject(jqXHR);
			this.fire('ajaxError', jqXHR, textStatus, errorThrown);
		}
	})
});
