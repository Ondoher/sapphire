
function NodeManager()
{
	this.nodes = new Array();
	this.parents = new Array();
	this.nextSiblings = new Array();
}

NodeManager.prototype.hideNode = function (node, name)
{
	node.style.visibility = 'hidden';
	return;
	if (name == undefined) name = node.id;

	this.parents[name] = node.parentNode;
	this.nextSiblings[name] = node.nextSibling;
	this.nodes[name] = node.parentNode.removeChild(node);
}

NodeManager.prototype.showNode = function(node)
{
	node.style.visibility = 'inherit';
	return;
	if (!this.nextSiblings[name])
		this.parents[name].appendChild(this.nodes[name])
	else
		this.parents[name].insertBefore(this.nodes[name], this.nextSibling[name]);
}