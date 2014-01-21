function Ui()
{
	this.nodeManager = new NodeManager();
}

Ui.prototype.findNode = function(rNode, rId, debug)
{
	if (rNode.id == rId) return rNode;

	var vNodes = rNode.getChildren();
	var vResult = null;

	vNodes.each(function (rNode)
	{
		vResult = (vResult != null)?vResult:this.findNode(rNode, rId);
	}, this);

	return vResult;
}

Ui.prototype.replaceFields = function(node, values, keepIds)
{
	keepIds = (keepIds === undefined)?false:keepIds;

// see if this node is one to be set
	if (values.has(node.id))
		node.set(values.get(node.id));

// do the same for the children
	var nodes = node.getChildren();
	nodes.each(function (node)
	{
		this.replaceFields(node, values, keepIds);
	}, this);

	if (!keepIds) node.id = node.id + '_'  + Math.floor(Math.random() * 65535);
}

Ui.prototype.fixupBackgroundImage = function(baseUrl, backgroundImage)
{
	var url = backgroundImage;
	url = url.slice(4, url.length - 1);
	return 'url(' + baseUrl + url + ')';
}

Ui.prototype.fixupImages = function(baseUrl, node)
{
	if (node.src != undefined)
	{
		node.src = node.src;
	}
	if (node.style.backgroundImage != '') node.style.backgroundImage = this.fixupBackgroundImage(baseUrl, node.style.backgroundImage);

	var nodes = node.getChildren();
	nodes.each(function(node)
	{
		this.fixupImages(baseUrl, node);
	}, this);
}

Ui.prototype.extractNode = function(rNode)
{
	return rNode.parentNode.removeChild(rNode);
}

Ui.prototype.makeButton = function(rButton, rNormal, rHover, rPressed, rOnClick)
{
	var vNormal = rNormal.parentNode.removeChild(rNormal);
	var vHover = rHover?rHover.parentNode.removeChild(rHover):null;
	var vPressed = rPressed?rPressed.parentNode.removeChild(rPressed):null;

	rButton.style.cursor = 'pointer';
	rButton.innerHTML = '';
	rButton.appendChild(vNormal.clone(true, true));

	var _this = this;
	rButton.onclick = function()
	{
		rOnClick();
	}
}

Ui.prototype.makeClickable = function(rNode, rOnClick)
{
	rNode.style.cursor = 'pointer';

	var _this = this;
	rNode.onclick = function()
	{
		rOnClick();
	}
}

Ui.prototype.hoverHighlight = function(rNode, rNormal, rHover)
{
	var _this = this;
	this.hideNode(rHover);
//	rNormal.onmouseover = function () {alert('omg!')}
	rNode.onmouseover = function()
	{
		_this.hideNode(rNormal);
		_this.showNode(rHover);
	}

	rNode.onmouseout = function()
	{
		_this.hideNode(rHover);
		_this.showNode(rNormal);
	}
}


Ui.prototype.getListWindow = function(rContainer)
{
	rContainer.style.overflowY = 'auto';
	return rContainer;
}

Ui.prototype.hideNode = function(rNode)
{
	this.nodeManager.hideNode(rNode);
}

Ui.prototype.showNode = function(rNode)
{
	this.nodeManager.showNode(rNode);
}

Ui.prototype.drawTimer = function(node, time, supressZero)
{
    if (!node) return;

    time = time / 1000;
    if (time < 0) time = 0;
    if (time == 0 && supressZero)
    {
        node.innerHTML = '';
        return;
    }

    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    var str = '';

    str += minutes;
    str += ':';

    if (seconds < 10) str += '0';
    str += seconds;

    node.innerHTML = '';
    node.innerHTML = str;
}

Ui.prototype.showProgress = function(left, middle, right, width, ratio)
{
	if (ratio == 0)
	{
		left.style.visibility = 'hidden';
		middle.style.visibility = 'hidden';
		right.style.visibility = 'hidden';
		return;
	}

	left.style.visibility = 'inherit';
	middle.style.visibility = 'inherit';
	right.style.visibility = 'inherit';

	middle.style.width = (width * ratio) + 'px';
}

UI = new Ui();
