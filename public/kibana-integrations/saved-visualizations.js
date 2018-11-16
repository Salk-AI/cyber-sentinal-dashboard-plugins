import 'plugins/kibana/visualize/saved_visualizations/_saved_vis';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { uiModules } from 'ui/modules';
import { SavedObjectLoader } from './saved-object-loader';
import { savedObjectManagementRegistry } from 'plugins/kibana/management/saved_object_registry';
import { SavedObjectsClientProvider } from 'ui/saved_objects';

const app = uiModules.get('app/visualize');

// Register this service with the saved object registry so it can be
// edited by the object editor.
savedObjectManagementRegistry.register({
  service: 'wzsavedVisualizations',
  title: 'visualizations'
});

app.service('wzsavedVisualizations', function(
  Promise,
  kbnIndex,
  SavedVis,
  Private,
  kbnUrl,
  $http,
  chrome
) {
  const visTypes = Private(VisTypesRegistryProvider);

  const savedObjectClient = Private(SavedObjectsClientProvider);
  const saveVisualizationLoader = new SavedObjectLoader(
    SavedVis,
    kbnIndex,
    kbnUrl,
    $http,
    chrome,
    savedObjectClient
  );

  saveVisualizationLoader.mapHitSource = function(source, id) {
    source.id = id;
    source.url = this.urlFor(id);

    let typeName = source.typeName;
    if (source.visState) {
      try {
        typeName = JSON.parse(source.visState).type;
      } catch (e) {
        /* missing typename handled below */
      } // eslint-disable-line no-empty
    }

    if (!typeName || !visTypes.byName[typeName]) {
      source.error = 'Unknown visualization type';
      return source;
    }

    source.type = visTypes.byName[typeName];
    source.icon = source.type.icon;
    return source;
  };

  saveVisualizationLoader.urlFor = function(id) {
    return kbnUrl.eval('#/visualize/edit/{{id}}', { id: id });
  };
  return saveVisualizationLoader;
});
