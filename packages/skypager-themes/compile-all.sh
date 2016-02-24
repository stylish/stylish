#!/bin/sh

export DEBUG_SERVER=true DEBUG='*,-babel'

mkdir -p templates/electron/dashboard templates/electron/dashboard-dark templates/electron/social-app templates/web/dashboard templates/web/dashboard-dark templates/web/social-app templates/web/marketing templates/web/marketing-bold templates/web/marketing-minimal

echo 'Compiling dashboard themes for electron platform'
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/dashboard --theme dashboard --html-filename index.html
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/dashboard-dark --theme dashboard-dark --html-filename index.html

echo 'Compiling social app theme for electron platform'
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/social-app --theme social-app --html-filename index.html

echo 'Compiling dashboard themes for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/dashboard --theme dashboard --html-filename index.html
skypager compile --entry ./src/stack --platform web --output-folder templates/web/dashboard-dark --theme dashboard-dark --html-filename index.html

echo 'Compiling social app theme for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/social-app --theme social-app --html-filename index.html

echo 'Compiling marketing site themes for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing --theme marketing --html-filename index.html
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing-bold --theme marketing-bold --html-filename index.html
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing-minimal --theme marketing-minimal --html-filename index.html
