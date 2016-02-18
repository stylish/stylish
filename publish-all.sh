#!/bin/sh

export SKYPAGER_HOME=`pwd`

cd $SKYPAGER_HOME/packages/babel-preset-skypager/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-cli/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-devpack/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-docs/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-electron/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-plugin-blueprints/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-plugin-integrations/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-project/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-server/ && npm publish --tag beta1
cd $SKYPAGER_HOME/packages/skypager-themes/ && npm publish --tag beta1

