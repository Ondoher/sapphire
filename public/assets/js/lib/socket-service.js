Package('Spa.Services', {

/**********************************************************************************
	Class: SocketService

		<EventManaer>
*/
	SocketService : new Class({
		Extends : Spa.EventManager,

		initializeSocketService : function(server)
		{
			this.socket = io.connect(server, {reconnect: true});
			this.socket.on('error', this.onSocketError.bind(this));
			console.log('SocketService', 'initializeSocketService', server);
		},

		newSocketServer : function(service)
		{
		},

	/**********************************************************************************
		Method: message

		Call this function to to send a message to the server.

		This function will fire the 'socketMessage' event.

		Parameters:
			path     - the path to the message, starting with the application name, e.g. /geoveris/account/login.
			data     - all the data that needs to be passed to the service.
			callback - the function to call with the result.
	*/

		message : function(path, data, callback)
		{
			var data = $H(data);
			if (this.account !== null) data.account = this.account;
			data.path = path;
			this.socket.emit('message', path, data, function(data)
			{
				if (data)
				{
					this.fire('socketMessage', data);
					callback(data.result);
				}
			}.bind(this));
		},

	/**********************************************************************************
		Method: socketListen

		Call this function to listen for a message from the server

		This function will fire the 'socketMessage' event.

		Parameters:
			what     - the message being sent from the sever
			callback - the function to call when the message is received.
	*/
		socketListen : function(what, callback)
		{
			this.socket.on(what, function(data, callback)
			{
				if (data)
				{
					this.fire('socketMessage', data);
					if (callback) callback(data.body, callback);
				}
			}.bind(this));
		},


	/**********************************************************************************
		Group: Event Handlers
	**********************************************************************************/

	/**********************************************************************************
		Method: onSocketError

		Handler for the socket error, it just logs the message to the console. Note: this
		will be moved into a separate js file.
	*/

		onSocketError : function(error)
		{
			this.fire('socketError', error);
		}
	})
});

