# Installation de Node.js : https://nodejs.org/fr/download/prebuilt-installer

# Initialisation du projet :

npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (qcet)
version: (1.0.0)
description: Who do you look like?
entry point: (index.js)
test command:
git repository: github.com:DineJ/Which-champions-are-you-.git
keywords:
author: Dine Jridi
license: (ISC) GPL-3.0
About to write to C:\Users\admin\Documents\YDAYS\QCET\package.json:

{
  "name": "qcet",
  "version": "1.0.0",
  "description": "Who do you look like?",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "github.com:DineJ/Which-champions-are-you-.git"
  },
  "author": "Dine Jridi",
  "license": "GPL-3.0"
}


Is this OK? (yes) yes

# Création du fichier index.js qui lance le fichier index.html

# Installation d'électron

npm install electron --save-dev