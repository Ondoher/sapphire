function Import(name)
{
    var path = name.split('.');
    var find = window;

    path.each(function(name)
    {
        find[name] = (find[name] !== undefined)?find[name]:{};
        find = find[name];
    });

	return find;
}

function Package(name, newClass)
{
    var path = name.split('.');
    var find = window;

    path.each(function(name)
    {
        find[name] = (find[name] !== undefined)?find[name]:{};
        find = find[name];
    });

    Object.merge(find, newClass);
}
