/*!
 * commands.js
 * COMMAND PATTERN — Padrão Comportamental GoF
 * Encapsula ações de acessibilidade como objetos Command
 * permitindo undo/redo, macros e auditoria.
 */

export function Command() {}
Command.prototype.execute = function () { throw new Error('execute() deve ser implementado'); };
Command.prototype.undo = function () { throw new Error('undo() deve ser implementado'); };

export function ToggleAccessibilityCommand(key, state, root) {
  this.key = key;
  this.state = state;
  this.root = root;
  this.previousValue = state.toggles[key];
}
ToggleAccessibilityCommand.prototype = Object.create(Command.prototype);
ToggleAccessibilityCommand.prototype.execute = function () {
  this.state.toggles[this.key] = !this.previousValue;
  this._updateUI();
};
ToggleAccessibilityCommand.prototype.undo = function () {
  this.state.toggles[this.key] = this.previousValue;
  this._updateUI();
};
ToggleAccessibilityCommand.prototype._updateUI = function () {
  var btn = this.root.querySelector('[data-toggle="' + this.key + '"]');
  if (btn) {
    btn.classList.toggle('active', this.state.toggles[this.key]);
    btn.setAttribute('aria-pressed', String(this.state.toggles[this.key]));
  }
};

export function ZoomCommand(newZoom, state, zoomValEl) {
  this.newZoom = Math.max(80, Math.min(180, newZoom));
  this.state = state;
  this.zoomValEl = zoomValEl;
  this.previousZoom = state.zoom;
}
ZoomCommand.prototype = Object.create(Command.prototype);
ZoomCommand.prototype.execute = function () {
  this.state.zoom = this.newZoom;
  this._updateDisplay();
};
ZoomCommand.prototype.undo = function () {
  this.state.zoom = this.previousZoom;
  this._updateDisplay();
};
ZoomCommand.prototype._updateDisplay = function () {
  if (this.zoomValEl) this.zoomValEl.textContent = this.state.zoom + '%';
};

export function SetLanguageCommand(language, state) {
  this.language = language;
  this.state = state;
  this.previousLanguage = state.lang;
}
SetLanguageCommand.prototype = Object.create(Command.prototype);
SetLanguageCommand.prototype.execute = function () {
  this.state.lang = this.language;
  this.state._appliedLang = null;
};
SetLanguageCommand.prototype.undo = function () {
  this.state.lang = this.previousLanguage;
  this.state._appliedLang = null;
};

export function SetReadingModeCommand(enabled, state, root, readingExitEl) {
  this.enabled = enabled;
  this.state = state;
  this.root = root;
  this.readingExitEl = readingExitEl;
  this.wasEnabled = state.toggles['reading-mode'];
}
SetReadingModeCommand.prototype = Object.create(Command.prototype);
SetReadingModeCommand.prototype.execute = function () {
  this.state.toggles['reading-mode'] = this.enabled;
  this._updateUI();
};
SetReadingModeCommand.prototype.undo = function () {
  this.state.toggles['reading-mode'] = this.wasEnabled;
  this._updateUI();
};
SetReadingModeCommand.prototype._updateUI = function () {
  var btn = this.root.querySelector('[data-toggle="reading-mode"]');
  if (btn) {
    btn.classList.toggle('active', this.state.toggles['reading-mode']);
    btn.setAttribute('aria-pressed', String(this.state.toggles['reading-mode']));
  }
};

export function ResetCommand(state) {
  this.state = state;
  this.previousState = { toggles: Object.assign({}, state.toggles), zoom: state.zoom, lang: state.lang };
}
ResetCommand.prototype = Object.create(Command.prototype);
ResetCommand.prototype.execute = function () {
  this.state.toggles = {};
  this.state.zoom = 100;
  this.state.lang = '';
  this.state._appliedLang = '';
};
ResetCommand.prototype.undo = function () {
  this.state.toggles = this.previousState.toggles;
  this.state.zoom = this.previousState.zoom;
  this.state.lang = this.previousState.lang;
};

/**
 * KeyboardNavCommand — habilita/desabilita navegação por teclado
 * (usa Command pattern para permitir undo/redo do toggle)
 */
export function KeyboardNavCommand(state, domFacade) {
  this.state = state;
  this.domFacade = domFacade;
  this.previousValue = !!state.toggles['keyboard-nav'];
}
KeyboardNavCommand.prototype = Object.create(Command.prototype);
KeyboardNavCommand.prototype.execute = function () {
  this.state.toggles['keyboard-nav'] = !this.previousValue;
  if (this.domFacade && typeof this.domFacade.syncKeyboardNav === 'function') {
    this.domFacade.syncKeyboardNav(this.state.toggles['keyboard-nav']);
  }
};
KeyboardNavCommand.prototype.undo = function () {
  this.state.toggles['keyboard-nav'] = this.previousValue;
  if (this.domFacade && typeof this.domFacade.syncKeyboardNav === 'function') {
    this.domFacade.syncKeyboardNav(this.state.toggles['keyboard-nav']);
  }
};

export function CommandInvoker() {
  this.history = [];
  this.currentIndex = -1;
  this.maxHistory = 50;
}
CommandInvoker.prototype.execute = function (command) {
  command.execute();
  this.history = this.history.slice(0, this.currentIndex + 1);
  this.history.push(command);
  this.currentIndex++;
  if (this.history.length > this.maxHistory) {
    this.history.shift();
    this.currentIndex--;
  }
};
CommandInvoker.prototype.undo = function () {
  if (this.currentIndex > -1) {
    this.history[this.currentIndex].undo();
    this.currentIndex--;
    return true;
  }
  return false;
};
CommandInvoker.prototype.redo = function () {
  if (this.currentIndex < this.history.length - 1) {
    this.currentIndex++;
    this.history[this.currentIndex].execute();
    return true;
  }
  return false;
};
CommandInvoker.prototype.canUndo = function () { return this.currentIndex > -1; };
CommandInvoker.prototype.canRedo = function () { return this.currentIndex < this.history.length - 1; };
CommandInvoker.prototype.getHistory = function () { return this.history.map(function (cmd) { return cmd.constructor.name; }); };
CommandInvoker.prototype.getHistorySize = function () { return this.history.length; };
