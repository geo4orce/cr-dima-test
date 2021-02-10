// declare const ENV;
// declare const PKG;

// css
import './index.scss';

// js
import Vue from 'vue';
import app from './app.vue';

document.title = PKG.description;
const vm = new Vue(app);
vm.ENV = ENV;
vm.PKG = PKG;

// @DEBUG
// window.vm = vm;
// vm.status = 'abc';
// vm.processMockFull();
// vm.settingsOpen();
