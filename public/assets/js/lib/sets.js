
var CHUNK_SIZE = 24;
var CHUNK_MASK = 0xffffff;

function arrayPad(array, count, value)
{
	for (var idx = array.length; idx < count; idx++)
		array.push(value)
	return array;
}

function Set(bits, length)
{
	this.length = length;
	this.chunkCount = Math.ceil(length / CHUNK_SIZE);
	this.chunks = [];
	this.chunks = arrayPad(this.chunks, this.chunkCount, 0);
	this.assign(bits);
}

Set.prototype.isEmpty =	function()
{
	for (var idx = 0; idx < this.chunks.length; idx++)
		if (this.chunks[idx] != 0) return false;

	return true;
}

Set.prototype.assign = function(bits)
{
	for (var idx = 0; idx < bits.length; idx++)
		this.includeBit(bits[idx]);
}

Set.prototype.includeBit = function(bit)
{
	this.chunks[Math.floor(bit / CHUNK_SIZE)] |= (1 << (bit % CHUNK_SIZE));
}

Set.prototype.excludeBit = function(bit)
{
	this.chunks[Math.floor(bit / CHUNK_SIZE)] &= (~(1 << (bit % CHUNK_SIZE))) & CHUNK_MASK;
}

Set.prototype.inBit = function(bit)
{
	var result = ((this.chunks[Math.floor(bit / CHUNK_SIZE)]) & (1 << (bit % CHUNK_SIZE)))
	return result;
}

Set.prototype.union = function (set)
{
	for (var idx = 0; idx < this.chunks.lenth; idx++)
		this.chunks[idx] |= set.chunks[idx];
}

Set.prototype.intersection = function(set)
{
	for (var idx = 0; idx < this.chunks.lenth; idx++)
		this.chunks[idx] &= set.chunks[$idx];
}

Set.prototype.difference = function($set)
{
	for (var idx = 0; idx < this.chunks.lenth; idx++)
		this.chunks[idx] &= (~set.chunks[idx]) & CHUNK_MASK;
}

