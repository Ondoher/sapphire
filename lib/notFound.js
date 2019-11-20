var url = require('url');

function clean(reqUrl)
{
	var parsed = url.parse(reqUrl);
	return url.format(parsed).replace(/</g, '&lt;');
}

module.exports = function()
{
	return function(req, res, next)
	{
		req.url = clean(req.url);
		res.statusCode = 404;
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write("<h1>404 Not Found</h1>");
		res.write('<!--\n');
		res.write('                                .do-"""""\'-o..\n');
		res.write('                             .o""            ""..\n');
		res.write('                           ,,\'\'                 \`\`b.\n');
		res.write('                          d\'                      \`\`b\n');
		res.write('                         d\`d:                       \`b.\n');
		res.write('                        ,,dP                         \`Y.\n');
		res.write('                       d\`88                           \`8.\n');
		res.write(' ooooooooooooooooood888\`88\'                            \`88888888888bo,\n');
		res.write('d"""    \`""""""""""""Y:d8P                              8,          \`b\n');
		res.write('8                    P,88b                             ,\`8           8\n');
		res.write('8                   ::d888,                           ,8:8.          8\n');
		res.write(':                   dY88888                           \`\' ::          8\n');
		res.write(':                   8:8888                               \`b          8\n');
		res.write(':                   Pd88P\',...                     ,d888o.8          8\n');
		res.write(':                   :88\'dd888888o.                d8888\`88:          8\n');
		res.write(':                  ,:Y:d8888888888b             ,d88888:88:          8\n');
		res.write(':                  :::b88d888888888b.          ,d888888bY8b          8\n');
		res.write('                    b:P8;888888888888.        ,88888888888P          8\n');
		res.write('                    8:b88888888888888:        888888888888\'          8\n');
		res.write('                    8:8.8888888888888:        Y8888888888P           8\n');
		res.write(',                   YP88d8888888888P\'          ""888888"Y            8\n');
		res.write(':                   :bY8888P"""""\'\'                     :            8\n');
		res.write(':                    8\'8888\'                            d            8\n');
		res.write(':                    :bY888,                           ,P            8\n');
		res.write(':                     Y,8888           d.  ,-         ,8\'            8\n');
		res.write(':                     \`8)888:           \'            ,P\'             8\n');
		res.write(':                      \`88888.          ,...        ,P               8\n');
		res.write(':                       \`Y8888,       ,888888o     ,P                8\n');
		res.write(':                         Y888b      ,88888888    ,P\'                8\n');
		res.write(':                          \`888b    ,888888888   ,,\'                 8\n');
		res.write(':                           \`Y88b  dPY888888OP   :\'                  8\n');
		res.write(':                             :88.,\'.   \`\' \`8P-"b.                   8\n');
		res.write(':.                             )8P,   ,b \'  -   \`\`b                  8\n');
		res.write('::                            :\':   d,\'d\`b, .  - ,db                 8\n');
		res.write('::                            \`b. dP\' d8\':      d88\'                 8\n');
		res.write('::                             \'8P" d8P\' 8 -  d88P\'                  8\n');
		res.write('::                            d,\' ,d8\'  \'\'  dd88\'                    8\n');
		res.write('::                           d\'   8P\'  d\' dd88\'8                     8\n');
		res.write(' :                          ,:   \`\'   d:ddO8P\' \`b.                   8\n');
		res.write(' :                  ,dooood88: ,    ,d8888""    \`\`\`b.                8\n');
		res.write(' :               .o8"\'""""""Y8.b    8 \`"\'\'    .o\'  \`"""ob.           8\n');
		res.write(' :              dP\'         \`8:     K       dP\'\'        "\`Yo.        8\n');
		res.write(' :             dP            88     8b.   ,d\'              \`\`b       8\n');
		res.write(' :             8.            8P     8""\'  \`"                 :.      8\n');
		res.write(' :            :8:           :8\'    ,:                        ::      8\n');
		res.write(' :            :8:           d:    d\'                         ::      8\n');
		res.write(' :            :8:          dP   ,,\'                          ::      8\n');
		res.write(' :            \`8:     :b  dP   ,,                            ::      8\n');
		res.write(' :            ,8b     :8 dP   ,,                             d       8\n');
		res.write(' :            :8P     :8dP    d\'                       d     8       8\n');
		res.write(' :            :8:     d8P    d\'                      d88    :P       8\n');
		res.write(' :            d8\'    ,88\'   ,P                     ,d888    d\'       8\n');
		res.write(' :            88     dP\'   ,P                      d8888b   8        8\n');
		res.write(' \'           ,8:   ,dP\'    8.                     d8\'\'88\'  :8        8\n');
		res.write('             :8   d8P\'    d88b                   d"\'  88   :8        8\n');
		res.write('             d: ,d8P\'    ,8P""".                      88   :P        8\n');
		res.write('             8 ,88P\'     d\'                           88   ::        8\n');
		res.write('            ,8 d8P       8                            88   ::        8\n');
		res.write('            d: 8P       ,:  -hrr-                    :88   ::        8\n');
		res.write('            8\',8:,d     d\'                           :8:   ::        8\n');
		res.write('           ,8,8P\'8\'    ,8                            :8\'   ::        8\n');
		res.write('           :8\`\' d\'     d\'                            :8    ::        8\n');
		res.write('           \`8  ,P     :8                             :8:   ::        8\n');
		res.write('            8, \`      d8.                            :8:   8:        8\n');
		res.write('            :8       d88:                            d8:   8         8\n');
		res.write(' ,          \`8,     d8888                            88b   8         8\n');
		res.write(' :           88   ,d::888                            888   Y:        8\n');
		res.write(' :           YK,oo8P :888                            888.  \`b        8\n');
		res.write(' :           \`8888P  :888:                          ,888:   Y,       8\n');
		res.write(' :            \`\`\'"   \`888b                          :888:   \`b       8\n');
		res.write(' :                    8888                           888:    ::      8\n');
 		res.write(' :                    8888:                          888b     Y.     8,\n');
 		res.write(' :                    8888b                          :888     \`b     8:\n');
		res.write(' :                    88888.                         \`888,     Y     8:\n-->\n')
		res.end("The page you were looking for: "+ req.url + " can not be found");
	}
}

