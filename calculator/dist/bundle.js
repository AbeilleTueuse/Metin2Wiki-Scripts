/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/Attack.ts":
/*!****************************!*\
  !*** ./src/core/Attack.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Attack)\n/* harmony export */ });\nclass Attack {\n    constructor(power, multiplier) {\n        this.power = power;\n        this.multiplier = multiplier;\n    }\n    calculateDamage() {\n        return this.power * this.multiplier;\n    }\n}\n\n\n//# sourceURL=webpack://refactor/./src/core/Attack.ts?");

/***/ }),

/***/ "./src/core/Character.ts":
/*!*******************************!*\
  !*** ./src/core/Character.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Character)\n/* harmony export */ });\nclass Character {\n    constructor(name, attack) {\n        this.name = name;\n        this.attack = attack;\n    }\n    performAttack() {\n        console.log(`${this.name} attaque avec ${this.attack.power} de puissance!`);\n        return this.attack.calculateDamage();\n    }\n}\n\n\n//# sourceURL=webpack://refactor/./src/core/Character.ts?");

/***/ }),

/***/ "./src/core/Damage.ts":
/*!****************************!*\
  !*** ./src/core/Damage.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Damage)\n/* harmony export */ });\nclass Damage {\n    constructor(attack) {\n        this.attack = attack;\n    }\n    calculate() {\n        return this.attack.calculateDamage();\n    }\n}\n\n\n//# sourceURL=webpack://refactor/./src/core/Damage.ts?");

/***/ }),

/***/ "./src/core/Enemy.ts":
/*!***************************!*\
  !*** ./src/core/Enemy.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Enemy)\n/* harmony export */ });\nclass Enemy {\n    constructor(name, health) {\n        this.name = name;\n        this.health = health;\n    }\n    takeDamage(damage) {\n        this.health -= damage;\n        console.log(`${this.name} subit ${damage} de dégâts. Vie restante: ${this.health}`);\n    }\n}\n\n\n//# sourceURL=webpack://refactor/./src/core/Enemy.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_Attack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Attack */ \"./src/core/Attack.ts\");\n/* harmony import */ var _core_Character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/Character */ \"./src/core/Character.ts\");\n/* harmony import */ var _core_Damage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/Damage */ \"./src/core/Damage.ts\");\n/* harmony import */ var _core_Enemy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/Enemy */ \"./src/core/Enemy.ts\");\n\n\n\n\n// Création d'une attaque (50 de puissance, multiplicateur 1.5)\nconst attack = new _core_Attack__WEBPACK_IMPORTED_MODULE_0__[\"default\"](50, 1.5);\n// Création d'un personnage avec cette attaque\nconst hero = new _core_Character__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"Héros\", attack);\n// Création d'un ennemi avec 200 de vie\nconst enemy = new _core_Enemy__WEBPACK_IMPORTED_MODULE_3__[\"default\"](\"Dragon\", 200);\n// Le héros effectue l'attaque et les dégâts sont calculés\nconst heroDamage = hero.performAttack(); // Appelle la méthode pour attaquer\n// Calcul des dégâts à l'aide de la classe Damage\nconst damageCalculator = new _core_Damage__WEBPACK_IMPORTED_MODULE_2__[\"default\"](attack);\nconst calculatedDamage = damageCalculator.calculate(); // Calcule les dégâts via Damage\n// Affichage des dégâts dans la console\nconsole.log(`${hero.name} inflige ${heroDamage} points de dégâts.`);\n// L'ennemi subit les dégâts\nenemy.takeDamage(calculatedDamage); // L'ennemi prend les dégâts calculés\n// Vérification de la vie restante de l'ennemi\nconsole.log(`${enemy.name} a maintenant ${enemy.health} points de vie restants.`);\n\n\n//# sourceURL=webpack://refactor/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;