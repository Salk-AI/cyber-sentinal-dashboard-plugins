/*
 * Wazuh app - Top nav bar directive
 * Copyright (C) 2018 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import menuTemplate from './wz-menu.html';
import { uiModules } from 'ui/modules';

const app = uiModules.get('app/wazuh', []);

class WzMenu {
  constructor() {
    this.template = menuTemplate;
  }

  controller(
    $scope,
    $window,
    $rootScope,
    appState,
    patternHandler,
    indexPatterns,
    errorHandler,
    wazuhConfig
  ) {
    $rootScope.showSelector = appState.getPatternSelector();

    if (!$rootScope.$$phase) $rootScope.$digest();

    if (appState.getCurrentAPI()) {
      $scope.theresAPI = true;
      $scope.currentAPI = JSON.parse(appState.getCurrentAPI()).name;
    } else {
      $scope.theresAPI = false;
    }

    $scope.goToClick = path => {
      $window.location.href = path;
    };

    const load = async () => {
      try {
        const list = await patternHandler.getPatternList();
        // Get the configuration to check if pattern selector is enabled
        const config = wazuhConfig.getConfig();
        appState.setPatternSelector(config['ip.selector']);

        // Abort if we have disabled the pattern selector
        if (!appState.getPatternSelector()) return;

        // Show the pattern selector
        $rootScope.showSelector = true;
        let filtered = false;
        // If there is no current pattern, fetch it
        if (!appState.getCurrentPattern()) {
          appState.setCurrentPattern(list[0].id);
        } else {
          // Check if the current pattern cookie is valid
          filtered = list.filter(item =>
            item.id.includes(appState.getCurrentPattern())
          );
          if (!filtered.length) appState.setCurrentPattern(list[0].id);
        }

        const data = filtered
          ? filtered
          : await indexPatterns.get(appState.getCurrentPattern());
        $scope.theresPattern = true;
        $scope.currentPattern = data.title;

        // Getting the list of index patterns
        if (list) {
          $scope.patternList = list;
          $scope.currentSelectedPattern = appState.getCurrentPattern();
        }
        if (!$scope.$$phase) $scope.$digest();
        if (!$rootScope.$$phase) $rootScope.$digest();
        return;
      } catch (error) {
        errorHandler.handle(error, 'Directives - Menu');
        $scope.theresPattern = false;
      }
    };

    load();

    // Function to change the current index pattern on the app
    $scope.changePattern = async selectedPattern => {
      try {
        if (!appState.getPatternSelector()) return;
        $scope.currentSelectedPattern = await patternHandler.changePattern(
          selectedPattern
        );
        if (!$scope.$$phase) $scope.$digest();
        $window.location.reload();
        return;
      } catch (error) {
        errorHandler.handle(error, 'Directives - Menu');
      }
    };

    $scope.$on('updateAPI', (evt, params) => {
      const current = appState.getCurrentAPI();
      if (current) {
        const parsed = JSON.parse(current);

        // If we've received cluster info as parameter, it means we must update our stored cookie
        if (params && params.cluster_info) {
          if (params.cluster_info.status === 'enabled') {
            parsed.name = params.cluster_info.cluster;
          } else {
            parsed.name = params.cluster_info.manager;
          }
          appState.setCurrentAPI(JSON.stringify(parsed));
        }

        $scope.theresAPI = true;
        $scope.currentAPI = parsed.name;
      } else {
        $scope.theresAPI = false;
      }
    });

    $scope.$on('updatePattern', () => {
      if (!appState.getPatternSelector()) return;
      indexPatterns
        .get(appState.getCurrentPattern())
        .then(() => {
          $scope.theresPattern = true;
          $scope.currentSelectedPattern = appState.getCurrentPattern();
        })
        .catch(error => {
          errorHandler.handle(error, 'Directives - Menu');
          $scope.theresPattern = false;
        });
    });
  }
}

app.directive('wzMenu', () => new WzMenu());
