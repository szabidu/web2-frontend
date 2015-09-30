This is an AngularJS based web application for tilos.hu which uses the REST backend.

Requirements
------------

* Ruby (for sass)
* npm (to install bower and gulp dependencies)
* bower (to download client side dependencies)
* gulp (to assmble the project)
* vagrant (to run the nginx proxy)

Build
-----

The ```build.sh``` command is building the application to the dist/www folder.

You can run it if you have bower/npm/gulp/sass on your path, or you can run it from the vagrant image:

```
vagrant up
vagrant ssh
cd /tilos
./build.sh
```

Locally you can also use the build.sh (first time) and gulp build (next time if dependencies are not changed).

Run
----

```
vagrant up
```

check http://localhost:8080

The backend queries are redirected to the live https://tilos.hu