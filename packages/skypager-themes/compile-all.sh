#!/bin/sh

mkdir -p templates/electron/dashboard templates/electron/dashboard-dark templates/electron/social-app templates/web/dashboard templates/web/dashboard-dark templates/web/social-app templates/web/marketing templates/web/marketing-bold templates/web/marketing-minimal

echo 'Compiling dashboard themes for electron platform'
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/dashboard --theme dashboard
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/dashboard-dark --theme dashboard-dark

echo 'Compiling social app theme for electron platform'
skypager compile --entry ./src/stack --platform electron --no-content-hash --output-folder templates/electron/social-app --theme social-app

echo 'Compiling dashboard themes for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/dashboard --theme dashboard
skypager compile --entry ./src/stack --platform web --output-folder templates/web/dashboard-dark --theme dashboard-dark

echo 'Compiling social app theme for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/social-app --theme social-app

echo 'Compiling marketing site themes for web platform'
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing --theme marketing
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing-bold --theme marketing-bold
skypager compile --entry ./src/stack --platform web --output-folder templates/web/marketing-minimal --theme marketing-minimal
