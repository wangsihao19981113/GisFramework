/* This file is automatically rebuilt by the Cesium build process. */
define(['./defaultValue-94c3e563', './PrimitivePipeline-30e87c99', './createTaskProcessorWorker', './Transforms-a076dbe6', './Matrix2-fc7e9822', './RuntimeError-c581ca93', './ComponentDatatype-4a60b8d6', './WebGLConstants-7dccdc96', './_commonjsHelpers-3aae1032-f55dc0c4', './combine-761d9c3f', './GeometryAttribute-2ecf73f6', './GeometryAttributes-7df9bef6', './GeometryPipeline-b4816e69', './AttributeCompression-4d18cc04', './EncodedCartesian3-d3e254ea', './IndexDatatype-db156785', './IntersectionTests-5deed78b', './Plane-e20fba8c', './WebMercatorProjection-843df830'], (function (defaultValue, PrimitivePipeline, createTaskProcessorWorker, Transforms, Matrix2, RuntimeError, ComponentDatatype, WebGLConstants, _commonjsHelpers3aae1032, combine, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  /* global require */

  const moduleCache = {};

  function getModule(moduleName) {
    let module = moduleCache[moduleName];
    if (!defaultValue.defined(module)) {
      if (typeof exports === "object") {
        // Use CommonJS-style require.
        moduleCache[module] = module = require(`Workers/${moduleName}`);
      } else {
        // Use AMD-style require.
        // in web workers, require is synchronous
        require([`Workers/${moduleName}`], function (f) {
          module = f;
          moduleCache[module] = f;
        });
      }
    }
    return module;
  }

  function createGeometry(parameters, transferableObjects) {
    const subTasks = parameters.subTasks;
    const length = subTasks.length;
    const resultsOrPromises = new Array(length);

    for (let i = 0; i < length; i++) {
      const task = subTasks[i];
      const geometry = task.geometry;
      const moduleName = task.moduleName;

      if (defaultValue.defined(moduleName)) {
        const createFunction = getModule(moduleName);
        resultsOrPromises[i] = createFunction(geometry, task.offset);
      } else {
        //Already created geometry
        resultsOrPromises[i] = geometry;
      }
    }

    return Promise.all(resultsOrPromises).then(function (results) {
      return PrimitivePipeline.PrimitivePipeline.packCreateGeometryResults(
        results,
        transferableObjects
      );
    });
  }
  var createGeometry$1 = createTaskProcessorWorker(createGeometry);

  return createGeometry$1;

}));
