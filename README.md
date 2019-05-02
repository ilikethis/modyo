# localhost:8080/

## About
Test for Modyo

## Best Practices
This project contains an .editorconfig and .scss-lint.yml file. These should help maintain a consistent code style. Depending on your editor you may need to do some extra setup work.


### Editorconfig setup
This project uses an .editorconfig file to help maintain consistency. There is most probably already an editorconfig plugin for whatever editor you use. Install it before starting to develop by following [the docs](http://editorconfig.org/#download).

## Technical design

This project is built using [Grow](https://growsdk.org).

## Getting started

I recommend that you use create a virtualenv for this project so that the
python requirements do not get installed globally to help prevent any possible
conflicts with other projects.

To install Grow, paste the following command into Terminal. This command downloads the SDK and sets up an alias. Before anything is done, you will be prompted to continue.

```
curl https://install.grow.io | bash
```
Alternatively, you can also install Grow by using pip (```pip install grow```)

to prevent dependency errors running the project try using the 0.4.0 version with script bellow:

```
curl -Lk https://github.com/grow/grow/releases/download/0.4.0/Grow-SDK-Mac-0.4.0.zip -o /tmp/temp_grow.zip; unzip /tmp/temp_grow.zip -d $HOME/bin/; rm /tmp/temp_grow.zip
```

please make sure that you are over the python 2.7 version

1. `npm i`
1. `grow install`
3. `grow run`

to run the grow comand you must need to create an alias if you are using a terminal without bash or just change you terminal to bash typing:

- `bash`
