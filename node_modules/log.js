module.exports = function()
{
	return function(req, res, next)
	{
  		console.log(process.pid, new Date(), req.url);
		next();
	}
}
