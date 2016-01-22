'use strict';

module.exports = function loader() {
  load(require.resolve('./backlog'), 'backlog');
  load(require.resolve('./concept'), 'concept');
  load(require.resolve('./epic'), 'epic');
  load(require.resolve('./environment'), 'environment');
  load(require.resolve('./feature'), 'feature');
  load(require.resolve('./metric'), 'metric');
  load(require.resolve('./package'), 'package');
  load(require.resolve('./platform'), 'platform');
  load(require.resolve('./project'), 'project');
  load(require.resolve('./release'), 'release');
  load(require.resolve('./repository'), 'repository');
  load(require.resolve('./service'), 'service');
  load(require.resolve('./ui_component'), 'ui_component');
  load(require.resolve('./ui_layout'), 'ui_layout');
  load(require.resolve('./ui_screen'), 'ui_screen');
  load(require.resolve('./ui_theme'), 'ui_theme');
};