
Package('Sapphire.Services', {

/**********************************************************************************
	Class: SocketService

		<EventManaer>
*/
	SocketService : new Class({

		initializeSocketService : function()
		{
			this.connected = false;
			this.sockets = $H({});
		},

		setupSocketServer : function(server)
		{
			if (this.sockets[server])
			{
				this.socket = this.sockets[server];
				this.socket.socket.reconnect();
			}
			else
			{
				this.socket = io.connect(server, {reconnect: false, 'connect timeout': 2000 });
				this.sockets[server] = this.socket;
				this.socket.on('error', this.onSocketError.bind(this));
				this.socket.on('disconnect', this.onSocketDisconnect.bind(this));
				this.socket.on('connect', this.onSocketConnect.bind(this));
				this.socket.on('connect_failed', this.onSocketConnectFailed.bind(this));
				this.socket.on('reconnecting', this.onSocketReconnecting.bind(this));
			}

			console.log('SocketService', 'initializeSocketService', server);
		},

	/**********************************************************************************
		Method: message

		Call this function to to send a message to the server.

		This function will fire the 'socketMessage' event.

		Parameters:
			path     - the path to the message, starting with the application name, e.g. /geoveris/account/login.
			data     - all the data that needs to be passed to the service.
	*/

		message : function(path, data)
		{
			var deferred = Q.defer();
			var data = $H(data);
			if (this.account !== null) data.account = this.account;
			data.path = path;
			data.sessionId = Cookie.read('sessionId');
			this.socket.emit('message', path, data, function(data)
			{
				if (data)
				{
					this.fire('socketMessage', data);
					deferred.resolve(data);
				}
			}.bind(this));

			return deferred.promise;
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
			//console.log('socketListen', what);
			this.socket.removeAllListeners(what);
			this.socket.on(what, function(data, returnCallback)
			{
				//console.log(what, data);
				if (data)
				{
					this.fire('socketMessage', data);
					if (callback) callback(data, callback);
				}
			}.bind(this));
		},

	/**********************************************************************************
		Method: socketUnlisten

		Call this function to stop listening for a message from the server

		Parameters:
			what     - the message being sent from the sever
	*/
		socketUnlisten : function(what, callback)
		{
			this.socket.removeAllListeners(what);
		},

	/**********************************************************************************
		Group: Event Handlers
	**********************************************************************************/

	/**********************************************************************************
		Method: onSocketError

		Handler for the socket error, it just logs the message to the console.
	*/

		onSocketError : function(error)
		{
			if (!this.connected)
				this.fire('socketConnectFailed');
			console.log('SocketServer::onSocketError', this.connected, error);
			this.fire('socketError', error);
		},

	/**********************************************************************************
		Method: onSocketDisconnect

	*/

		onSocketDisconnect : function()
		{
			console.log('SocketServer::onSocketDisconnect');
			this.connected = false;
			this.fire('socketDisconnect');
		},

	/**********************************************************************************
		Method: onSocketConnect

	*/

		onSocketConnect : function()
		{
			console.log('SocketServer::onSocketConnect');
			this.connected = true;
			this.fire('socketConnect');
		},

	/**********************************************************************************

	*/

		onSocketReconnecting : function()
		{
			console.log('SocketServer::onSocketReconnecting');
		},

	/**********************************************************************************
		Method: onSocketConnectFailed

	*/

		onSocketConnectFailed : function()
		{
			console.log('SocketServer::onSocketConnectFailed');
			this.connected = false;
			this.fire('socketConnectFailed');
		}


	})
});

