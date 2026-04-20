/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/preferences/route";
exports.ids = ["app/api/preferences/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpreferences%2Froute&page=%2Fapi%2Fpreferences%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpreferences%2Froute.ts&appDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpreferences%2Froute&page=%2Fapi%2Fpreferences%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpreferences%2Froute.ts&appDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_kaihkashan_Documents_wandr_src_app_api_preferences_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/preferences/route.ts */ \"(rsc)/./src/app/api/preferences/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/preferences/route\",\n        pathname: \"/api/preferences\",\n        filename: \"route\",\n        bundlePath: \"app/api/preferences/route\"\n    },\n    resolvedPagePath: \"/Users/kaihkashan/Documents/wandr/src/app/api/preferences/route.ts\",\n    nextConfigOutput,\n    userland: _Users_kaihkashan_Documents_wandr_src_app_api_preferences_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwcmVmZXJlbmNlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcHJlZmVyZW5jZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwcmVmZXJlbmNlcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmthaWhrYXNoYW4lMkZEb2N1bWVudHMlMkZ3YW5kciUyRnNyYyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZrYWloa2FzaGFuJTJGRG9jdW1lbnRzJTJGd2FuZHImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2tCO0FBQy9GO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMva2FpaGthc2hhbi9Eb2N1bWVudHMvd2FuZHIvc3JjL2FwcC9hcGkvcHJlZmVyZW5jZXMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3ByZWZlcmVuY2VzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcHJlZmVyZW5jZXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3ByZWZlcmVuY2VzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2thaWhrYXNoYW4vRG9jdW1lbnRzL3dhbmRyL3NyYy9hcHAvYXBpL3ByZWZlcmVuY2VzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpreferences%2Froute&page=%2Fapi%2Fpreferences%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpreferences%2Froute.ts&appDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/preferences/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/preferences/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_locale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/locale */ \"(rsc)/./src/lib/locale.ts\");\n\n\nasync function POST(request) {\n    const body = await request.json().catch(()=>({}));\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    if (body.locale) {\n        const locale = (0,_lib_locale__WEBPACK_IMPORTED_MODULE_1__.resolveLocale)(body.locale);\n        cookieStore.set(\"locale\", locale, {\n            path: \"/\",\n            maxAge: 60 * 60 * 24 * 365\n        });\n    }\n    return Response.json({\n        ok: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9wcmVmZXJlbmNlcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDdUM7QUFDTTtBQUV0QyxlQUFlRSxLQUFLQyxPQUFvQjtJQUM3QyxNQUFNQyxPQUFPLE1BQU1ELFFBQVFFLElBQUksR0FBR0MsS0FBSyxDQUFDLElBQU8sRUFBQztJQUNoRCxNQUFNQyxjQUFjLE1BQU1QLHFEQUFPQTtJQUVqQyxJQUFJSSxLQUFLSSxNQUFNLEVBQUU7UUFDZixNQUFNQSxTQUFTUCwwREFBYUEsQ0FBQ0csS0FBS0ksTUFBTTtRQUN4Q0QsWUFBWUUsR0FBRyxDQUFDLFVBQVVELFFBQVE7WUFBRUUsTUFBTTtZQUFLQyxRQUFRLEtBQUssS0FBSyxLQUFLO1FBQUk7SUFDNUU7SUFFQSxPQUFPQyxTQUFTUCxJQUFJLENBQUM7UUFBRVEsSUFBSTtJQUFLO0FBQ2xDIiwic291cmNlcyI6WyIvVXNlcnMva2FpaGthc2hhbi9Eb2N1bWVudHMvd2FuZHIvc3JjL2FwcC9hcGkvcHJlZmVyZW5jZXMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyByZXNvbHZlTG9jYWxlIH0gZnJvbSBcIkAvbGliL2xvY2FsZVwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSk7XG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gYXdhaXQgY29va2llcygpO1xuXG4gIGlmIChib2R5LmxvY2FsZSkge1xuICAgIGNvbnN0IGxvY2FsZSA9IHJlc29sdmVMb2NhbGUoYm9keS5sb2NhbGUpO1xuICAgIGNvb2tpZVN0b3JlLnNldChcImxvY2FsZVwiLCBsb2NhbGUsIHsgcGF0aDogXCIvXCIsIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMzY1IH0pO1xuICB9XG5cbiAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSB9KTtcbn1cbiJdLCJuYW1lcyI6WyJjb29raWVzIiwicmVzb2x2ZUxvY2FsZSIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsImpzb24iLCJjYXRjaCIsImNvb2tpZVN0b3JlIiwibG9jYWxlIiwic2V0IiwicGF0aCIsIm1heEFnZSIsIlJlc3BvbnNlIiwib2siXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/preferences/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/locale.ts":
/*!***************************!*\
  !*** ./src/lib/locale.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DEFAULT_LOCALE: () => (/* binding */ DEFAULT_LOCALE),\n/* harmony export */   LOCALES: () => (/* binding */ LOCALES),\n/* harmony export */   LOCALE_LABELS: () => (/* binding */ LOCALE_LABELS),\n/* harmony export */   isValidLocale: () => (/* binding */ isValidLocale),\n/* harmony export */   resolveLocale: () => (/* binding */ resolveLocale)\n/* harmony export */ });\nconst LOCALES = [\n    \"en\",\n    \"de\",\n    \"fr\",\n    \"es\"\n];\nconst LOCALE_LABELS = {\n    en: \"English\",\n    de: \"Deutsch\",\n    fr: \"Français\",\n    es: \"Español\"\n};\nconst DEFAULT_LOCALE = \"en\";\nfunction isValidLocale(value) {\n    return LOCALES.includes(value);\n}\nfunction resolveLocale(value) {\n    if (value && isValidLocale(value)) return value;\n    return DEFAULT_LOCALE;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2xvY2FsZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVPLE1BQU1BLFVBQW9CO0lBQUM7SUFBTTtJQUFNO0lBQU07Q0FBSyxDQUFDO0FBRW5ELE1BQU1DLGdCQUF3QztJQUNuREMsSUFBSTtJQUNKQyxJQUFJO0lBQ0pDLElBQUk7SUFDSkMsSUFBSTtBQUNOLEVBQUU7QUFFSyxNQUFNQyxpQkFBeUIsS0FBSztBQUVwQyxTQUFTQyxjQUFjQyxLQUFhO0lBQ3pDLE9BQU9SLFFBQVFTLFFBQVEsQ0FBQ0Q7QUFDMUI7QUFFTyxTQUFTRSxjQUFjRixLQUFnQztJQUM1RCxJQUFJQSxTQUFTRCxjQUFjQyxRQUFRLE9BQU9BO0lBQzFDLE9BQU9GO0FBQ1QiLCJzb3VyY2VzIjpbIi9Vc2Vycy9rYWloa2FzaGFuL0RvY3VtZW50cy93YW5kci9zcmMvbGliL2xvY2FsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IExvY2FsZSB9IGZyb20gXCJAL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBMT0NBTEVTOiBMb2NhbGVbXSA9IFtcImVuXCIsIFwiZGVcIiwgXCJmclwiLCBcImVzXCJdO1xuXG5leHBvcnQgY29uc3QgTE9DQUxFX0xBQkVMUzogUmVjb3JkPExvY2FsZSwgc3RyaW5nPiA9IHtcbiAgZW46IFwiRW5nbGlzaFwiLFxuICBkZTogXCJEZXV0c2NoXCIsXG4gIGZyOiBcIkZyYW7Dp2Fpc1wiLFxuICBlczogXCJFc3Bhw7FvbFwiLFxufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTE9DQUxFOiBMb2NhbGUgPSBcImVuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkTG9jYWxlKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBMb2NhbGUge1xuICByZXR1cm4gTE9DQUxFUy5pbmNsdWRlcyh2YWx1ZSBhcyBMb2NhbGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUxvY2FsZSh2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IExvY2FsZSB7XG4gIGlmICh2YWx1ZSAmJiBpc1ZhbGlkTG9jYWxlKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICByZXR1cm4gREVGQVVMVF9MT0NBTEU7XG59XG4iXSwibmFtZXMiOlsiTE9DQUxFUyIsIkxPQ0FMRV9MQUJFTFMiLCJlbiIsImRlIiwiZnIiLCJlcyIsIkRFRkFVTFRfTE9DQUxFIiwiaXNWYWxpZExvY2FsZSIsInZhbHVlIiwiaW5jbHVkZXMiLCJyZXNvbHZlTG9jYWxlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/locale.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpreferences%2Froute&page=%2Fapi%2Fpreferences%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpreferences%2Froute.ts&appDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fkaihkashan%2FDocuments%2Fwandr&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();