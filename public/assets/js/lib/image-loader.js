Package('Sapphire', {
	ImageLoader : new Class({
		Extends : Sapphire.Eventer,

		initialize : function()
		{
			this.parent();
			this.pending = $H({});
			this.images = $H({});
			this.total = 0;
		},

		load : function(images)
		{
			var length = this.pending.getLength();
			this.total += length;
			images.each(function(name)
			{
				if (!this.images.has(name) && !this.pending.has(name))
					this.pending[name] = $('<img src="' + name + '" />');
			}, this);

			if (length == 0) this.timerHdl = this.onTimer.periodical(10, this);
		},

		get : function(name)
		{
			if (this.images.has(name)) return this.images[name];
			else return $('<img />');
		},

		wait : function(callback)
		{
			if (this.pending.getLength() == 0) callback.delay(1);
			else this.listen('loaded', callback);
		},

		onTimer : function()
		{
			var done = [];
			this.pending.each(function(img, name)
			{
				if (img[0].complete) done.push(name);
			}, this);

			done.each(function(name)
			{
				this.images[name] = this.pending[name];
				this.pending.erase(name);
			}, this);

			if (this.pending.getLength() == 0)
			{
				this.fire('loaded');
				this.remove('loaded', '');
				clearInterval(this.timerHdl);
				this.total = 0;
			}
			else
			{
				this.fire('progress', this.pending.getLength / this.total);
			}
		}
	})
});

SAPPHIRE.imageLoader = new Sapphire.ImageLoader();


