This is an AngularJS based web application for tilos.hu which uses the REST backend.

[![Travis](https://img.shields.io/travis/tilosradio/web2-frontend.svg)](http://travis-ci.org/tilosradio/web2-frontend)

To get help [![gitter](https://img.shields.io/badge/gitter-join%20chat-1dce73.svg)](https://gitter.im/tilosradio/public)

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

You can run it if you have bower/npm/gulp/sass on your path:

Locally you can also use the build.sh (first time) and gulp build (next time if dependencies are not changed).

Setup tutorial
--------------

Get yourself a Linux (eg. http://cdimage.ubuntu.com/lubuntu/releases/17.10.1/release/lubuntu-17.10.1-desktop-amd64.iso)

```bash
# you need root privileges for most of the following
sudo su

# make sure you have the latest and greatest apt-get
apt-get update

# install the build-essential package
apt-get install build-essential

# install Ruby
apt-get install ruby-full

# install Ruby Sass CSS compiler
apt install ruby-sass
sass -v

# install Open SSL 
apt-get install libssl-dev

# install nvm (Node Version Manager) to be able to use any version of NodeJs. 
# You need to restart your terminal to start using nvm. 
# Do it as a normal user, not root
exit
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
nvm --version

# create a directory for the Tilos project
mkdir -p projects/tilos
cd projects/tilos

# install node v5 for the tilos project. NPM should be installed with it
nvm install 5
nvm ls
node -v
npm -v

# install bower and gulp
npm install -g bower
bower -v
npm install -g gulp
gulp -v

#install Vagrant by downloading the installer from here: https://www.vagrantup.com/downloads.html

# install git and add your name to the global config
sudo apt-get install git-all
git config --global github.user your_github_username
git config --global user.name "Your Name"
git config --global user.email your_email@example.com

# clone the GitHub repo for yourself (or fork it for yourself, and clone the fork)
git clone https://github.com/tilosradio/web2-frontend

# give all rights to the build process
sudo chmod -R 777 web2-frontend
cd web2-frontend

# Build the project
./build.sh

# Start the web server 
gulp serve

```
Open you browser and navigate to http://localhost:3000

Now smile :)
