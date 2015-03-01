
var Set = new Class({
	CHUNK_SIZE : 24,
	CHUNK_MASK : 0xffffff,

	initialize : function(bits, length)
	{
		this.length = length?length:1024;
		this.chunkCount = Math.ceil(this.length / this.CHUNK_SIZE);
		this.chunks = [];
		this.chunks = this.arrayPad(this.chunks, this.chunkCount, 0);
		this.assign(bits);
	},

	arrayPad : function(array, count, value)
	{
		for (var idx = array.length; idx < count; idx++)
			array.push(value)
		return array;
	},

	isEmpty : function()
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			if (this.chunks[idx] != 0) return false;

		return true;
	},

	assign : function(bits)
	{
		for (var idx = 0; idx < bits.length; idx++)
			this.includeBit(bits[idx]);
//		console.log('set::assign', bits, this);
	},

	includeBit : function(bit)
	{
		this.chunks[Math.floor(bit / this.CHUNK_SIZE)] |= (1 << (bit % this.CHUNK_SIZE));
	},

	excludeBit : function(bit)
	{
		this.chunks[Math.floor(bit / this.CHUNK_SIZE)] &= (~(1 << (bit % this.CHUNK_SIZE))) & this.CHUNK_MASK;
	},

	inBit : function(bit)
	{
		var result = ((this.chunks[Math.floor(bit / this.CHUNK_SIZE)]) & (1 << (bit % this.CHUNK_SIZE)))
		//console.log('inBit', bit, result);
		return result != 0;
	},

	union : function (set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] |= set.chunks[idx];
	},

	intersection : function(set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] &= set.chunks[$idx];
	},

	difference : function(set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] &= (~set.chunks[idx]) & this.CHUNK_MASK;
	}
});
