Sapphire
========

Framework for building single page applications in node.js

For full documentation of Sapphire, check out the [Sapphire Site](http://sapphire.uber-geek.com/docs).

Quick Install Guide
-------------------

**Install**
```bash
npm install -g sapphire-express
cd project
sapphire install
npm install
```

**Creating a project**
```bash
sapphire app test
```

**Run**
```bash
here #windows
. here #osx or linux
node server
```

What's going on here?
---------------------

When Sapphire is installed globally, it creates a command line interface that can be used to create skeletons for a number of Sapphire specific features. The two options used here are install and app. The first creates a sapphire installation in the current directory. This will install the default sapphire server.js file, a config directory with default confiuration files and a package.json file with the required npm packages. It also creates a batch or shell script called here that can be used to setup the necessary environment variables to point Sapphire at the configuration files.

The second option, app, creates a basic application. In this case, we are creating the application "test". The application isn't very exciting, but it's a place to start.

For a more indepth look at Sapphire, checkout the the [Sapphire Site](http://sapphire.uber-geek.com/docs).
