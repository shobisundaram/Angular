// node_modules/zone.js/fesm2015/zone.js
var global = globalThis;
function __symbol__(name) {
  const symbolPrefix = global["__Zone_symbol_prefix"] || "__zone_symbol__";
  return symbolPrefix + name;
}
function initZone() {
  const performance = global["performance"];
  function mark(name) {
    performance && performance["mark"] && performance["mark"](name);
  }
  function performanceMeasure(name, label) {
    performance && performance["measure"] && performance["measure"](name, label);
  }
  mark("Zone");
  const _ZoneImpl = class _ZoneImpl {
    static assertZonePatched() {
      if (global["Promise"] !== patches["ZoneAwarePromise"]) {
        throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
    }
    static get root() {
      let zone = _ZoneImpl.current;
      while (zone.parent) {
        zone = zone.parent;
      }
      return zone;
    }
    static get current() {
      return _currentZoneFrame.zone;
    }
    static get currentTask() {
      return _currentTask;
    }
    // tslint:disable-next-line:require-internal-with-underscore
    static __load_patch(name, fn, ignoreDuplicate = false) {
      if (patches.hasOwnProperty(name)) {
        const checkDuplicate = global[__symbol__("forceDuplicateZoneCheck")] === true;
        if (!ignoreDuplicate && checkDuplicate) {
          throw Error("Already loaded patch: " + name);
        }
      } else if (!global["__Zone_disable_" + name]) {
        const perfName = "Zone:" + name;
        mark(perfName);
        patches[name] = fn(global, _ZoneImpl, _api);
        performanceMeasure(perfName, perfName);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(parent, zoneSpec) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }
    get(key) {
      const zone = this.getZoneWith(key);
      if (zone)
        return zone._properties[key];
    }
    getZoneWith(key) {
      let current = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }
    fork(zoneSpec) {
      if (!zoneSpec)
        throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, zoneSpec);
    }
    wrap(callback, source) {
      if (typeof callback !== "function") {
        throw new Error("Expecting function got: " + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone = this;
      return function() {
        return zone.runGuarded(_callback, this, arguments, source);
      };
    }
    run(callback, applyThis, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runGuarded(callback, applyThis = null, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runTask(task, applyThis, applyArgs) {
      if (task.zone != this) {
        throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      }
      if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
        return;
      }
      const reEntryGuard = task.state != running;
      reEntryGuard && task._transitionTo(running, scheduled);
      task.runCount++;
      const previousTask = _currentTask;
      _currentTask = task;
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        if (task.type == macroTask && task.data && !task.data.isPeriodic) {
          task.cancelFn = void 0;
        }
        try {
          return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        if (task.state !== notScheduled && task.state !== unknown) {
          if (task.type == eventTask || task.data && task.data.isPeriodic) {
            reEntryGuard && task._transitionTo(scheduled, running);
          } else {
            task.runCount = 0;
            this._updateTaskCount(task, -1);
            reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
          }
        }
        _currentZoneFrame = _currentZoneFrame.parent;
        _currentTask = previousTask;
      }
    }
    scheduleTask(task) {
      if (task.zone && task.zone !== this) {
        let newZone = this;
        while (newZone) {
          if (newZone === task.zone) {
            throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
          }
          newZone = newZone.parent;
        }
      }
      task._transitionTo(scheduling, notScheduled);
      const zoneDelegates = [];
      task._zoneDelegates = zoneDelegates;
      task._zone = this;
      try {
        task = this._zoneDelegate.scheduleTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, scheduling, notScheduled);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      if (task._zoneDelegates === zoneDelegates) {
        this._updateTaskCount(task, 1);
      }
      if (task.state == scheduling) {
        task._transitionTo(scheduled, scheduling);
      }
      return task;
    }
    scheduleMicroTask(source, callback, data, customSchedule) {
      return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
    }
    scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
    }
    scheduleEventTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
    }
    cancelTask(task) {
      if (task.zone != this)
        throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      if (task.state !== scheduled && task.state !== running) {
        return;
      }
      task._transitionTo(canceling, scheduled, running);
      try {
        this._zoneDelegate.cancelTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, canceling);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      this._updateTaskCount(task, -1);
      task._transitionTo(notScheduled, canceling);
      task.runCount = 0;
      return task;
    }
    _updateTaskCount(task, count) {
      const zoneDelegates = task._zoneDelegates;
      if (count == -1) {
        task._zoneDelegates = null;
      }
      for (let i = 0; i < zoneDelegates.length; i++) {
        zoneDelegates[i]._updateTaskCount(task.type, count);
      }
    }
  };
  _ZoneImpl.__symbol__ = __symbol__;
  let ZoneImpl = _ZoneImpl;
  const DELEGATE_ZS = {
    name: "",
    onHasTask: (delegate, _, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate, _, target, task) => delegate.scheduleTask(target, task),
    onInvokeTask: (delegate, _, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate, _, target, task) => delegate.cancelTask(target, task)
  };
  class _ZoneDelegate {
    get zone() {
      return this._zone;
    }
    constructor(zone, parentDelegate, zoneSpec) {
      this._taskCounts = {
        "microTask": 0,
        "macroTask": 0,
        "eventTask": 0
      };
      this._zone = zone;
      this._parentDelegate = parentDelegate;
      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this._zone : parentDelegate._forkCurrZone);
      this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this._zone : parentDelegate._interceptCurrZone);
      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this._zone : parentDelegate._invokeCurrZone);
      this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this._zone : parentDelegate._handleErrorCurrZone);
      this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this._zone : parentDelegate._scheduleTaskCurrZone);
      this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this._zone : parentDelegate._invokeTaskCurrZone);
      this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this._zone : parentDelegate._cancelTaskCurrZone);
      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;
      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = this._zone;
        if (!zoneSpec.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate;
          this._scheduleTaskCurrZone = this._zone;
        }
        if (!zoneSpec.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate;
          this._invokeTaskCurrZone = this._zone;
        }
        if (!zoneSpec.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate;
          this._cancelTaskCurrZone = this._zone;
        }
      }
    }
    fork(targetZone, zoneSpec) {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new ZoneImpl(targetZone, zoneSpec);
    }
    intercept(targetZone, callback, source) {
      return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
    }
    invoke(targetZone, callback, applyThis, applyArgs, source) {
      return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
    }
    handleError(targetZone, error) {
      return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
    }
    scheduleTask(targetZone, task) {
      let returnTask = task;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
        }
        returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        if (!returnTask)
          returnTask = task;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask(task);
        } else {
          throw new Error("Task is missing scheduleFn.");
        }
      }
      return returnTask;
    }
    invokeTask(targetZone, task, applyThis, applyArgs) {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
    }
    cancelTask(targetZone, task) {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error("Task is not cancelable");
        }
        value = task.cancelFn(task);
      }
      return value;
    }
    hasTask(targetZone, isEmpty) {
      try {
        this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type, count) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error("More tasks executed then were scheduled.");
      }
      if (prev == 0 || next == 0) {
        const isEmpty = {
          microTask: counts["microTask"] > 0,
          macroTask: counts["macroTask"] > 0,
          eventTask: counts["eventTask"] > 0,
          change: type
        };
        this.hasTask(this._zone, isEmpty);
      }
    }
  }
  class ZoneTask {
    constructor(type, source, callback, options, scheduleFn, cancelFn) {
      this._zone = null;
      this.runCount = 0;
      this._zoneDelegates = null;
      this._state = "notScheduled";
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error("callback is not defined");
      }
      this.callback = callback;
      const self2 = this;
      if (type === eventTask && options && options.useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global, self2, this, arguments);
        };
      }
    }
    static invokeTask(task, target, args) {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState, fromState1, fromState2) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
      }
    }
    toString() {
      if (this.data && typeof this.data.handleId !== "undefined") {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }
    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }
  const symbolSetTimeout = __symbol__("setTimeout");
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  let _microTaskQueue = [];
  let _isDrainingMicrotaskQueue = false;
  let nativeMicroTaskQueuePromise;
  function nativeScheduleMicroTask(func) {
    if (!nativeMicroTaskQueuePromise) {
      if (global[symbolPromise]) {
        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        nativeThen = nativeMicroTaskQueuePromise["then"];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global[symbolSetTimeout](func, 0);
    }
  }
  function scheduleMicroTask(task) {
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }
  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }
  const NO_ZONE = { name: "NO ZONE" };
  const notScheduled = "notScheduled", scheduling = "scheduling", scheduled = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
  const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
  const patches = {};
  const _api = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop,
    microtaskDrainDone: noop,
    scheduleMicroTask,
    showUncaughtError: () => !ZoneImpl[__symbol__("ignoreConsoleErrorUncaughtError")],
    patchEventTarget: () => [],
    patchOnProperties: noop,
    patchMethod: () => noop,
    bindArguments: () => [],
    patchThen: () => noop,
    patchMacroTask: () => noop,
    patchEventPrototype: () => noop,
    isIEOrEdge: () => false,
    getGlobalObjects: () => void 0,
    ObjectDefineProperty: () => noop,
    ObjectGetOwnPropertyDescriptor: () => void 0,
    ObjectCreate: () => void 0,
    ArraySlice: () => [],
    patchClass: () => noop,
    wrapWithCurrentZone: () => noop,
    filterProperties: () => [],
    attachOriginToPatched: () => noop,
    _redefineProperty: () => noop,
    patchCallbacks: () => noop,
    nativeScheduleMicroTask
  };
  let _currentZoneFrame = { parent: null, zone: new ZoneImpl(null, null) };
  let _currentTask = null;
  let _numberOfNestedTaskFrames = 0;
  function noop() {
  }
  performanceMeasure("Zone", "Zone");
  return ZoneImpl;
}
function loadZone() {
  const global2 = globalThis;
  const checkDuplicate = global2[__symbol__("forceDuplicateZoneCheck")] === true;
  if (global2["Zone"] && (checkDuplicate || typeof global2["Zone"].__symbol__ !== "function")) {
    throw new Error("Zone already loaded.");
  }
  global2["Zone"] ??= initZone();
  return global2["Zone"];
}
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ObjectDefineProperty = Object.defineProperty;
var ObjectGetPrototypeOf = Object.getPrototypeOf;
var ObjectCreate = Object.create;
var ArraySlice = Array.prototype.slice;
var ADD_EVENT_LISTENER_STR = "addEventListener";
var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
var ZONE_SYMBOL_ADD_EVENT_LISTENER = __symbol__(ADD_EVENT_LISTENER_STR);
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = __symbol__(REMOVE_EVENT_LISTENER_STR);
var TRUE_STR = "true";
var FALSE_STR = "false";
var ZONE_SYMBOL_PREFIX = __symbol__("");
function wrapWithCurrentZone(callback, source) {
  return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
  return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = __symbol__;
var isWindowExists = typeof window !== "undefined";
var internalWindow = isWindowExists ? window : void 0;
var _global = isWindowExists && internalWindow || globalThis;
var REMOVE_ATTRIBUTE = "removeAttribute";
function bindArguments(args, source) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === "function") {
      args[i] = wrapWithCurrentZone(args[i], source + "_" + i);
    }
  }
  return args;
}
function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor["name"];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
      if (!isPropertyWritable(prototypeDesc)) {
        continue;
      }
      prototype[name] = ((delegate2) => {
        const patched = function() {
          return delegate2.apply(this, bindArguments(arguments, source + "." + name));
        };
        attachOriginToPatched(patched, delegate2);
        return patched;
      })(delegate);
    }
  }
}
function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }
  if (propertyDesc.writable === false) {
    return false;
  }
  return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
}
var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var isNode = !("nw" in _global) && typeof _global.process !== "undefined" && _global.process.toString() === "[object process]";
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var isMix = typeof _global.process !== "undefined" && _global.process.toString() === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var zoneSymbolEventNames$1 = {};
var wrapFn = function(event) {
  event = event || _global.event;
  if (!event) {
    return;
  }
  let eventNameSymbol = zoneSymbolEventNames$1[event.type];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
  }
  const target = this || event.target || _global;
  const listener = target[eventNameSymbol];
  let result;
  if (isBrowser && target === internalWindow && event.type === "error") {
    const errorEvent = event;
    result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
    if (result === true) {
      event.preventDefault();
    }
  } else {
    result = listener && listener.apply(this, arguments);
    if (result != void 0 && !result) {
      event.preventDefault();
    }
  }
  return result;
};
function patchProperty(obj, prop, prototype) {
  let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
  if (!desc && prototype) {
    const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
    if (prototypeDesc) {
      desc = { enumerable: true, configurable: true };
    }
  }
  if (!desc || !desc.configurable) {
    return;
  }
  const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
  if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
    return;
  }
  delete desc.writable;
  delete desc.value;
  const originalDescGet = desc.get;
  const originalDescSet = desc.set;
  const eventName = prop.slice(2);
  let eventNameSymbol = zoneSymbolEventNames$1[eventName];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
  }
  desc.set = function(newValue) {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return;
    }
    const previousValue = target[eventNameSymbol];
    if (typeof previousValue === "function") {
      target.removeEventListener(eventName, wrapFn);
    }
    originalDescSet && originalDescSet.call(target, null);
    target[eventNameSymbol] = newValue;
    if (typeof newValue === "function") {
      target.addEventListener(eventName, wrapFn, false);
    }
  };
  desc.get = function() {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return null;
    }
    const listener = target[eventNameSymbol];
    if (listener) {
      return listener;
    } else if (originalDescGet) {
      let value = originalDescGet.call(this);
      if (value) {
        desc.set.call(this, value);
        if (typeof target[REMOVE_ATTRIBUTE] === "function") {
          target.removeAttribute(prop);
        }
        return value;
      }
    }
    return null;
  };
  ObjectDefineProperty(obj, prop, desc);
  obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, "on" + properties[i], prototype);
    }
  } else {
    const onProperties = [];
    for (const prop in obj) {
      if (prop.slice(0, 2) == "on") {
        onProperties.push(prop);
      }
    }
    for (let j = 0; j < onProperties.length; j++) {
      patchProperty(obj, onProperties[j], prototype);
    }
  }
}
var originalInstanceKey = zoneSymbol("originalInstance");
function patchClass(className) {
  const OriginalClass = _global[className];
  if (!OriginalClass)
    return;
  _global[zoneSymbol(className)] = OriginalClass;
  _global[className] = function() {
    const a = bindArguments(arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error("Arg list too long.");
    }
  };
  attachOriginToPatched(_global[className], OriginalClass);
  const instance = new OriginalClass(function() {
  });
  let prop;
  for (prop in instance) {
    if (className === "XMLHttpRequest" && prop === "responseBlob")
      continue;
    (function(prop2) {
      if (typeof instance[prop2] === "function") {
        _global[className].prototype[prop2] = function() {
          return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
        };
      } else {
        ObjectDefineProperty(_global[className].prototype, prop2, {
          set: function(fn) {
            if (typeof fn === "function") {
              this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
              attachOriginToPatched(this[originalInstanceKey][prop2], fn);
            } else {
              this[originalInstanceKey][prop2] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop2];
          }
        });
      }
    })(prop);
  }
  for (prop in OriginalClass) {
    if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
      _global[className][prop] = OriginalClass[prop];
    }
  }
}
function patchMethod(target, name, patchFn) {
  let proto = target;
  while (proto && !proto.hasOwnProperty(name)) {
    proto = ObjectGetPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate = null;
  if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
    delegate = proto[delegateName] = proto[name];
    const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
    if (isPropertyWritable(desc)) {
      const patchDelegate = patchFn(delegate, delegateName, name);
      proto[name] = function() {
        return patchDelegate(this, arguments);
      };
      attachOriginToPatched(proto[name], delegate);
    }
  }
  return delegate;
}
function patchMacroTask(obj, funcName, metaCreator) {
  let setNative = null;
  function scheduleTask(task) {
    const data = task.data;
    data.args[data.cbIdx] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }
  setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
    const meta = metaCreator(self2, args);
    if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
      return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
    } else {
      return delegate.apply(self2, args);
    }
  });
}
function attachOriginToPatched(patched, original) {
  patched[zoneSymbol("OriginalDelegate")] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1) {
      return true;
    }
  } catch (error) {
  }
  return false;
}
function isIEOrEdge() {
  if (isDetectedIEOrEdge) {
    return ieOrEdge;
  }
  isDetectedIEOrEdge = true;
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1 || ua.indexOf("Edge/") !== -1) {
      ieOrEdge = true;
    }
  } catch (error) {
  }
  return ieOrEdge;
}
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
  useG: true
};
var zoneSymbolEventNames = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
function prepareEventNames(eventName, eventNameToString) {
  const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
  const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
  const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
  const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
  zoneSymbolEventNames[eventName] = {};
  zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
  zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
}
function patchEventTarget(_global2, api, apis, patchOptions) {
  const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
  const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
  const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
  const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
  const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
  const PREPEND_EVENT_LISTENER = "prependListener";
  const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
  const invokeTask = function(task, target, event) {
    if (task.isRemoved) {
      return;
    }
    const delegate = task.callback;
    if (typeof delegate === "object" && delegate.handleEvent) {
      task.callback = (event2) => delegate.handleEvent(event2);
      task.originalDelegate = delegate;
    }
    let error;
    try {
      task.invoke(task, target, [event]);
    } catch (err) {
      error = err;
    }
    const options = task.options;
    if (options && typeof options === "object" && options.once) {
      const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
      target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
    }
    return error;
  };
  function globalCallback(context, event, isCapture) {
    event = event || _global2.event;
    if (!event) {
      return;
    }
    const target = context || event.target || _global2;
    const tasks = target[zoneSymbolEventNames[event.type][isCapture ? TRUE_STR : FALSE_STR]];
    if (tasks) {
      const errors = [];
      if (tasks.length === 1) {
        const err = invokeTask(tasks[0], target, event);
        err && errors.push(err);
      } else {
        const copyTasks = tasks.slice();
        for (let i = 0; i < copyTasks.length; i++) {
          if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
            break;
          }
          const err = invokeTask(copyTasks[i], target, event);
          err && errors.push(err);
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          api.nativeScheduleMicroTask(() => {
            throw err;
          });
        }
      }
    }
  }
  const globalZoneAwareCallback = function(event) {
    return globalCallback(this, event, false);
  };
  const globalZoneAwareCaptureCallback = function(event) {
    return globalCallback(this, event, true);
  };
  function patchEventTargetMethods(obj, patchOptions2) {
    if (!obj) {
      return false;
    }
    let useGlobalCallback = true;
    if (patchOptions2 && patchOptions2.useG !== void 0) {
      useGlobalCallback = patchOptions2.useG;
    }
    const validateHandler = patchOptions2 && patchOptions2.vh;
    let checkDuplicate = true;
    if (patchOptions2 && patchOptions2.chkDup !== void 0) {
      checkDuplicate = patchOptions2.chkDup;
    }
    let returnTarget = false;
    if (patchOptions2 && patchOptions2.rt !== void 0) {
      returnTarget = patchOptions2.rt;
    }
    let proto = obj;
    while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && obj[ADD_EVENT_LISTENER]) {
      proto = obj;
    }
    if (!proto) {
      return false;
    }
    if (proto[zoneSymbolAddEventListener]) {
      return false;
    }
    const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
    const taskData = {};
    const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
    const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
    const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
    const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
    let nativePrependEventListener;
    if (patchOptions2 && patchOptions2.prepend) {
      nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
    }
    function buildEventListenerOptions(options, passive) {
      if (!passiveSupported && typeof options === "object" && options) {
        return !!options.capture;
      }
      if (!passiveSupported || !passive) {
        return options;
      }
      if (typeof options === "boolean") {
        return { capture: options, passive: true };
      }
      if (!options) {
        return { passive: true };
      }
      if (typeof options === "object" && options.passive !== false) {
        return { ...options, passive: true };
      }
      return options;
    }
    const customScheduleGlobal = function(task) {
      if (taskData.isExisting) {
        return;
      }
      return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
    };
    const customCancelGlobal = function(task) {
      if (!task.isRemoved) {
        const symbolEventNames = zoneSymbolEventNames[task.eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && task.target[symbolEventName];
        if (existingTasks) {
          for (let i = 0; i < existingTasks.length; i++) {
            const existingTask = existingTasks[i];
            if (existingTask === task) {
              existingTasks.splice(i, 1);
              task.isRemoved = true;
              if (task.removeAbortListener) {
                task.removeAbortListener();
                task.removeAbortListener = null;
              }
              if (existingTasks.length === 0) {
                task.allRemoved = true;
                task.target[symbolEventName] = null;
              }
              break;
            }
          }
        }
      }
      if (!task.allRemoved) {
        return;
      }
      return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
    };
    const customScheduleNonGlobal = function(task) {
      return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customSchedulePrepend = function(task) {
      return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customCancelNonGlobal = function(task) {
      return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
    };
    const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
    const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
    const compareTaskCallbackVsDelegate = function(task, delegate) {
      const typeOfDelegate = typeof delegate;
      return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
    };
    const compare = patchOptions2 && patchOptions2.diff ? patchOptions2.diff : compareTaskCallbackVsDelegate;
    const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
    const passiveEvents = _global2[zoneSymbol("PASSIVE_EVENTS")];
    function copyEventListenerOptions(options) {
      if (typeof options === "object" && options !== null) {
        const newOptions = { ...options };
        if (options.signal) {
          newOptions.signal = options.signal;
        }
        return newOptions;
      }
      return options;
    }
    const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
      return function() {
        const target = this || _global2;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        let delegate = arguments[1];
        if (!delegate) {
          return nativeListener.apply(this, arguments);
        }
        if (isNode && eventName === "uncaughtException") {
          return nativeListener.apply(this, arguments);
        }
        let isHandleEvent = false;
        if (typeof delegate !== "function") {
          if (!delegate.handleEvent) {
            return nativeListener.apply(this, arguments);
          }
          isHandleEvent = true;
        }
        if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
          return;
        }
        const passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
        const options = copyEventListenerOptions(buildEventListenerOptions(arguments[2], passive));
        const signal = options?.signal;
        if (signal?.aborted) {
          return;
        }
        if (unpatchedEvents) {
          for (let i = 0; i < unpatchedEvents.length; i++) {
            if (eventName === unpatchedEvents[i]) {
              if (passive) {
                return nativeListener.call(target, eventName, delegate, options);
              } else {
                return nativeListener.apply(this, arguments);
              }
            }
          }
        }
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const once = options && typeof options === "object" ? options.once : false;
        const zone = Zone.current;
        let symbolEventNames = zoneSymbolEventNames[eventName];
        if (!symbolEventNames) {
          prepareEventNames(eventName, eventNameToString);
          symbolEventNames = zoneSymbolEventNames[eventName];
        }
        const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        let existingTasks = target[symbolEventName];
        let isExisting = false;
        if (existingTasks) {
          isExisting = true;
          if (checkDuplicate) {
            for (let i = 0; i < existingTasks.length; i++) {
              if (compare(existingTasks[i], delegate)) {
                return;
              }
            }
          }
        } else {
          existingTasks = target[symbolEventName] = [];
        }
        let source;
        const constructorName = target.constructor["name"];
        const targetSource = globalSources[constructorName];
        if (targetSource) {
          source = targetSource[eventName];
        }
        if (!source) {
          source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
        }
        taskData.options = options;
        if (once) {
          taskData.options.once = false;
        }
        taskData.target = target;
        taskData.capture = capture;
        taskData.eventName = eventName;
        taskData.isExisting = isExisting;
        const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
        if (data) {
          data.taskData = taskData;
        }
        if (signal) {
          taskData.options.signal = void 0;
        }
        const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
        if (signal) {
          taskData.options.signal = signal;
          const onAbort = () => task.zone.cancelTask(task);
          nativeListener.call(signal, "abort", onAbort, { once: true });
          task.removeAbortListener = () => signal.removeEventListener("abort", onAbort);
        }
        taskData.target = null;
        if (data) {
          data.taskData = null;
        }
        if (once) {
          taskData.options.once = true;
        }
        if (!(!passiveSupported && typeof task.options === "boolean")) {
          task.options = options;
        }
        task.target = target;
        task.capture = capture;
        task.eventName = eventName;
        if (isHandleEvent) {
          task.originalDelegate = delegate;
        }
        if (!prepend) {
          existingTasks.push(task);
        } else {
          existingTasks.unshift(task);
        }
        if (returnTarget2) {
          return target;
        }
      };
    };
    proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
    if (nativePrependEventListener) {
      proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
    }
    proto[REMOVE_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const options = arguments[2];
      const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
      const delegate = arguments[1];
      if (!delegate) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
        return;
      }
      const symbolEventNames = zoneSymbolEventNames[eventName];
      let symbolEventName;
      if (symbolEventNames) {
        symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
      }
      const existingTasks = symbolEventName && target[symbolEventName];
      if (existingTasks) {
        for (let i = 0; i < existingTasks.length; i++) {
          const existingTask = existingTasks[i];
          if (compare(existingTask, delegate)) {
            existingTasks.splice(i, 1);
            existingTask.isRemoved = true;
            if (existingTasks.length === 0) {
              existingTask.allRemoved = true;
              target[symbolEventName] = null;
              if (!capture && typeof eventName === "string") {
                const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                target[onPropertySymbol] = null;
              }
            }
            existingTask.zone.cancelTask(existingTask);
            if (returnTarget) {
              return target;
            }
            return;
          }
        }
      }
      return nativeRemoveEventListener.apply(this, arguments);
    };
    proto[LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const listeners = [];
      const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
        listeners.push(delegate);
      }
      return listeners;
    };
    proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (!eventName) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
          const prop = keys[i];
          const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
          let evtName = match && match[1];
          if (evtName && evtName !== "removeListener") {
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
          }
        }
        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
      } else {
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const symbolEventNames = zoneSymbolEventNames[eventName];
        if (symbolEventNames) {
          const symbolEventName = symbolEventNames[FALSE_STR];
          const symbolCaptureEventName = symbolEventNames[TRUE_STR];
          const tasks = target[symbolEventName];
          const captureTasks = target[symbolCaptureEventName];
          if (tasks) {
            const removeTasks = tasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
          if (captureTasks) {
            const removeTasks = captureTasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
        }
      }
      if (returnTarget) {
        return this;
      }
    };
    attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
    attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
    if (nativeRemoveAllListeners) {
      attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
    }
    if (nativeListeners) {
      attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
    }
    return true;
  }
  let results = [];
  for (let i = 0; i < apis.length; i++) {
    results[i] = patchEventTargetMethods(apis[i], patchOptions);
  }
  return results;
}
function findEventTasks(target, eventName) {
  if (!eventName) {
    const foundTasks = [];
    for (let prop in target) {
      const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
      let evtName = match && match[1];
      if (evtName && (!eventName || evtName === eventName)) {
        const tasks = target[prop];
        if (tasks) {
          for (let i = 0; i < tasks.length; i++) {
            foundTasks.push(tasks[i]);
          }
        }
      }
    }
    return foundTasks;
  }
  let symbolEventName = zoneSymbolEventNames[eventName];
  if (!symbolEventName) {
    prepareEventNames(eventName);
    symbolEventName = zoneSymbolEventNames[eventName];
  }
  const captureFalseTasks = target[symbolEventName[FALSE_STR]];
  const captureTrueTasks = target[symbolEventName[TRUE_STR]];
  if (!captureFalseTasks) {
    return captureTrueTasks ? captureTrueTasks.slice() : [];
  } else {
    return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
  }
}
function patchEventPrototype(global2, api) {
  const Event = global2["Event"];
  if (Event && Event.prototype) {
    api.patchMethod(Event.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
      self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
      delegate && delegate.apply(self2, args);
    });
  }
}
function patchQueueMicrotask(global2, api) {
  api.patchMethod(global2, "queueMicrotask", (delegate) => {
    return function(self2, args) {
      Zone.current.scheduleMicroTask("queueMicrotask", args[0]);
    };
  });
}
var taskSymbol = zoneSymbol("zoneTask");
function patchTimer(window2, setName, cancelName, nameSuffix) {
  let setNative = null;
  let clearNative = null;
  setName += nameSuffix;
  cancelName += nameSuffix;
  const tasksByHandleId = {};
  function scheduleTask(task) {
    const data = task.data;
    data.args[0] = function() {
      return task.invoke.apply(this, arguments);
    };
    data.handleId = setNative.apply(window2, data.args);
    return task;
  }
  function clearTask(task) {
    return clearNative.call(window2, task.data.handleId);
  }
  setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
    if (typeof args[0] === "function") {
      const options = {
        isPeriodic: nameSuffix === "Interval",
        delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
        args
      };
      const callback = args[0];
      args[0] = function timer() {
        try {
          return callback.apply(this, arguments);
        } finally {
          if (!options.isPeriodic) {
            if (typeof options.handleId === "number") {
              delete tasksByHandleId[options.handleId];
            } else if (options.handleId) {
              options.handleId[taskSymbol] = null;
            }
          }
        }
      };
      const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
      if (!task) {
        return task;
      }
      const handle = task.data.handleId;
      if (typeof handle === "number") {
        tasksByHandleId[handle] = task;
      } else if (handle) {
        handle[taskSymbol] = task;
      }
      if (handle && handle.ref && handle.unref && typeof handle.ref === "function" && typeof handle.unref === "function") {
        task.ref = handle.ref.bind(handle);
        task.unref = handle.unref.bind(handle);
      }
      if (typeof handle === "number" || handle) {
        return handle;
      }
      return task;
    } else {
      return delegate.apply(window2, args);
    }
  });
  clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
    const id = args[0];
    let task;
    if (typeof id === "number") {
      task = tasksByHandleId[id];
    } else {
      task = id && id[taskSymbol];
      if (!task) {
        task = id;
      }
    }
    if (task && typeof task.type === "string") {
      if (task.state !== "notScheduled" && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
        if (typeof id === "number") {
          delete tasksByHandleId[id];
        } else if (id) {
          id[taskSymbol] = null;
        }
        task.zone.cancelTask(task);
      }
    } else {
      delegate.apply(window2, args);
    }
  });
}
function patchCustomElements(_global2, api) {
  const { isBrowser: isBrowser2, isMix: isMix2 } = api.getGlobalObjects();
  if (!isBrowser2 && !isMix2 || !_global2["customElements"] || !("customElements" in _global2)) {
    return;
  }
  const callbacks = [
    "connectedCallback",
    "disconnectedCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback"
  ];
  api.patchCallbacks(api, _global2.customElements, "customElements", "define", callbacks);
}
function eventTargetPatch(_global2, api) {
  if (Zone[api.symbol("patchEventTarget")]) {
    return;
  }
  const { eventNames, zoneSymbolEventNames: zoneSymbolEventNames2, TRUE_STR: TRUE_STR2, FALSE_STR: FALSE_STR2, ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2 } = api.getGlobalObjects();
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const falseEventName = eventName + FALSE_STR2;
    const trueEventName = eventName + TRUE_STR2;
    const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR2] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR2] = symbolCapture;
  }
  const EVENT_TARGET = _global2["EventTarget"];
  if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
    return;
  }
  api.patchEventTarget(_global2, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
  return true;
}
function patchEvent(global2, api) {
  api.patchEventPrototype(global2, api);
}
function filterProperties(target, onProperties, ignoreProperties) {
  if (!ignoreProperties || ignoreProperties.length === 0) {
    return onProperties;
  }
  const tip = ignoreProperties.filter((ip) => ip.target === target);
  if (!tip || tip.length === 0) {
    return onProperties;
  }
  const targetIgnoreProperties = tip[0].ignoreProperties;
  return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
  if (!target) {
    return;
  }
  const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
  patchOnProperties(target, filteredProperties, prototype);
}
function getOnEventNames(target) {
  return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
}
function propertyDescriptorPatch(api, _global2) {
  if (isNode && !isMix) {
    return;
  }
  if (Zone[api.symbol("patchEvents")]) {
    return;
  }
  const ignoreProperties = _global2["__Zone_ignore_on_properties"];
  let patchTargets = [];
  if (isBrowser) {
    const internalWindow2 = window;
    patchTargets = patchTargets.concat([
      "Document",
      "SVGElement",
      "Element",
      "HTMLElement",
      "HTMLBodyElement",
      "HTMLMediaElement",
      "HTMLFrameSetElement",
      "HTMLFrameElement",
      "HTMLIFrameElement",
      "HTMLMarqueeElement",
      "Worker"
    ]);
    const ignoreErrorProperties = isIE() ? [{ target: internalWindow2, ignoreProperties: ["error"] }] : [];
    patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
  }
  patchTargets = patchTargets.concat([
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "IDBIndex",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBDatabase",
    "IDBTransaction",
    "IDBCursor",
    "WebSocket"
  ]);
  for (let i = 0; i < patchTargets.length; i++) {
    const target = _global2[patchTargets[i]];
    target && target.prototype && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
  }
}
function patchBrowser(Zone2) {
  Zone2.__load_patch("legacy", (global2) => {
    const legacyPatch = global2[Zone2.__symbol__("legacyPatch")];
    if (legacyPatch) {
      legacyPatch();
    }
  });
  Zone2.__load_patch("timers", (global2) => {
    const set = "set";
    const clear = "clear";
    patchTimer(global2, set, clear, "Timeout");
    patchTimer(global2, set, clear, "Interval");
    patchTimer(global2, set, clear, "Immediate");
  });
  Zone2.__load_patch("requestAnimationFrame", (global2) => {
    patchTimer(global2, "request", "cancel", "AnimationFrame");
    patchTimer(global2, "mozRequest", "mozCancel", "AnimationFrame");
    patchTimer(global2, "webkitRequest", "webkitCancel", "AnimationFrame");
  });
  Zone2.__load_patch("blocking", (global2, Zone3) => {
    const blockingMethods = ["alert", "prompt", "confirm"];
    for (let i = 0; i < blockingMethods.length; i++) {
      const name = blockingMethods[i];
      patchMethod(global2, name, (delegate, symbol, name2) => {
        return function(s, args) {
          return Zone3.current.run(delegate, global2, args, name2);
        };
      });
    }
  });
  Zone2.__load_patch("EventTarget", (global2, Zone3, api) => {
    patchEvent(global2, api);
    eventTargetPatch(global2, api);
    const XMLHttpRequestEventTarget = global2["XMLHttpRequestEventTarget"];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
      api.patchEventTarget(global2, api, [XMLHttpRequestEventTarget.prototype]);
    }
  });
  Zone2.__load_patch("MutationObserver", (global2, Zone3, api) => {
    patchClass("MutationObserver");
    patchClass("WebKitMutationObserver");
  });
  Zone2.__load_patch("IntersectionObserver", (global2, Zone3, api) => {
    patchClass("IntersectionObserver");
  });
  Zone2.__load_patch("FileReader", (global2, Zone3, api) => {
    patchClass("FileReader");
  });
  Zone2.__load_patch("on_property", (global2, Zone3, api) => {
    propertyDescriptorPatch(api, global2);
  });
  Zone2.__load_patch("customElements", (global2, Zone3, api) => {
    patchCustomElements(global2, api);
  });
  Zone2.__load_patch("XHR", (global2, Zone3) => {
    patchXHR(global2);
    const XHR_TASK = zoneSymbol("xhrTask");
    const XHR_SYNC = zoneSymbol("xhrSync");
    const XHR_LISTENER = zoneSymbol("xhrListener");
    const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
    const XHR_URL = zoneSymbol("xhrURL");
    const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
    function patchXHR(window2) {
      const XMLHttpRequest = window2["XMLHttpRequest"];
      if (!XMLHttpRequest) {
        return;
      }
      const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
      function findPendingTask(target) {
        return target[XHR_TASK];
      }
      let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
      let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      if (!oriAddListener) {
        const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
        if (XMLHttpRequestEventTarget) {
          const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
          oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
          oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        }
      }
      const READY_STATE_CHANGE = "readystatechange";
      const SCHEDULED = "scheduled";
      function scheduleTask(task) {
        const data = task.data;
        const target = data.target;
        target[XHR_SCHEDULED] = false;
        target[XHR_ERROR_BEFORE_SCHEDULED] = false;
        const listener = target[XHR_LISTENER];
        if (!oriAddListener) {
          oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
          oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        }
        if (listener) {
          oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
        }
        const newListener = target[XHR_LISTENER] = () => {
          if (target.readyState === target.DONE) {
            if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
              const loadTasks = target[Zone3.__symbol__("loadfalse")];
              if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
                const oriInvoke = task.invoke;
                task.invoke = function() {
                  const loadTasks2 = target[Zone3.__symbol__("loadfalse")];
                  for (let i = 0; i < loadTasks2.length; i++) {
                    if (loadTasks2[i] === task) {
                      loadTasks2.splice(i, 1);
                    }
                  }
                  if (!data.aborted && task.state === SCHEDULED) {
                    oriInvoke.call(task);
                  }
                };
                loadTasks.push(task);
              } else {
                task.invoke();
              }
            } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
              target[XHR_ERROR_BEFORE_SCHEDULED] = true;
            }
          }
        };
        oriAddListener.call(target, READY_STATE_CHANGE, newListener);
        const storedTask = target[XHR_TASK];
        if (!storedTask) {
          target[XHR_TASK] = task;
        }
        sendNative.apply(target, data.args);
        target[XHR_SCHEDULED] = true;
        return task;
      }
      function placeholderCallback() {
      }
      function clearTask(task) {
        const data = task.data;
        data.aborted = true;
        return abortNative.apply(data.target, data.args);
      }
      const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
        self2[XHR_SYNC] = args[2] == false;
        self2[XHR_URL] = args[1];
        return openNative.apply(self2, args);
      });
      const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
      const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
      const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
      const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
        if (Zone3.current[fetchTaskScheduling] === true) {
          return sendNative.apply(self2, args);
        }
        if (self2[XHR_SYNC]) {
          return sendNative.apply(self2, args);
        } else {
          const options = {
            target: self2,
            url: self2[XHR_URL],
            isPeriodic: false,
            args,
            aborted: false
          };
          const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
          if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
            task.invoke();
          }
        }
      });
      const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
        const task = findPendingTask(self2);
        if (task && typeof task.type == "string") {
          if (task.cancelFn == null || task.data && task.data.aborted) {
            return;
          }
          task.zone.cancelTask(task);
        } else if (Zone3.current[fetchTaskAborting] === true) {
          return abortNative.apply(self2, args);
        }
      });
    }
  });
  Zone2.__load_patch("geolocation", (global2) => {
    if (global2["navigator"] && global2["navigator"].geolocation) {
      patchPrototype(global2["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
    }
  });
  Zone2.__load_patch("PromiseRejectionEvent", (global2, Zone3) => {
    function findPromiseRejectionHandler(evtName) {
      return function(e) {
        const eventTasks = findEventTasks(global2, evtName);
        eventTasks.forEach((eventTask) => {
          const PromiseRejectionEvent = global2["PromiseRejectionEvent"];
          if (PromiseRejectionEvent) {
            const evt = new PromiseRejectionEvent(evtName, {
              promise: e.promise,
              reason: e.rejection
            });
            eventTask.invoke(evt);
          }
        });
      };
    }
    if (global2["PromiseRejectionEvent"]) {
      Zone3[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
      Zone3[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
    }
  });
  Zone2.__load_patch("queueMicrotask", (global2, Zone3, api) => {
    patchQueueMicrotask(global2, api);
  });
}
function patchPromise(Zone2) {
  Zone2.__load_patch("ZoneAwarePromise", (global2, Zone3, api) => {
    const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
    const ObjectDefineProperty2 = Object.defineProperty;
    function readableObjectToString(obj) {
      if (obj && obj.toString === Object.prototype.toString) {
        const className = obj.constructor && obj.constructor.name;
        return (className ? className : "") + ": " + JSON.stringify(obj);
      }
      return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    const __symbol__2 = api.symbol;
    const _uncaughtPromiseErrors = [];
    const isDisableWrappingUncaughtPromiseRejection = global2[__symbol__2("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false;
    const symbolPromise = __symbol__2("Promise");
    const symbolThen = __symbol__2("then");
    const creationTrace = "__creationTrace__";
    api.onUnhandledError = (e) => {
      if (api.showUncaughtError()) {
        const rejection = e && e.rejection;
        if (rejection) {
          console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
        } else {
          console.error(e);
        }
      }
    };
    api.microtaskDrainDone = () => {
      while (_uncaughtPromiseErrors.length) {
        const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
        try {
          uncaughtPromiseError.zone.runGuarded(() => {
            if (uncaughtPromiseError.throwOriginal) {
              throw uncaughtPromiseError.rejection;
            }
            throw uncaughtPromiseError;
          });
        } catch (error) {
          handleUnhandledRejection(error);
        }
      }
    };
    const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__2("unhandledPromiseRejectionHandler");
    function handleUnhandledRejection(e) {
      api.onUnhandledError(e);
      try {
        const handler = Zone3[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
        if (typeof handler === "function") {
          handler.call(this, e);
        }
      } catch (err) {
      }
    }
    function isThenable(value) {
      return value && value.then;
    }
    function forwardResolution(value) {
      return value;
    }
    function forwardRejection(rejection) {
      return ZoneAwarePromise.reject(rejection);
    }
    const symbolState = __symbol__2("state");
    const symbolValue = __symbol__2("value");
    const symbolFinally = __symbol__2("finally");
    const symbolParentPromiseValue = __symbol__2("parentPromiseValue");
    const symbolParentPromiseState = __symbol__2("parentPromiseState");
    const source = "Promise.then";
    const UNRESOLVED = null;
    const RESOLVED = true;
    const REJECTED = false;
    const REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
      return (v) => {
        try {
          resolvePromise(promise, state, v);
        } catch (err) {
          resolvePromise(promise, false, err);
        }
      };
    }
    const once = function() {
      let wasCalled = false;
      return function wrapper(wrappedFunction) {
        return function() {
          if (wasCalled) {
            return;
          }
          wasCalled = true;
          wrappedFunction.apply(null, arguments);
        };
      };
    };
    const TYPE_ERROR = "Promise resolved with itself";
    const CURRENT_TASK_TRACE_SYMBOL = __symbol__2("currentTaskTrace");
    function resolvePromise(promise, state, value) {
      const onceWrapper = once();
      if (promise === value) {
        throw new TypeError(TYPE_ERROR);
      }
      if (promise[symbolState] === UNRESOLVED) {
        let then = null;
        try {
          if (typeof value === "object" || typeof value === "function") {
            then = value && value.then;
          }
        } catch (err) {
          onceWrapper(() => {
            resolvePromise(promise, false, err);
          })();
          return promise;
        }
        if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
          clearRejectedNoCatch(value);
          resolvePromise(promise, value[symbolState], value[symbolValue]);
        } else if (state !== REJECTED && typeof then === "function") {
          try {
            then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
          } catch (err) {
            onceWrapper(() => {
              resolvePromise(promise, false, err);
            })();
          }
        } else {
          promise[symbolState] = state;
          const queue = promise[symbolValue];
          promise[symbolValue] = value;
          if (promise[symbolFinally] === symbolFinally) {
            if (state === RESOLVED) {
              promise[symbolState] = promise[symbolParentPromiseState];
              promise[symbolValue] = promise[symbolParentPromiseValue];
            }
          }
          if (state === REJECTED && value instanceof Error) {
            const trace = Zone3.currentTask && Zone3.currentTask.data && Zone3.currentTask.data[creationTrace];
            if (trace) {
              ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: trace
              });
            }
          }
          for (let i = 0; i < queue.length; ) {
            scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
          }
          if (queue.length == 0 && state == REJECTED) {
            promise[symbolState] = REJECTED_NO_CATCH;
            let uncaughtPromiseError = value;
            try {
              throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
            } catch (err) {
              uncaughtPromiseError = err;
            }
            if (isDisableWrappingUncaughtPromiseRejection) {
              uncaughtPromiseError.throwOriginal = true;
            }
            uncaughtPromiseError.rejection = value;
            uncaughtPromiseError.promise = promise;
            uncaughtPromiseError.zone = Zone3.current;
            uncaughtPromiseError.task = Zone3.currentTask;
            _uncaughtPromiseErrors.push(uncaughtPromiseError);
            api.scheduleMicroTask();
          }
        }
      }
      return promise;
    }
    const REJECTION_HANDLED_HANDLER = __symbol__2("rejectionHandledHandler");
    function clearRejectedNoCatch(promise) {
      if (promise[symbolState] === REJECTED_NO_CATCH) {
        try {
          const handler = Zone3[REJECTION_HANDLED_HANDLER];
          if (handler && typeof handler === "function") {
            handler.call(this, { rejection: promise[symbolValue], promise });
          }
        } catch (err) {
        }
        promise[symbolState] = REJECTED;
        for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
          if (promise === _uncaughtPromiseErrors[i].promise) {
            _uncaughtPromiseErrors.splice(i, 1);
          }
        }
      }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
      clearRejectedNoCatch(promise);
      const promiseState = promise[symbolState];
      const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
      zone.scheduleMicroTask(source, () => {
        try {
          const parentPromiseValue = promise[symbolValue];
          const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
          if (isFinallyPromise) {
            chainPromise[symbolParentPromiseValue] = parentPromiseValue;
            chainPromise[symbolParentPromiseState] = promiseState;
          }
          const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
          resolvePromise(chainPromise, true, value);
        } catch (error) {
          resolvePromise(chainPromise, false, error);
        }
      }, chainPromise);
    }
    const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
    const noop = function() {
    };
    const AggregateError = global2.AggregateError;
    class ZoneAwarePromise {
      static toString() {
        return ZONE_AWARE_PROMISE_TO_STRING;
      }
      static resolve(value) {
        if (value instanceof ZoneAwarePromise) {
          return value;
        }
        return resolvePromise(new this(null), RESOLVED, value);
      }
      static reject(error) {
        return resolvePromise(new this(null), REJECTED, error);
      }
      static withResolvers() {
        const result = {};
        result.promise = new ZoneAwarePromise((res, rej) => {
          result.resolve = res;
          result.reject = rej;
        });
        return result;
      }
      static any(values) {
        if (!values || typeof values[Symbol.iterator] !== "function") {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        const promises = [];
        let count = 0;
        try {
          for (let v of values) {
            count++;
            promises.push(ZoneAwarePromise.resolve(v));
          }
        } catch (err) {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        if (count === 0) {
          return Promise.reject(new AggregateError([], "All promises were rejected"));
        }
        let finished = false;
        const errors = [];
        return new ZoneAwarePromise((resolve, reject) => {
          for (let i = 0; i < promises.length; i++) {
            promises[i].then((v) => {
              if (finished) {
                return;
              }
              finished = true;
              resolve(v);
            }, (err) => {
              errors.push(err);
              count--;
              if (count === 0) {
                finished = true;
                reject(new AggregateError(errors, "All promises were rejected"));
              }
            });
          }
        });
      }
      static race(values) {
        let resolve;
        let reject;
        let promise = new this((res, rej) => {
          resolve = res;
          reject = rej;
        });
        function onResolve(value) {
          resolve(value);
        }
        function onReject(error) {
          reject(error);
        }
        for (let value of values) {
          if (!isThenable(value)) {
            value = this.resolve(value);
          }
          value.then(onResolve, onReject);
        }
        return promise;
      }
      static all(values) {
        return ZoneAwarePromise.allWithCallback(values);
      }
      static allSettled(values) {
        const P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
        return P.allWithCallback(values, {
          thenCallback: (value) => ({ status: "fulfilled", value }),
          errorCallback: (err) => ({ status: "rejected", reason: err })
        });
      }
      static allWithCallback(values, callback) {
        let resolve;
        let reject;
        let promise = new this((res, rej) => {
          resolve = res;
          reject = rej;
        });
        let unresolvedCount = 2;
        let valueIndex = 0;
        const resolvedValues = [];
        for (let value of values) {
          if (!isThenable(value)) {
            value = this.resolve(value);
          }
          const curValueIndex = valueIndex;
          try {
            value.then((value2) => {
              resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
              unresolvedCount--;
              if (unresolvedCount === 0) {
                resolve(resolvedValues);
              }
            }, (err) => {
              if (!callback) {
                reject(err);
              } else {
                resolvedValues[curValueIndex] = callback.errorCallback(err);
                unresolvedCount--;
                if (unresolvedCount === 0) {
                  resolve(resolvedValues);
                }
              }
            });
          } catch (thenErr) {
            reject(thenErr);
          }
          unresolvedCount++;
          valueIndex++;
        }
        unresolvedCount -= 2;
        if (unresolvedCount === 0) {
          resolve(resolvedValues);
        }
        return promise;
      }
      constructor(executor) {
        const promise = this;
        if (!(promise instanceof ZoneAwarePromise)) {
          throw new Error("Must be an instanceof Promise.");
        }
        promise[symbolState] = UNRESOLVED;
        promise[symbolValue] = [];
        try {
          const onceWrapper = once();
          executor && executor(onceWrapper(makeResolver(promise, RESOLVED)), onceWrapper(makeResolver(promise, REJECTED)));
        } catch (error) {
          resolvePromise(promise, false, error);
        }
      }
      get [Symbol.toStringTag]() {
        return "Promise";
      }
      get [Symbol.species]() {
        return ZoneAwarePromise;
      }
      then(onFulfilled, onRejected) {
        let C = this.constructor?.[Symbol.species];
        if (!C || typeof C !== "function") {
          C = this.constructor || ZoneAwarePromise;
        }
        const chainPromise = new C(noop);
        const zone = Zone3.current;
        if (this[symbolState] == UNRESOLVED) {
          this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
        } else {
          scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
        }
        return chainPromise;
      }
      catch(onRejected) {
        return this.then(null, onRejected);
      }
      finally(onFinally) {
        let C = this.constructor?.[Symbol.species];
        if (!C || typeof C !== "function") {
          C = ZoneAwarePromise;
        }
        const chainPromise = new C(noop);
        chainPromise[symbolFinally] = symbolFinally;
        const zone = Zone3.current;
        if (this[symbolState] == UNRESOLVED) {
          this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
        } else {
          scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
        }
        return chainPromise;
      }
    }
    ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
    ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
    ZoneAwarePromise["race"] = ZoneAwarePromise.race;
    ZoneAwarePromise["all"] = ZoneAwarePromise.all;
    const NativePromise = global2[symbolPromise] = global2["Promise"];
    global2["Promise"] = ZoneAwarePromise;
    const symbolThenPatched = __symbol__2("thenPatched");
    function patchThen(Ctor) {
      const proto = Ctor.prototype;
      const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
      if (prop && (prop.writable === false || !prop.configurable)) {
        return;
      }
      const originalThen = proto.then;
      proto[symbolThen] = originalThen;
      Ctor.prototype.then = function(onResolve, onReject) {
        const wrapped = new ZoneAwarePromise((resolve, reject) => {
          originalThen.call(this, resolve, reject);
        });
        return wrapped.then(onResolve, onReject);
      };
      Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    function zoneify(fn) {
      return function(self2, args) {
        let resultPromise = fn.apply(self2, args);
        if (resultPromise instanceof ZoneAwarePromise) {
          return resultPromise;
        }
        let ctor = resultPromise.constructor;
        if (!ctor[symbolThenPatched]) {
          patchThen(ctor);
        }
        return resultPromise;
      };
    }
    if (NativePromise) {
      patchThen(NativePromise);
      patchMethod(global2, "fetch", (delegate) => zoneify(delegate));
    }
    Promise[Zone3.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
  });
}
function patchToString(Zone2) {
  Zone2.__load_patch("toString", (global2) => {
    const originalFunctionToString = Function.prototype.toString;
    const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
    const PROMISE_SYMBOL = zoneSymbol("Promise");
    const ERROR_SYMBOL = zoneSymbol("Error");
    const newFunctionToString = function toString() {
      if (typeof this === "function") {
        const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
        if (originalDelegate) {
          if (typeof originalDelegate === "function") {
            return originalFunctionToString.call(originalDelegate);
          } else {
            return Object.prototype.toString.call(originalDelegate);
          }
        }
        if (this === Promise) {
          const nativePromise = global2[PROMISE_SYMBOL];
          if (nativePromise) {
            return originalFunctionToString.call(nativePromise);
          }
        }
        if (this === Error) {
          const nativeError = global2[ERROR_SYMBOL];
          if (nativeError) {
            return originalFunctionToString.call(nativeError);
          }
        }
      }
      return originalFunctionToString.call(this);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    const originalObjectToString = Object.prototype.toString;
    const PROMISE_OBJECT_TO_STRING = "[object Promise]";
    Object.prototype.toString = function() {
      if (typeof Promise === "function" && this instanceof Promise) {
        return PROMISE_OBJECT_TO_STRING;
      }
      return originalObjectToString.call(this);
    };
  });
}
function patchCallbacks(api, target, targetName, method, callbacks) {
  const symbol = Zone.__symbol__(method);
  if (target[symbol]) {
    return;
  }
  const nativeDelegate = target[symbol] = target[method];
  target[method] = function(name, opts, options) {
    if (opts && opts.prototype) {
      callbacks.forEach(function(callback) {
        const source = `${targetName}.${method}::` + callback;
        const prototype = opts.prototype;
        try {
          if (prototype.hasOwnProperty(callback)) {
            const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
            if (descriptor && descriptor.value) {
              descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
              api._redefineProperty(opts.prototype, callback, descriptor);
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } else if (prototype[callback]) {
            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
          }
        } catch {
        }
      });
    }
    return nativeDelegate.call(target, name, opts, options);
  };
  api.attachOriginToPatched(target[method], nativeDelegate);
}
function patchUtil(Zone2) {
  Zone2.__load_patch("util", (global2, Zone3, api) => {
    const eventNames = getOnEventNames(global2);
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
    api.patchMacroTask = patchMacroTask;
    const SYMBOL_BLACK_LISTED_EVENTS = Zone3.__symbol__("BLACK_LISTED_EVENTS");
    const SYMBOL_UNPATCHED_EVENTS = Zone3.__symbol__("UNPATCHED_EVENTS");
    if (global2[SYMBOL_UNPATCHED_EVENTS]) {
      global2[SYMBOL_BLACK_LISTED_EVENTS] = global2[SYMBOL_UNPATCHED_EVENTS];
    }
    if (global2[SYMBOL_BLACK_LISTED_EVENTS]) {
      Zone3[SYMBOL_BLACK_LISTED_EVENTS] = Zone3[SYMBOL_UNPATCHED_EVENTS] = global2[SYMBOL_BLACK_LISTED_EVENTS];
    }
    api.patchEventPrototype = patchEventPrototype;
    api.patchEventTarget = patchEventTarget;
    api.isIEOrEdge = isIEOrEdge;
    api.ObjectDefineProperty = ObjectDefineProperty;
    api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
    api.ObjectCreate = ObjectCreate;
    api.ArraySlice = ArraySlice;
    api.patchClass = patchClass;
    api.wrapWithCurrentZone = wrapWithCurrentZone;
    api.filterProperties = filterProperties;
    api.attachOriginToPatched = attachOriginToPatched;
    api._redefineProperty = Object.defineProperty;
    api.patchCallbacks = patchCallbacks;
    api.getGlobalObjects = () => ({
      globalSources,
      zoneSymbolEventNames,
      eventNames,
      isBrowser,
      isMix,
      isNode,
      TRUE_STR,
      FALSE_STR,
      ZONE_SYMBOL_PREFIX,
      ADD_EVENT_LISTENER_STR,
      REMOVE_EVENT_LISTENER_STR
    });
  });
}
function patchCommon(Zone2) {
  patchPromise(Zone2);
  patchToString(Zone2);
  patchUtil(Zone2);
}
var Zone$1 = loadZone();
patchCommon(Zone$1);
patchBrowser(Zone$1);
/*! Bundled license information:

zone.js/fesm2015/zone.js:
  (**
   * @license Angular v<unknown>
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy96b25lLmpzL2Zlc20yMDE1L3pvbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFyIHY8dW5rbm93bj5cbiAqIChjKSAyMDEwLTIwMjQgR29vZ2xlIExMQy4gaHR0cHM6Ly9hbmd1bGFyLmlvL1xuICogTGljZW5zZTogTUlUXG4gKi9cbmNvbnN0IGdsb2JhbCA9IGdsb2JhbFRoaXM7XG4vLyBfX1pvbmVfc3ltYm9sX3ByZWZpeCBnbG9iYWwgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgem9uZVxuLy8gc3ltYm9sIHByZWZpeCB3aXRoIGEgY3VzdG9tIG9uZSBpZiBuZWVkZWQuXG5mdW5jdGlvbiBfX3N5bWJvbF9fKG5hbWUpIHtcbiAgICBjb25zdCBzeW1ib2xQcmVmaXggPSBnbG9iYWxbJ19fWm9uZV9zeW1ib2xfcHJlZml4J10gfHwgJ19fem9uZV9zeW1ib2xfXyc7XG4gICAgcmV0dXJuIHN5bWJvbFByZWZpeCArIG5hbWU7XG59XG5mdW5jdGlvbiBpbml0Wm9uZSgpIHtcbiAgICBjb25zdCBwZXJmb3JtYW5jZSA9IGdsb2JhbFsncGVyZm9ybWFuY2UnXTtcbiAgICBmdW5jdGlvbiBtYXJrKG5hbWUpIHtcbiAgICAgICAgcGVyZm9ybWFuY2UgJiYgcGVyZm9ybWFuY2VbJ21hcmsnXSAmJiBwZXJmb3JtYW5jZVsnbWFyayddKG5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwZXJmb3JtYW5jZU1lYXN1cmUobmFtZSwgbGFiZWwpIHtcbiAgICAgICAgcGVyZm9ybWFuY2UgJiYgcGVyZm9ybWFuY2VbJ21lYXN1cmUnXSAmJiBwZXJmb3JtYW5jZVsnbWVhc3VyZSddKG5hbWUsIGxhYmVsKTtcbiAgICB9XG4gICAgbWFyaygnWm9uZScpO1xuICAgIGNsYXNzIFpvbmVJbXBsIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIHN0YXRpYyB7IHRoaXMuX19zeW1ib2xfXyA9IF9fc3ltYm9sX187IH1cbiAgICAgICAgc3RhdGljIGFzc2VydFpvbmVQYXRjaGVkKCkge1xuICAgICAgICAgICAgaWYgKGdsb2JhbFsnUHJvbWlzZSddICE9PSBwYXRjaGVzWydab25lQXdhcmVQcm9taXNlJ10pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1pvbmUuanMgaGFzIGRldGVjdGVkIHRoYXQgWm9uZUF3YXJlUHJvbWlzZSBgKHdpbmRvd3xnbG9iYWwpLlByb21pc2VgICcgK1xuICAgICAgICAgICAgICAgICAgICAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4uXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdNb3N0IGxpa2VseSBjYXVzZSBpcyB0aGF0IGEgUHJvbWlzZSBwb2x5ZmlsbCBoYXMgYmVlbiBsb2FkZWQgJyArXG4gICAgICAgICAgICAgICAgICAgICdhZnRlciBab25lLmpzIChQb2x5ZmlsbGluZyBQcm9taXNlIGFwaSBpcyBub3QgbmVjZXNzYXJ5IHdoZW4gem9uZS5qcyBpcyBsb2FkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnSWYgeW91IG11c3QgbG9hZCBvbmUsIGRvIHNvIGJlZm9yZSBsb2FkaW5nIHpvbmUuanMuKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgcm9vdCgpIHtcbiAgICAgICAgICAgIGxldCB6b25lID0gWm9uZUltcGwuY3VycmVudDtcbiAgICAgICAgICAgIHdoaWxlICh6b25lLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB6b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfY3VycmVudFpvbmVGcmFtZS56b25lO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgY3VycmVudFRhc2soKSB7XG4gICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRUYXNrO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBzdGF0aWMgX19sb2FkX3BhdGNoKG5hbWUsIGZuLCBpZ25vcmVEdXBsaWNhdGUgPSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHBhdGNoZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBgY2hlY2tEdXBsaWNhdGVgIG9wdGlvbiBpcyBkZWZpbmVkIGZyb20gZ2xvYmFsIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgLy8gc28gaXQgd29ya3MgZm9yIGFsbCBtb2R1bGVzLlxuICAgICAgICAgICAgICAgIC8vIGBpZ25vcmVEdXBsaWNhdGVgIGNhbiB3b3JrIGZvciB0aGUgc3BlY2lmaWVkIG1vZHVsZVxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlID0gZ2xvYmFsW19fc3ltYm9sX18oJ2ZvcmNlRHVwbGljYXRlWm9uZUNoZWNrJyldID09PSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghaWdub3JlRHVwbGljYXRlICYmIGNoZWNrRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdBbHJlYWR5IGxvYWRlZCBwYXRjaDogJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFnbG9iYWxbJ19fWm9uZV9kaXNhYmxlXycgKyBuYW1lXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmZOYW1lID0gJ1pvbmU6JyArIG5hbWU7XG4gICAgICAgICAgICAgICAgbWFyayhwZXJmTmFtZSk7XG4gICAgICAgICAgICAgICAgcGF0Y2hlc1tuYW1lXSA9IGZuKGdsb2JhbCwgWm9uZUltcGwsIF9hcGkpO1xuICAgICAgICAgICAgICAgIHBlcmZvcm1hbmNlTWVhc3VyZShwZXJmTmFtZSwgcGVyZk5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGdldCBuYW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3RydWN0b3IocGFyZW50LCB6b25lU3BlYykge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHpvbmVTcGVjID8gem9uZVNwZWMubmFtZSB8fCAndW5uYW1lZCcgOiAnPHJvb3Q+JztcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSAoem9uZVNwZWMgJiYgem9uZVNwZWMucHJvcGVydGllcykgfHwge307XG4gICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUgPSBuZXcgX1pvbmVEZWxlZ2F0ZSh0aGlzLCB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50Ll96b25lRGVsZWdhdGUsIHpvbmVTcGVjKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcy5nZXRab25lV2l0aChrZXkpO1xuICAgICAgICAgICAgaWYgKHpvbmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvbmUuX3Byb3BlcnRpZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBnZXRab25lV2l0aChrZXkpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQuX3BhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGZvcmsoem9uZVNwZWMpIHtcbiAgICAgICAgICAgIGlmICghem9uZVNwZWMpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdab25lU3BlYyByZXF1aXJlZCEnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuZm9yayh0aGlzLCB6b25lU3BlYyk7XG4gICAgICAgIH1cbiAgICAgICAgd3JhcChjYWxsYmFjaywgc291cmNlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RpbmcgZnVuY3Rpb24gZ290OiAnICsgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgX2NhbGxiYWNrID0gdGhpcy5fem9uZURlbGVnYXRlLmludGVyY2VwdCh0aGlzLCBjYWxsYmFjaywgc291cmNlKTtcbiAgICAgICAgICAgIGNvbnN0IHpvbmUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9uZS5ydW5HdWFyZGVkKF9jYWxsYmFjaywgdGhpcywgYXJndW1lbnRzLCBzb3VyY2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBydW4oY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IF9jdXJyZW50Wm9uZUZyYW1lLCB6b25lOiB0aGlzIH07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lRGVsZWdhdGUuaW52b2tlKHRoaXMsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0gX2N1cnJlbnRab25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJ1bkd1YXJkZWQoY2FsbGJhY2ssIGFwcGx5VGhpcyA9IG51bGwsIGFwcGx5QXJncywgc291cmNlKSB7XG4gICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBfY3VycmVudFpvbmVGcmFtZSwgem9uZTogdGhpcyB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZURlbGVnYXRlLmludm9rZSh0aGlzLCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IF9jdXJyZW50Wm9uZUZyYW1lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBydW5UYXNrKHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSB7XG4gICAgICAgICAgICBpZiAodGFzay56b25lICE9IHRoaXMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdGFzayBjYW4gb25seSBiZSBydW4gaW4gdGhlIHpvbmUgb2YgY3JlYXRpb24hIChDcmVhdGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICh0YXNrLnpvbmUgfHwgTk9fWk9ORSkubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICc7IEV4ZWN1dGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICcpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy83NzgsIHNvbWV0aW1lcyBldmVudFRhc2tcbiAgICAgICAgICAgIC8vIHdpbGwgcnVuIGluIG5vdFNjaGVkdWxlZChjYW5jZWxlZCkgc3RhdGUsIHdlIHNob3VsZCBub3QgdHJ5IHRvXG4gICAgICAgICAgICAvLyBydW4gc3VjaCBraW5kIG9mIHRhc2sgYnV0IGp1c3QgcmV0dXJuXG4gICAgICAgICAgICBpZiAodGFzay5zdGF0ZSA9PT0gbm90U2NoZWR1bGVkICYmICh0YXNrLnR5cGUgPT09IGV2ZW50VGFzayB8fCB0YXNrLnR5cGUgPT09IG1hY3JvVGFzaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZUVudHJ5R3VhcmQgPSB0YXNrLnN0YXRlICE9IHJ1bm5pbmc7XG4gICAgICAgICAgICByZUVudHJ5R3VhcmQgJiYgdGFzay5fdHJhbnNpdGlvblRvKHJ1bm5pbmcsIHNjaGVkdWxlZCk7XG4gICAgICAgICAgICB0YXNrLnJ1bkNvdW50Kys7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1Rhc2sgPSBfY3VycmVudFRhc2s7XG4gICAgICAgICAgICBfY3VycmVudFRhc2sgPSB0YXNrO1xuICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSB7IHBhcmVudDogX2N1cnJlbnRab25lRnJhbWUsIHpvbmU6IHRoaXMgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2sudHlwZSA9PSBtYWNyb1Rhc2sgJiYgdGFzay5kYXRhICYmICF0YXNrLmRhdGEuaXNQZXJpb2RpYykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmNhbmNlbEZuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZURlbGVnYXRlLmludm9rZVRhc2sodGhpcywgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRhc2sncyBzdGF0ZSBpcyBub3RTY2hlZHVsZWQgb3IgdW5rbm93biwgdGhlbiBpdCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCBub3QgcmVzZXQgdGhlIHN0YXRlIHRvIHNjaGVkdWxlZFxuICAgICAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSBub3RTY2hlZHVsZWQgJiYgdGFzay5zdGF0ZSAhPT0gdW5rbm93bikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFzay50eXBlID09IGV2ZW50VGFzayB8fCAodGFzay5kYXRhICYmIHRhc2suZGF0YS5pc1BlcmlvZGljKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVFbnRyeUd1YXJkICYmIHRhc2suX3RyYW5zaXRpb25UbyhzY2hlZHVsZWQsIHJ1bm5pbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5ydW5Db3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVUYXNrQ291bnQodGFzaywgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVFbnRyeUd1YXJkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKG5vdFNjaGVkdWxlZCwgcnVubmluZywgbm90U2NoZWR1bGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IF9jdXJyZW50Wm9uZUZyYW1lLnBhcmVudDtcbiAgICAgICAgICAgICAgICBfY3VycmVudFRhc2sgPSBwcmV2aW91c1Rhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVUYXNrKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLnpvbmUgJiYgdGFzay56b25lICE9PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHRhc2sgd2FzIHJlc2NoZWR1bGVkLCB0aGUgbmV3Wm9uZVxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgYmUgdGhlIGNoaWxkcmVuIG9mIHRoZSBvcmlnaW5hbCB6b25lXG4gICAgICAgICAgICAgICAgbGV0IG5ld1pvbmUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuZXdab25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdab25lID09PSB0YXNrLnpvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBjYW4gbm90IHJlc2NoZWR1bGUgdGFzayB0byAke3RoaXMubmFtZX0gd2hpY2ggaXMgZGVzY2VuZGFudHMgb2YgdGhlIG9yaWdpbmFsIHpvbmUgJHt0YXNrLnpvbmUubmFtZX1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdab25lID0gbmV3Wm9uZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKHNjaGVkdWxpbmcsIG5vdFNjaGVkdWxlZCk7XG4gICAgICAgICAgICBjb25zdCB6b25lRGVsZWdhdGVzID0gW107XG4gICAgICAgICAgICB0YXNrLl96b25lRGVsZWdhdGVzID0gem9uZURlbGVnYXRlcztcbiAgICAgICAgICAgIHRhc2suX3pvbmUgPSB0aGlzO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdGhpcy5fem9uZURlbGVnYXRlLnNjaGVkdWxlVGFzayh0aGlzLCB0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgc2V0IHRhc2sncyBzdGF0ZSB0byB1bmtub3duIHdoZW4gc2NoZWR1bGVUYXNrIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgZXJyIG1heSBmcm9tIHJlc2NoZWR1bGUsIHNvIHRoZSBmcm9tU3RhdGUgbWF5YmUgbm90U2NoZWR1bGVkXG4gICAgICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKHVua25vd24sIHNjaGVkdWxpbmcsIG5vdFNjaGVkdWxlZCk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQEppYUxpUGFzc2lvbiwgc2hvdWxkIHdlIGNoZWNrIHRoZSByZXN1bHQgZnJvbSBoYW5kbGVFcnJvcj9cbiAgICAgICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGhpcywgZXJyKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFzay5fem9uZURlbGVnYXRlcyA9PT0gem9uZURlbGVnYXRlcykge1xuICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gY2hlY2sgYmVjYXVzZSBpbnRlcm5hbGx5IHRoZSBkZWxlZ2F0ZSBjYW4gcmVzY2hlZHVsZSB0aGUgdGFzay5cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVUYXNrQ291bnQodGFzaywgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFzay5zdGF0ZSA9PSBzY2hlZHVsaW5nKSB7XG4gICAgICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKHNjaGVkdWxlZCwgc2NoZWR1bGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZU1pY3JvVGFzayhzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVUYXNrKG5ldyBab25lVGFzayhtaWNyb1Rhc2ssIHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCB1bmRlZmluZWQpKTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZU1hY3JvVGFzayhzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVRhc2sobmV3IFpvbmVUYXNrKG1hY3JvVGFzaywgc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkpO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlRXZlbnRUYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlVGFzayhuZXcgWm9uZVRhc2soZXZlbnRUYXNrLCBzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FuY2VsVGFzayh0YXNrKSB7XG4gICAgICAgICAgICBpZiAodGFzay56b25lICE9IHRoaXMpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHRhc2sgY2FuIG9ubHkgYmUgY2FuY2VsbGVkIGluIHRoZSB6b25lIG9mIGNyZWF0aW9uISAoQ3JlYXRpb246ICcgK1xuICAgICAgICAgICAgICAgICAgICAodGFzay56b25lIHx8IE5PX1pPTkUpLm5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAnOyBFeGVjdXRpb246ICcgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAnKScpO1xuICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgIT09IHNjaGVkdWxlZCAmJiB0YXNrLnN0YXRlICE9PSBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKGNhbmNlbGluZywgc2NoZWR1bGVkLCBydW5uaW5nKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlLmNhbmNlbFRhc2sodGhpcywgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgZXJyb3Igb2NjdXJzIHdoZW4gY2FuY2VsVGFzaywgdHJhbnNpdCB0aGUgc3RhdGUgdG8gdW5rbm93blxuICAgICAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25Ubyh1bmtub3duLCBjYW5jZWxpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCAtMSk7XG4gICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8obm90U2NoZWR1bGVkLCBjYW5jZWxpbmcpO1xuICAgICAgICAgICAgdGFzay5ydW5Db3VudCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgfVxuICAgICAgICBfdXBkYXRlVGFza0NvdW50KHRhc2ssIGNvdW50KSB7XG4gICAgICAgICAgICBjb25zdCB6b25lRGVsZWdhdGVzID0gdGFzay5fem9uZURlbGVnYXRlcztcbiAgICAgICAgICAgIGlmIChjb3VudCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRhc2suX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB6b25lRGVsZWdhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgem9uZURlbGVnYXRlc1tpXS5fdXBkYXRlVGFza0NvdW50KHRhc2sudHlwZSwgY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IERFTEVHQVRFX1pTID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgb25IYXNUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgaGFzVGFza1N0YXRlKSA9PiBkZWxlZ2F0ZS5oYXNUYXNrKHRhcmdldCwgaGFzVGFza1N0YXRlKSxcbiAgICAgICAgb25TY2hlZHVsZVRhc2s6IChkZWxlZ2F0ZSwgXywgdGFyZ2V0LCB0YXNrKSA9PiBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKSxcbiAgICAgICAgb25JbnZva2VUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpID0+IGRlbGVnYXRlLmludm9rZVRhc2sodGFyZ2V0LCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyksXG4gICAgICAgIG9uQ2FuY2VsVGFzazogKGRlbGVnYXRlLCBfLCB0YXJnZXQsIHRhc2spID0+IGRlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0LCB0YXNrKSxcbiAgICB9O1xuICAgIGNsYXNzIF9ab25lRGVsZWdhdGUge1xuICAgICAgICBnZXQgem9uZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKHpvbmUsIHBhcmVudERlbGVnYXRlLCB6b25lU3BlYykge1xuICAgICAgICAgICAgdGhpcy5fdGFza0NvdW50cyA9IHtcbiAgICAgICAgICAgICAgICAnbWljcm9UYXNrJzogMCxcbiAgICAgICAgICAgICAgICAnbWFjcm9UYXNrJzogMCxcbiAgICAgICAgICAgICAgICAnZXZlbnRUYXNrJzogMCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl96b25lID0gem9uZTtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudERlbGVnYXRlID0gcGFyZW50RGVsZWdhdGU7XG4gICAgICAgICAgICB0aGlzLl9mb3JrWlMgPSB6b25lU3BlYyAmJiAoem9uZVNwZWMgJiYgem9uZVNwZWMub25Gb3JrID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5fZm9ya1pTKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtEbGd0ID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uRm9yayA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2ZvcmtEbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uRm9yayA/IHRoaXMuX3pvbmUgOiBwYXJlbnREZWxlZ2F0ZS5fZm9ya0N1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdFpTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9pbnRlcmNlcHRaUyk7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcmNlcHREbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9pbnRlcmNlcHREbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdEN1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25JbnRlcmNlcHQgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2ludGVyY2VwdEN1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZVpTID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gdGhpcy5fem9uZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvclpTID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yWlMpO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3JEbGd0ID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvckN1cnJab25lID1cbiAgICAgICAgICAgICAgICB6b25lU3BlYyAmJiAoem9uZVNwZWMub25IYW5kbGVFcnJvciA/IHRoaXMuX3pvbmUgOiBwYXJlbnREZWxlZ2F0ZS5faGFuZGxlRXJyb3JDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2taUyA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5fc2NoZWR1bGVUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5fc2NoZWR1bGVUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrID8gdGhpcy5fem9uZSA6IHBhcmVudERlbGVnYXRlLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkNhbmNlbFRhc2sgPyB0aGlzLl96b25lIDogcGFyZW50RGVsZWdhdGUuX2NhbmNlbFRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3QgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3RPd25lciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9oYXNUYXNrQ3VyclpvbmUgPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgem9uZVNwZWNIYXNUYXNrID0gem9uZVNwZWMgJiYgem9uZVNwZWMub25IYXNUYXNrO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50SGFzVGFzayA9IHBhcmVudERlbGVnYXRlICYmIHBhcmVudERlbGVnYXRlLl9oYXNUYXNrWlM7XG4gICAgICAgICAgICBpZiAoem9uZVNwZWNIYXNUYXNrIHx8IHBhcmVudEhhc1Rhc2spIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBuZWVkIHRvIHJlcG9ydCBoYXNUYXNrLCB0aGFuIHRoaXMgWlMgbmVlZHMgdG8gZG8gcmVmIGNvdW50aW5nIG9uIHRhc2tzLiBJbiBzdWNoXG4gICAgICAgICAgICAgICAgLy8gYSBjYXNlIGFsbCB0YXNrIHJlbGF0ZWQgaW50ZXJjZXB0b3JzIG11c3QgZ28gdGhyb3VnaCB0aGlzIFpELiBXZSBjYW4ndCBzaG9ydCBjaXJjdWl0IGl0LlxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2taUyA9IHpvbmVTcGVjSGFzVGFzayA/IHpvbmVTcGVjIDogREVMRUdBVEVfWlM7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrRGxndE93bmVyID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrQ3VyclpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25TY2hlZHVsZVRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSA9IHRoaXMuX3pvbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25JbnZva2VUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludm9rZVRhc2taUyA9IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPSB0aGlzLl96b25lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXpvbmVTcGVjLm9uQ2FuY2VsVGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrWlMgPSBERUxFR0FURV9aUztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGFza0N1cnJab25lID0gdGhpcy5fem9uZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yayh0YXJnZXRab25lLCB6b25lU3BlYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmtaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5fZm9ya1pTLm9uRm9yayh0aGlzLl9mb3JrRGxndCwgdGhpcy56b25lLCB0YXJnZXRab25lLCB6b25lU3BlYylcbiAgICAgICAgICAgICAgICA6IG5ldyBab25lSW1wbCh0YXJnZXRab25lLCB6b25lU3BlYyk7XG4gICAgICAgIH1cbiAgICAgICAgaW50ZXJjZXB0KHRhcmdldFpvbmUsIGNhbGxiYWNrLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnRlcmNlcHRaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faW50ZXJjZXB0WlMub25JbnRlcmNlcHQodGhpcy5faW50ZXJjZXB0RGxndCwgdGhpcy5faW50ZXJjZXB0Q3VyclpvbmUsIHRhcmdldFpvbmUsIGNhbGxiYWNrLCBzb3VyY2UpXG4gICAgICAgICAgICAgICAgOiBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICBpbnZva2UodGFyZ2V0Wm9uZSwgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2VaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faW52b2tlWlMub25JbnZva2UodGhpcy5faW52b2tlRGxndCwgdGhpcy5faW52b2tlQ3VyclpvbmUsIHRhcmdldFpvbmUsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKVxuICAgICAgICAgICAgICAgIDogY2FsbGJhY2suYXBwbHkoYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3JaU1xuICAgICAgICAgICAgICAgID8gdGhpcy5faGFuZGxlRXJyb3JaUy5vbkhhbmRsZUVycm9yKHRoaXMuX2hhbmRsZUVycm9yRGxndCwgdGhpcy5faGFuZGxlRXJyb3JDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgZXJyb3IpXG4gICAgICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXJnZXRab25lLCB0YXNrKSB7XG4gICAgICAgICAgICBsZXQgcmV0dXJuVGFzayA9IHRhc2s7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2NoZWR1bGVUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGFzVGFza1pTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2suX3pvbmVEZWxlZ2F0ZXMucHVzaCh0aGlzLl9oYXNUYXNrRGxndE93bmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuVGFzayA9IHRoaXMuX3NjaGVkdWxlVGFza1pTLm9uU2NoZWR1bGVUYXNrKHRoaXMuX3NjaGVkdWxlVGFza0RsZ3QsIHRoaXMuX3NjaGVkdWxlVGFza0N1cnJab25lLCB0YXJnZXRab25lLCB0YXNrKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJldHVyblRhc2spXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2sgPSB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suc2NoZWR1bGVGbikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnNjaGVkdWxlRm4odGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhc2sudHlwZSA9PSBtaWNyb1Rhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2sodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rhc2sgaXMgbWlzc2luZyBzY2hlZHVsZUZuLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXR1cm5UYXNrO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVRhc2sodGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2VUYXNrWlNcbiAgICAgICAgICAgICAgICA/IHRoaXMuX2ludm9rZVRhc2taUy5vbkludm9rZVRhc2sodGhpcy5faW52b2tlVGFza0RsZ3QsIHRoaXMuX2ludm9rZVRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpXG4gICAgICAgICAgICAgICAgOiB0YXNrLmNhbGxiYWNrLmFwcGx5KGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxUYXNrKHRhcmdldFpvbmUsIHRhc2spIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2NhbmNlbFRhc2taUy5vbkNhbmNlbFRhc2sodGhpcy5fY2FuY2VsVGFza0RsZ3QsIHRoaXMuX2NhbmNlbFRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhc2suY2FuY2VsRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1Rhc2sgaXMgbm90IGNhbmNlbGFibGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0YXNrLmNhbmNlbEZuKHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGhhc1Rhc2sodGFyZ2V0Wm9uZSwgaXNFbXB0eSkge1xuICAgICAgICAgICAgLy8gaGFzVGFzayBzaG91bGQgbm90IHRocm93IGVycm9yIHNvIG90aGVyIFpvbmVEZWxlZ2F0ZVxuICAgICAgICAgICAgLy8gY2FuIHN0aWxsIHRyaWdnZXIgaGFzVGFzayBjYWxsYmFja1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTLm9uSGFzVGFzayh0aGlzLl9oYXNUYXNrRGxndCwgdGhpcy5faGFzVGFza0N1cnJab25lLCB0YXJnZXRab25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIF91cGRhdGVUYXNrQ291bnQodHlwZSwgY291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cyA9IHRoaXMuX3Rhc2tDb3VudHM7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gY291bnRzW3R5cGVdO1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IChjb3VudHNbdHlwZV0gPSBwcmV2ICsgY291bnQpO1xuICAgICAgICAgICAgaWYgKG5leHQgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNb3JlIHRhc2tzIGV4ZWN1dGVkIHRoZW4gd2VyZSBzY2hlZHVsZWQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldiA9PSAwIHx8IG5leHQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzRW1wdHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1pY3JvVGFzazogY291bnRzWydtaWNyb1Rhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIG1hY3JvVGFzazogY291bnRzWydtYWNyb1Rhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VGFzazogY291bnRzWydldmVudFRhc2snXSA+IDAsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZTogdHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzVGFzayh0aGlzLl96b25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBab25lVGFzayB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHR5cGUsIHNvdXJjZSwgY2FsbGJhY2ssIG9wdGlvbnMsIHNjaGVkdWxlRm4sIGNhbmNlbEZuKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ydW5Db3VudCA9IDA7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9ICdub3RTY2hlZHVsZWQnO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gb3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVGbiA9IHNjaGVkdWxlRm47XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEZuID0gY2FuY2VsRm47XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsYmFjayBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAvLyBUT0RPOiBASmlhTGlQYXNzaW9uIG9wdGlvbnMgc2hvdWxkIGhhdmUgaW50ZXJmYWNlXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gZXZlbnRUYXNrICYmIG9wdGlvbnMgJiYgb3B0aW9ucy51c2VHKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBab25lVGFzay5pbnZva2VUYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBab25lVGFzay5pbnZva2VUYXNrLmNhbGwoZ2xvYmFsLCBzZWxmLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGludm9rZVRhc2sodGFzaywgdGFyZ2V0LCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMrKztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFzay5ydW5Db3VudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrLnpvbmUucnVuVGFzayh0YXNrLCB0YXJnZXQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkcmFpbk1pY3JvVGFza1F1ZXVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9udW1iZXJPZk5lc3RlZFRhc2tGcmFtZXMtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZXQgem9uZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96b25lO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxTY2hlZHVsZVJlcXVlc3QoKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uVG8obm90U2NoZWR1bGVkLCBzY2hlZHVsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgX3RyYW5zaXRpb25Ubyh0b1N0YXRlLCBmcm9tU3RhdGUxLCBmcm9tU3RhdGUyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTEgfHwgdGhpcy5fc3RhdGUgPT09IGZyb21TdGF0ZTIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUgPT0gbm90U2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnR5cGV9ICcke3RoaXMuc291cmNlfSc6IGNhbiBub3QgdHJhbnNpdGlvbiB0byAnJHt0b1N0YXRlfScsIGV4cGVjdGluZyBzdGF0ZSAnJHtmcm9tU3RhdGUxfScke2Zyb21TdGF0ZTIgPyBcIiBvciAnXCIgKyBmcm9tU3RhdGUyICsgXCInXCIgOiAnJ30sIHdhcyAnJHt0aGlzLl9zdGF0ZX0nLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0eXBlb2YgdGhpcy5kYXRhLmhhbmRsZUlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaGFuZGxlSWQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWRkIHRvSlNPTiBtZXRob2QgdG8gcHJldmVudCBjeWNsaWMgZXJyb3Igd2hlblxuICAgICAgICAvLyBjYWxsIEpTT04uc3RyaW5naWZ5KHpvbmVUYXNrKVxuICAgICAgICB0b0pTT04oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgIHpvbmU6IHRoaXMuem9uZS5uYW1lLFxuICAgICAgICAgICAgICAgIHJ1bkNvdW50OiB0aGlzLnJ1bkNvdW50LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8gIE1JQ1JPVEFTSyBRVUVVRVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIGNvbnN0IHN5bWJvbFNldFRpbWVvdXQgPSBfX3N5bWJvbF9fKCdzZXRUaW1lb3V0Jyk7XG4gICAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgICBjb25zdCBzeW1ib2xUaGVuID0gX19zeW1ib2xfXygndGhlbicpO1xuICAgIGxldCBfbWljcm9UYXNrUXVldWUgPSBbXTtcbiAgICBsZXQgX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSA9IGZhbHNlO1xuICAgIGxldCBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2U7XG4gICAgZnVuY3Rpb24gbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soZnVuYykge1xuICAgICAgICBpZiAoIW5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSkge1xuICAgICAgICAgICAgaWYgKGdsb2JhbFtzeW1ib2xQcm9taXNlXSkge1xuICAgICAgICAgICAgICAgIG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZSA9IGdsb2JhbFtzeW1ib2xQcm9taXNlXS5yZXNvbHZlKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UpIHtcbiAgICAgICAgICAgIGxldCBuYXRpdmVUaGVuID0gbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlW3N5bWJvbFRoZW5dO1xuICAgICAgICAgICAgaWYgKCFuYXRpdmVUaGVuKSB7XG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIFByb21pc2UgaXMgbm90IHBhdGNoYWJsZSwgd2UgbmVlZCB0byB1c2UgYHRoZW5gIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgLy8gaXNzdWUgMTA3OFxuICAgICAgICAgICAgICAgIG5hdGl2ZVRoZW4gPSBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2VbJ3RoZW4nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdGl2ZVRoZW4uY2FsbChuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UsIGZ1bmMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsW3N5bWJvbFNldFRpbWVvdXRdKGZ1bmMsIDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlTWljcm9UYXNrKHRhc2spIHtcbiAgICAgICAgLy8gaWYgd2UgYXJlIG5vdCBydW5uaW5nIGluIGFueSB0YXNrLCBhbmQgdGhlcmUgaGFzIG5vdCBiZWVuIGFueXRoaW5nIHNjaGVkdWxlZFxuICAgICAgICAvLyB3ZSBtdXN0IGJvb3RzdHJhcCB0aGUgaW5pdGlhbCB0YXNrIGNyZWF0aW9uIGJ5IG1hbnVhbGx5IHNjaGVkdWxpbmcgdGhlIGRyYWluXG4gICAgICAgIGlmIChfbnVtYmVyT2ZOZXN0ZWRUYXNrRnJhbWVzID09PSAwICYmIF9taWNyb1Rhc2tRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGFyZSBub3QgcnVubmluZyBpbiBUYXNrLCBzbyB3ZSBuZWVkIHRvIGtpY2tzdGFydCB0aGUgbWljcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soZHJhaW5NaWNyb1Rhc2tRdWV1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGFzayAmJiBfbWljcm9UYXNrUXVldWUucHVzaCh0YXNrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZHJhaW5NaWNyb1Rhc2tRdWV1ZSgpIHtcbiAgICAgICAgaWYgKCFfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlKSB7XG4gICAgICAgICAgICBfaXNEcmFpbmluZ01pY3JvdGFza1F1ZXVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHdoaWxlIChfbWljcm9UYXNrUXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVldWUgPSBfbWljcm9UYXNrUXVldWU7XG4gICAgICAgICAgICAgICAgX21pY3JvVGFza1F1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcXVldWVbaV07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnpvbmUucnVuVGFzayh0YXNrLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcGkub25VbmhhbmRsZWRFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfYXBpLm1pY3JvdGFza0RyYWluRG9uZSgpO1xuICAgICAgICAgICAgX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLyAgQk9PVFNUUkFQXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgY29uc3QgTk9fWk9ORSA9IHsgbmFtZTogJ05PIFpPTkUnIH07XG4gICAgY29uc3Qgbm90U2NoZWR1bGVkID0gJ25vdFNjaGVkdWxlZCcsIHNjaGVkdWxpbmcgPSAnc2NoZWR1bGluZycsIHNjaGVkdWxlZCA9ICdzY2hlZHVsZWQnLCBydW5uaW5nID0gJ3J1bm5pbmcnLCBjYW5jZWxpbmcgPSAnY2FuY2VsaW5nJywgdW5rbm93biA9ICd1bmtub3duJztcbiAgICBjb25zdCBtaWNyb1Rhc2sgPSAnbWljcm9UYXNrJywgbWFjcm9UYXNrID0gJ21hY3JvVGFzaycsIGV2ZW50VGFzayA9ICdldmVudFRhc2snO1xuICAgIGNvbnN0IHBhdGNoZXMgPSB7fTtcbiAgICBjb25zdCBfYXBpID0ge1xuICAgICAgICBzeW1ib2w6IF9fc3ltYm9sX18sXG4gICAgICAgIGN1cnJlbnRab25lRnJhbWU6ICgpID0+IF9jdXJyZW50Wm9uZUZyYW1lLFxuICAgICAgICBvblVuaGFuZGxlZEVycm9yOiBub29wLFxuICAgICAgICBtaWNyb3Rhc2tEcmFpbkRvbmU6IG5vb3AsXG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrOiBzY2hlZHVsZU1pY3JvVGFzayxcbiAgICAgICAgc2hvd1VuY2F1Z2h0RXJyb3I6ICgpID0+ICFab25lSW1wbFtfX3N5bWJvbF9fKCdpZ25vcmVDb25zb2xlRXJyb3JVbmNhdWdodEVycm9yJyldLFxuICAgICAgICBwYXRjaEV2ZW50VGFyZ2V0OiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hPblByb3BlcnRpZXM6IG5vb3AsXG4gICAgICAgIHBhdGNoTWV0aG9kOiAoKSA9PiBub29wLFxuICAgICAgICBiaW5kQXJndW1lbnRzOiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hUaGVuOiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaE1hY3JvVGFzazogKCkgPT4gbm9vcCxcbiAgICAgICAgcGF0Y2hFdmVudFByb3RvdHlwZTogKCkgPT4gbm9vcCxcbiAgICAgICAgaXNJRU9yRWRnZTogKCkgPT4gZmFsc2UsXG4gICAgICAgIGdldEdsb2JhbE9iamVjdHM6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHk6ICgpID0+IG5vb3AsXG4gICAgICAgIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBPYmplY3RDcmVhdGU6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgICAgQXJyYXlTbGljZTogKCkgPT4gW10sXG4gICAgICAgIHBhdGNoQ2xhc3M6ICgpID0+IG5vb3AsXG4gICAgICAgIHdyYXBXaXRoQ3VycmVudFpvbmU6ICgpID0+IG5vb3AsXG4gICAgICAgIGZpbHRlclByb3BlcnRpZXM6ICgpID0+IFtdLFxuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQ6ICgpID0+IG5vb3AsXG4gICAgICAgIF9yZWRlZmluZVByb3BlcnR5OiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaENhbGxiYWNrczogKCkgPT4gbm9vcCxcbiAgICAgICAgbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2s6IG5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrLFxuICAgIH07XG4gICAgbGV0IF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IG51bGwsIHpvbmU6IG5ldyBab25lSW1wbChudWxsLCBudWxsKSB9O1xuICAgIGxldCBfY3VycmVudFRhc2sgPSBudWxsO1xuICAgIGxldCBfbnVtYmVyT2ZOZXN0ZWRUYXNrRnJhbWVzID0gMDtcbiAgICBmdW5jdGlvbiBub29wKCkgeyB9XG4gICAgcGVyZm9ybWFuY2VNZWFzdXJlKCdab25lJywgJ1pvbmUnKTtcbiAgICByZXR1cm4gWm9uZUltcGw7XG59XG5cbmZ1bmN0aW9uIGxvYWRab25lKCkge1xuICAgIC8vIGlmIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzIChtYXliZSB6b25lLmpzIHdhcyBhbHJlYWR5IGxvYWRlZCBvclxuICAgIC8vIHNvbWUgb3RoZXIgbGliIGFsc28gcmVnaXN0ZXJlZCBhIGdsb2JhbCBvYmplY3QgbmFtZWQgWm9uZSksIHdlIG1heSBuZWVkXG4gICAgLy8gdG8gdGhyb3cgYW4gZXJyb3IsIGJ1dCBzb21ldGltZXMgdXNlciBtYXkgbm90IHdhbnQgdGhpcyBlcnJvci5cbiAgICAvLyBGb3IgZXhhbXBsZSxcbiAgICAvLyB3ZSBoYXZlIHR3byB3ZWIgcGFnZXMsIHBhZ2UxIGluY2x1ZGVzIHpvbmUuanMsIHBhZ2UyIGRvZXNuJ3QuXG4gICAgLy8gYW5kIHRoZSAxc3QgdGltZSB1c2VyIGxvYWQgcGFnZTEgYW5kIHBhZ2UyLCBldmVyeXRoaW5nIHdvcmsgZmluZSxcbiAgICAvLyBidXQgd2hlbiB1c2VyIGxvYWQgcGFnZTIgYWdhaW4sIGVycm9yIG9jY3VycyBiZWNhdXNlIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzLlxuICAgIC8vIHNvIHdlIGFkZCBhIGZsYWcgdG8gbGV0IHVzZXIgY2hvb3NlIHdoZXRoZXIgdG8gdGhyb3cgdGhpcyBlcnJvciBvciBub3QuXG4gICAgLy8gQnkgZGVmYXVsdCwgaWYgZXhpc3RpbmcgWm9uZSBpcyBmcm9tIHpvbmUuanMsIHdlIHdpbGwgbm90IHRocm93IHRoZSBlcnJvci5cbiAgICBjb25zdCBnbG9iYWwgPSBnbG9iYWxUaGlzO1xuICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlID0gZ2xvYmFsW19fc3ltYm9sX18oJ2ZvcmNlRHVwbGljYXRlWm9uZUNoZWNrJyldID09PSB0cnVlO1xuICAgIGlmIChnbG9iYWxbJ1pvbmUnXSAmJiAoY2hlY2tEdXBsaWNhdGUgfHwgdHlwZW9mIGdsb2JhbFsnWm9uZSddLl9fc3ltYm9sX18gIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWm9uZSBhbHJlYWR5IGxvYWRlZC4nKTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBnbG9iYWwgYFpvbmVgIGNvbnN0YW50LlxuICAgIGdsb2JhbFsnWm9uZSddID8/PSBpbml0Wm9uZSgpO1xuICAgIHJldHVybiBnbG9iYWxbJ1pvbmUnXTtcbn1cblxuLyoqXG4gKiBTdXBwcmVzcyBjbG9zdXJlIGNvbXBpbGVyIGVycm9ycyBhYm91dCB1bmtub3duICdab25lJyB2YXJpYWJsZVxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHt1bmRlZmluZWRWYXJzLGdsb2JhbFRoaXMsbWlzc2luZ1JlcXVpcmV9XG4gKi9cbi8vIGlzc3VlICM5ODksIHRvIHJlZHVjZSBidW5kbGUgc2l6ZSwgdXNlIHNob3J0IG5hbWVcbi8qKiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICovXG5jb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuLyoqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAqL1xuY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4vKiogT2JqZWN0LmdldFByb3RvdHlwZU9mICovXG5jb25zdCBPYmplY3RHZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbi8qKiBPYmplY3QuY3JlYXRlICovXG5jb25zdCBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuLyoqIEFycmF5LnByb3RvdHlwZS5zbGljZSAqL1xuY29uc3QgQXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbi8qKiBhZGRFdmVudExpc3RlbmVyIHN0cmluZyBjb25zdCAqL1xuY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdhZGRFdmVudExpc3RlbmVyJztcbi8qKiByZW1vdmVFdmVudExpc3RlbmVyIHN0cmluZyBjb25zdCAqL1xuY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbi8qKiB6b25lU3ltYm9sIGFkZEV2ZW50TGlzdGVuZXIgKi9cbmNvbnN0IFpPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUiA9IF9fc3ltYm9sX18oQUREX0VWRU5UX0xJU1RFTkVSX1NUUik7XG4vKiogem9uZVN5bWJvbCByZW1vdmVFdmVudExpc3RlbmVyICovXG5jb25zdCBaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVIgPSBfX3N5bWJvbF9fKFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHRydWUgc3RyaW5nIGNvbnN0ICovXG5jb25zdCBUUlVFX1NUUiA9ICd0cnVlJztcbi8qKiBmYWxzZSBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IEZBTFNFX1NUUiA9ICdmYWxzZSc7XG4vKiogWm9uZSBzeW1ib2wgcHJlZml4IHN0cmluZyBjb25zdC4gKi9cbmNvbnN0IFpPTkVfU1lNQk9MX1BSRUZJWCA9IF9fc3ltYm9sX18oJycpO1xuZnVuY3Rpb24gd3JhcFdpdGhDdXJyZW50Wm9uZShjYWxsYmFjaywgc291cmNlKSB7XG4gICAgcmV0dXJuIFpvbmUuY3VycmVudC53cmFwKGNhbGxiYWNrLCBzb3VyY2UpO1xufVxuZnVuY3Rpb24gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkge1xuICAgIHJldHVybiBab25lLmN1cnJlbnQuc2NoZWR1bGVNYWNyb1Rhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCk7XG59XG5jb25zdCB6b25lU3ltYm9sID0gX19zeW1ib2xfXztcbmNvbnN0IGlzV2luZG93RXhpc3RzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5jb25zdCBpbnRlcm5hbFdpbmRvdyA9IGlzV2luZG93RXhpc3RzID8gd2luZG93IDogdW5kZWZpbmVkO1xuY29uc3QgX2dsb2JhbCA9IChpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvdykgfHwgZ2xvYmFsVGhpcztcbmNvbnN0IFJFTU9WRV9BVFRSSUJVVEUgPSAncmVtb3ZlQXR0cmlidXRlJztcbmZ1bmN0aW9uIGJpbmRBcmd1bWVudHMoYXJncywgc291cmNlKSB7XG4gICAgZm9yIChsZXQgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gd3JhcFdpdGhDdXJyZW50Wm9uZShhcmdzW2ldLCBzb3VyY2UgKyAnXycgKyBpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJncztcbn1cbmZ1bmN0aW9uIHBhdGNoUHJvdG90eXBlKHByb3RvdHlwZSwgZm5OYW1lcykge1xuICAgIGNvbnN0IHNvdXJjZSA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvclsnbmFtZSddO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm5OYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBuYW1lID0gZm5OYW1lc1tpXTtcbiAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBwcm90b3R5cGVbbmFtZV07XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdG90eXBlRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIG5hbWUpO1xuICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5V3JpdGFibGUocHJvdG90eXBlRGVzYykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3RvdHlwZVtuYW1lXSA9ICgoZGVsZWdhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRjaGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkodGhpcywgYmluZEFyZ3VtZW50cyhhcmd1bWVudHMsIHNvdXJjZSArICcuJyArIG5hbWUpKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBkZWxlZ2F0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoZWQ7XG4gICAgICAgICAgICB9KShkZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpc1Byb3BlcnR5V3JpdGFibGUocHJvcGVydHlEZXNjKSB7XG4gICAgaWYgKCFwcm9wZXJ0eURlc2MpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0eURlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICEodHlwZW9mIHByb3BlcnR5RGVzYy5nZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHByb3BlcnR5RGVzYy5zZXQgPT09ICd1bmRlZmluZWQnKTtcbn1cbmNvbnN0IGlzV2ViV29ya2VyID0gdHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGU7XG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmNvbnN0IGlzTm9kZSA9ICEoJ253JyBpbiBfZ2xvYmFsKSAmJlxuICAgIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgX2dsb2JhbC5wcm9jZXNzLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcbmNvbnN0IGlzQnJvd3NlciA9ICFpc05vZGUgJiYgIWlzV2ViV29ya2VyICYmICEhKGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93WydIVE1MRWxlbWVudCddKTtcbi8vIHdlIGFyZSBpbiBlbGVjdHJvbiBvZiBudywgc28gd2UgYXJlIGJvdGggYnJvd3NlciBhbmQgbm9kZWpzXG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmNvbnN0IGlzTWl4ID0gdHlwZW9mIF9nbG9iYWwucHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBfZ2xvYmFsLnByb2Nlc3MudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmXG4gICAgIWlzV2ViV29ya2VyICYmXG4gICAgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXMkMSA9IHt9O1xuY29uc3Qgd3JhcEZuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnQudHlwZV07XG4gICAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICAgICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudC50eXBlXSA9IHpvbmVTeW1ib2woJ09OX1BST1BFUlRZJyArIGV2ZW50LnR5cGUpO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoaXNCcm93c2VyICYmIHRhcmdldCA9PT0gaW50ZXJuYWxXaW5kb3cgJiYgZXZlbnQudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAvLyB3aW5kb3cub25lcnJvciBoYXZlIGRpZmZlcmVudCBzaWduYXR1cmVcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dsb2JhbEV2ZW50SGFuZGxlcnMvb25lcnJvciN3aW5kb3cub25lcnJvclxuICAgICAgICAvLyBhbmQgb25lcnJvciBjYWxsYmFjayB3aWxsIHByZXZlbnQgZGVmYXVsdCB3aGVuIGNhbGxiYWNrIHJldHVybiB0cnVlXG4gICAgICAgIGNvbnN0IGVycm9yRXZlbnQgPSBldmVudDtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIGxpc3RlbmVyICYmXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBlcnJvckV2ZW50Lm1lc3NhZ2UsIGVycm9yRXZlbnQuZmlsZW5hbWUsIGVycm9yRXZlbnQubGluZW5vLCBlcnJvckV2ZW50LmNvbG5vLCBlcnJvckV2ZW50LmVycm9yKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIgJiYgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSB1bmRlZmluZWQgJiYgIXJlc3VsdCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmZ1bmN0aW9uIHBhdGNoUHJvcGVydHkob2JqLCBwcm9wLCBwcm90b3R5cGUpIHtcbiAgICBsZXQgZGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuICAgIGlmICghZGVzYyAmJiBwcm90b3R5cGUpIHtcbiAgICAgICAgLy8gd2hlbiBwYXRjaCB3aW5kb3cgb2JqZWN0LCB1c2UgcHJvdG90eXBlIHRvIGNoZWNrIHByb3AgZXhpc3Qgb3Igbm90XG4gICAgICAgIGNvbnN0IHByb3RvdHlwZURlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBwcm9wKTtcbiAgICAgICAgaWYgKHByb3RvdHlwZURlc2MpIHtcbiAgICAgICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoZSBkZXNjcmlwdG9yIG5vdCBleGlzdHMgb3IgaXMgbm90IGNvbmZpZ3VyYWJsZVxuICAgIC8vIGp1c3QgcmV0dXJuXG4gICAgaWYgKCFkZXNjIHx8ICFkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9uUHJvcFBhdGNoZWRTeW1ib2wgPSB6b25lU3ltYm9sKCdvbicgKyBwcm9wICsgJ3BhdGNoZWQnKTtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9uUHJvcFBhdGNoZWRTeW1ib2wpICYmIG9ialtvblByb3BQYXRjaGVkU3ltYm9sXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEEgcHJvcGVydHkgZGVzY3JpcHRvciBjYW5ub3QgaGF2ZSBnZXR0ZXIvc2V0dGVyIGFuZCBiZSB3cml0YWJsZVxuICAgIC8vIGRlbGV0aW5nIHRoZSB3cml0YWJsZSBhbmQgdmFsdWUgcHJvcGVydGllcyBhdm9pZHMgdGhpcyBlcnJvcjpcbiAgICAvL1xuICAgIC8vIFR5cGVFcnJvcjogcHJvcGVydHkgZGVzY3JpcHRvcnMgbXVzdCBub3Qgc3BlY2lmeSBhIHZhbHVlIG9yIGJlIHdyaXRhYmxlIHdoZW4gYVxuICAgIC8vIGdldHRlciBvciBzZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkXG4gICAgZGVsZXRlIGRlc2Mud3JpdGFibGU7XG4gICAgZGVsZXRlIGRlc2MudmFsdWU7XG4gICAgY29uc3Qgb3JpZ2luYWxEZXNjR2V0ID0gZGVzYy5nZXQ7XG4gICAgY29uc3Qgb3JpZ2luYWxEZXNjU2V0ID0gZGVzYy5zZXQ7XG4gICAgLy8gc2xpY2UoMikgY3V6ICdvbmNsaWNrJyAtPiAnY2xpY2snLCBldGNcbiAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wLnNsaWNlKDIpO1xuICAgIGxldCBldmVudE5hbWVTeW1ib2wgPSB6b25lU3ltYm9sRXZlbnROYW1lcyQxW2V2ZW50TmFtZV07XG4gICAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICAgICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudE5hbWVdID0gem9uZVN5bWJvbCgnT05fUFJPUEVSVFknICsgZXZlbnROYW1lKTtcbiAgICB9XG4gICAgZGVzYy5zZXQgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgLy8gaW4gc29tZSBvZiB3aW5kb3dzJ3Mgb25wcm9wZXJ0eSBjYWxsYmFjaywgdGhpcyBpcyB1bmRlZmluZWRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBjaGVjayBpdFxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgaWYgKCF0YXJnZXQgJiYgb2JqID09PSBfZ2xvYmFsKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSBfZ2xvYmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgICAgICBpZiAodHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpc3N1ZSAjOTc4LCB3aGVuIG9ubG9hZCBoYW5kbGVyIHdhcyBhZGRlZCBiZWZvcmUgbG9hZGluZyB6b25lLmpzXG4gICAgICAgIC8vIHdlIHNob3VsZCByZW1vdmUgaXQgd2l0aCBvcmlnaW5hbERlc2NTZXRcbiAgICAgICAgb3JpZ2luYWxEZXNjU2V0ICYmIG9yaWdpbmFsRGVzY1NldC5jYWxsKHRhcmdldCwgbnVsbCk7XG4gICAgICAgIHRhcmdldFtldmVudE5hbWVTeW1ib2xdID0gbmV3VmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRoZSBnZXR0ZXIgd291bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgdW5hc3NpZ25lZCBwcm9wZXJ0aWVzIGJ1dCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhblxuICAgIC8vIHVuYXNzaWduZWQgcHJvcGVydHkgaXMgbnVsbFxuICAgIGRlc2MuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBpbiBzb21lIG9mIHdpbmRvd3MncyBvbnByb3BlcnR5IGNhbGxiYWNrLCB0aGlzIGlzIHVuZGVmaW5lZFxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoZWNrIGl0XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzO1xuICAgICAgICBpZiAoIXRhcmdldCAmJiBvYmogPT09IF9nbG9iYWwpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IF9nbG9iYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9yaWdpbmFsRGVzY0dldCkge1xuICAgICAgICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgbnVsbCB3aGVuIHVzZSBpbmxpbmUgZXZlbnQgYXR0cmlidXRlLFxuICAgICAgICAgICAgLy8gc3VjaCBhcyA8YnV0dG9uIG9uY2xpY2s9XCJmdW5jKCk7XCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIG9uY2xpY2sgZnVuY3Rpb24gaXMgaW50ZXJuYWwgcmF3IHVuY29tcGlsZWQgaGFuZGxlclxuICAgICAgICAgICAgLy8gdGhlIG9uY2xpY2sgd2lsbCBiZSBldmFsdWF0ZWQgd2hlbiBmaXJzdCB0aW1lIGV2ZW50IHdhcyB0cmlnZ2VyZWQgb3JcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZCwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvNTI1XG4gICAgICAgICAgICAvLyBzbyB3ZSBzaG91bGQgdXNlIG9yaWdpbmFsIG5hdGl2ZSBnZXQgdG8gcmV0cmlldmUgdGhlIGhhbmRsZXJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9yaWdpbmFsRGVzY0dldC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVzYy5zZXQuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbUkVNT1ZFX0FUVFJJQlVURV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgT2JqZWN0RGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgICBvYmpbb25Qcm9wUGF0Y2hlZFN5bWJvbF0gPSB0cnVlO1xufVxuZnVuY3Rpb24gcGF0Y2hPblByb3BlcnRpZXMob2JqLCBwcm9wZXJ0aWVzLCBwcm90b3R5cGUpIHtcbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBhdGNoUHJvcGVydHkob2JqLCAnb24nICsgcHJvcGVydGllc1tpXSwgcHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qgb25Qcm9wZXJ0aWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChwcm9wLnNsaWNlKDAsIDIpID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICBvblByb3BlcnRpZXMucHVzaChwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9uUHJvcGVydGllcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcGF0Y2hQcm9wZXJ0eShvYmosIG9uUHJvcGVydGllc1tqXSwgcHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnN0IG9yaWdpbmFsSW5zdGFuY2VLZXkgPSB6b25lU3ltYm9sKCdvcmlnaW5hbEluc3RhbmNlJyk7XG4vLyB3cmFwIHNvbWUgbmF0aXZlIEFQSSBvbiBgd2luZG93YFxuZnVuY3Rpb24gcGF0Y2hDbGFzcyhjbGFzc05hbWUpIHtcbiAgICBjb25zdCBPcmlnaW5hbENsYXNzID0gX2dsb2JhbFtjbGFzc05hbWVdO1xuICAgIGlmICghT3JpZ2luYWxDbGFzcylcbiAgICAgICAgcmV0dXJuO1xuICAgIC8vIGtlZXAgb3JpZ2luYWwgY2xhc3MgaW4gZ2xvYmFsXG4gICAgX2dsb2JhbFt6b25lU3ltYm9sKGNsYXNzTmFtZSldID0gT3JpZ2luYWxDbGFzcztcbiAgICBfZ2xvYmFsW2NsYXNzTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGEgPSBiaW5kQXJndW1lbnRzKGFyZ3VtZW50cywgY2xhc3NOYW1lKTtcbiAgICAgICAgc3dpdGNoIChhLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKGFbMF0sIGFbMV0sIGFbMl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdLCBhWzNdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmcgbGlzdCB0b28gbG9uZy4nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gYXR0YWNoIG9yaWdpbmFsIGRlbGVnYXRlIHRvIHBhdGNoZWQgZnVuY3Rpb25cbiAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQoX2dsb2JhbFtjbGFzc05hbWVdLCBPcmlnaW5hbENsYXNzKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBPcmlnaW5hbENsYXNzKGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgbGV0IHByb3A7XG4gICAgZm9yIChwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD00NDcyMVxuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSAnWE1MSHR0cFJlcXVlc3QnICYmIHByb3AgPT09ICdyZXNwb25zZUJsb2InKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZVtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIF9nbG9iYWxbY2xhc3NOYW1lXS5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLmFwcGx5KHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KF9nbG9iYWxbY2xhc3NOYW1lXS5wcm90b3R5cGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdID0gd3JhcFdpdGhDdXJyZW50Wm9uZShmbiwgY2xhc3NOYW1lICsgJy4nICsgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCBjYWxsYmFjayBpbiB3cmFwcGVkIGZ1bmN0aW9uIHNvIHdlIGNhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSBpdCBpbiBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIG5hdGl2ZSBvbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0sIGZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0gPSBmbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkocHJvcCk7XG4gICAgfVxuICAgIGZvciAocHJvcCBpbiBPcmlnaW5hbENsYXNzKSB7XG4gICAgICAgIGlmIChwcm9wICE9PSAncHJvdG90eXBlJyAmJiBPcmlnaW5hbENsYXNzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICBfZ2xvYmFsW2NsYXNzTmFtZV1bcHJvcF0gPSBPcmlnaW5hbENsYXNzW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gcGF0Y2hNZXRob2QodGFyZ2V0LCBuYW1lLCBwYXRjaEZuKSB7XG4gICAgbGV0IHByb3RvID0gdGFyZ2V0O1xuICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfVxuICAgIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICAgICAgcHJvdG8gPSB0YXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IGRlbGVnYXRlTmFtZSA9IHpvbmVTeW1ib2wobmFtZSk7XG4gICAgbGV0IGRlbGVnYXRlID0gbnVsbDtcbiAgICBpZiAocHJvdG8gJiYgKCEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSB8fCAhcHJvdG8uaGFzT3duUHJvcGVydHkoZGVsZWdhdGVOYW1lKSkpIHtcbiAgICAgICAgZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdID0gcHJvdG9bbmFtZV07XG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgcHJvdG9bbmFtZV0gaXMgd3JpdGFibGVcbiAgICAgICAgLy8gc29tZSBwcm9wZXJ0eSBpcyByZWFkb25seSBpbiBzYWZhcmksIHN1Y2ggYXMgSHRtbENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYlxuICAgICAgICBjb25zdCBkZXNjID0gcHJvdG8gJiYgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGlzUHJvcGVydHlXcml0YWJsZShkZXNjKSkge1xuICAgICAgICAgICAgY29uc3QgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUsIGRlbGVnYXRlTmFtZSwgbmFtZSk7XG4gICAgICAgICAgICBwcm90b1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0Y2hEZWxlZ2F0ZSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tuYW1lXSwgZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWxlZ2F0ZTtcbn1cbi8vIFRPRE86IEBKaWFMaVBhc3Npb24sIHN1cHBvcnQgY2FuY2VsIHRhc2sgbGF0ZXIgaWYgbmVjZXNzYXJ5XG5mdW5jdGlvbiBwYXRjaE1hY3JvVGFzayhvYmosIGZ1bmNOYW1lLCBtZXRhQ3JlYXRvcikge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICAgIGRhdGEuYXJnc1tkYXRhLmNiSWR4XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIHNldE5hdGl2ZS5hcHBseShkYXRhLnRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgfVxuICAgIHNldE5hdGl2ZSA9IHBhdGNoTWV0aG9kKG9iaiwgZnVuY05hbWUsIChkZWxlZ2F0ZSkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IG1ldGFDcmVhdG9yKHNlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAobWV0YS5jYklkeCA+PSAwICYmIHR5cGVvZiBhcmdzW21ldGEuY2JJZHhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUobWV0YS5uYW1lLCBhcmdzW21ldGEuY2JJZHhdLCBtZXRhLCBzY2hlZHVsZVRhc2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQsIG9yaWdpbmFsKSB7XG4gICAgcGF0Y2hlZFt6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyldID0gb3JpZ2luYWw7XG59XG5sZXQgaXNEZXRlY3RlZElFT3JFZGdlID0gZmFsc2U7XG5sZXQgaWVPckVkZ2UgPSBmYWxzZTtcbmZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdWEgPSBpbnRlcm5hbFdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICBpZiAodWEuaW5kZXhPZignTVNJRSAnKSAhPT0gLTEgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNJRU9yRWRnZSgpIHtcbiAgICBpZiAoaXNEZXRlY3RlZElFT3JFZGdlKSB7XG4gICAgICAgIHJldHVybiBpZU9yRWRnZTtcbiAgICB9XG4gICAgaXNEZXRlY3RlZElFT3JFZGdlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1YSA9IGludGVybmFsV2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIGlmICh1YS5pbmRleE9mKCdNU0lFICcpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdFZGdlLycpICE9PSAtMSkge1xuICAgICAgICAgICAgaWVPckVkZ2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgcmV0dXJuIGllT3JFZGdlO1xufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbi8vIE5vdGUgdGhhdCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyBhcmUgbm93IHN1cHBvcnRlZCBieSBtb3N0IG1vZGVybiBicm93c2Vycyxcbi8vIGluY2x1ZGluZyBDaHJvbWUsIEZpcmVmb3gsIFNhZmFyaSwgYW5kIEVkZ2UuIFRoZXJlJ3MgYSBwZW5kaW5nIGNoYW5nZSB0aGF0XG4vLyB3b3VsZCByZW1vdmUgc3VwcG9ydCBmb3IgbGVnYWN5IGJyb3dzZXJzIGJ5IHpvbmUuanMuIFJlbW92aW5nIGBwYXNzaXZlU3VwcG9ydGVkYFxuLy8gZnJvbSB0aGUgY29kZWJhc2Ugd2lsbCByZWR1Y2UgdGhlIGZpbmFsIGNvZGUgc2l6ZSBmb3IgZXhpc3RpbmcgYXBwcyB0aGF0IHN0aWxsIHVzZSB6b25lLmpzLlxubGV0IHBhc3NpdmVTdXBwb3J0ZWQgPSBmYWxzZTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTm90ZTogV2UgcGFzcyB0aGUgYG9wdGlvbnNgIG9iamVjdCBhcyB0aGUgZXZlbnQgaGFuZGxlciB0b28uIFRoaXMgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGVcbiAgICAgICAgLy8gc2lnbmF0dXJlIG9mIGBhZGRFdmVudExpc3RlbmVyYCBvciBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgYnV0IGVuYWJsZXMgdXMgdG8gcmVtb3ZlIHRoZSBoYW5kbGVyXG4gICAgICAgIC8vIHdpdGhvdXQgYW4gYWN0dWFsIGhhbmRsZXIuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuICAgIH1cbn1cbi8vIGFuIGlkZW50aWZpZXIgdG8gdGVsbCBab25lVGFzayBkbyBub3QgY3JlYXRlIGEgbmV3IGludm9rZSBjbG9zdXJlXG5jb25zdCBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEEgPSB7XG4gICAgdXNlRzogdHJ1ZSxcbn07XG5jb25zdCB6b25lU3ltYm9sRXZlbnROYW1lcyA9IHt9O1xuY29uc3QgZ2xvYmFsU291cmNlcyA9IHt9O1xuY29uc3QgRVZFTlRfTkFNRV9TWU1CT0xfUkVHWCA9IG5ldyBSZWdFeHAoJ14nICsgWk9ORV9TWU1CT0xfUFJFRklYICsgJyhcXFxcdyspKHRydWV8ZmFsc2UpJCcpO1xuY29uc3QgSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTCA9IHpvbmVTeW1ib2woJ3Byb3BhZ2F0aW9uU3RvcHBlZCcpO1xuZnVuY3Rpb24gcHJlcGFyZUV2ZW50TmFtZXMoZXZlbnROYW1lLCBldmVudE5hbWVUb1N0cmluZykge1xuICAgIGNvbnN0IGZhbHNlRXZlbnROYW1lID0gKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSkgKyBGQUxTRV9TVFI7XG4gICAgY29uc3QgdHJ1ZUV2ZW50TmFtZSA9IChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpICsgVFJVRV9TVFI7XG4gICAgY29uc3Qgc3ltYm9sID0gWk9ORV9TWU1CT0xfUFJFRklYICsgZmFsc2VFdmVudE5hbWU7XG4gICAgY29uc3Qgc3ltYm9sQ2FwdHVyZSA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIHRydWVFdmVudE5hbWU7XG4gICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHt9O1xuICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bRkFMU0VfU1RSXSA9IHN5bWJvbDtcbiAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW1RSVUVfU1RSXSA9IHN5bWJvbENhcHR1cmU7XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50VGFyZ2V0KF9nbG9iYWwsIGFwaSwgYXBpcywgcGF0Y2hPcHRpb25zKSB7XG4gICAgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuYWRkKSB8fCBBRERfRVZFTlRfTElTVEVORVJfU1RSO1xuICAgIGNvbnN0IFJFTU9WRV9FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtKSB8fCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSO1xuICAgIGNvbnN0IExJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmxpc3RlbmVycykgfHwgJ2V2ZW50TGlzdGVuZXJzJztcbiAgICBjb25zdCBSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtQWxsKSB8fCAncmVtb3ZlQWxsTGlzdGVuZXJzJztcbiAgICBjb25zdCB6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lciA9IHpvbmVTeW1ib2woQUREX0VWRU5UX0xJU1RFTkVSKTtcbiAgICBjb25zdCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy4nICsgQUREX0VWRU5UX0xJU1RFTkVSICsgJzonO1xuICAgIGNvbnN0IFBSRVBFTkRfRVZFTlRfTElTVEVORVIgPSAncHJlcGVuZExpc3RlbmVyJztcbiAgICBjb25zdCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSA9ICcuJyArIFBSRVBFTkRfRVZFTlRfTElTVEVORVIgKyAnOic7XG4gICAgY29uc3QgaW52b2tlVGFzayA9IGZ1bmN0aW9uICh0YXNrLCB0YXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIC8vIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UsIGNoZWNrIGlzUmVtb3ZlZCB3aGljaCBpcyBzZXRcbiAgICAgICAgLy8gYnkgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAgICBpZiAodGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgPT09ICdvYmplY3QnICYmIGRlbGVnYXRlLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGJpbmQgdmVyc2lvbiBvZiBoYW5kbGVFdmVudCB3aGVuIGludm9rZVxuICAgICAgICAgICAgdGFzay5jYWxsYmFjayA9IChldmVudCkgPT4gZGVsZWdhdGUuaGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGFzay5vcmlnaW5hbERlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW52b2tlIHN0YXRpYyB0YXNrLmludm9rZVxuICAgICAgICAvLyBuZWVkIHRvIHRyeS9jYXRjaCBlcnJvciBoZXJlLCBvdGhlcndpc2UsIHRoZSBlcnJvciBpbiBvbmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgLy8gd2lsbCBicmVhayB0aGUgZXhlY3V0aW9ucyBvZiB0aGUgb3RoZXIgZXZlbnQgbGlzdGVuZXJzLiBBbHNvIGVycm9yIHdpbGxcbiAgICAgICAgLy8gbm90IHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgd2hlbiBgb25jZWAgb3B0aW9ucyBpcyB0cnVlLlxuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0YXNrLmludm9rZSh0YXNrLCB0YXJnZXQsIFtldmVudF0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0YXNrLm9wdGlvbnM7XG4gICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLm9uY2UpIHtcbiAgICAgICAgICAgIC8vIGlmIG9wdGlvbnMub25jZSBpcyB0cnVlLCBhZnRlciBpbnZva2Ugb25jZSByZW1vdmUgbGlzdGVuZXIgaGVyZVxuICAgICAgICAgICAgLy8gb25seSBicm93c2VyIG5lZWQgdG8gZG8gdGhpcywgbm9kZWpzIGV2ZW50RW1pdHRlciB3aWxsIGNhbCByZW1vdmVMaXN0ZW5lclxuICAgICAgICAgICAgLy8gaW5zaWRlIEV2ZW50RW1pdHRlci5vbmNlXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICB0YXJnZXRbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRhcmdldCwgZXZlbnQudHlwZSwgZGVsZWdhdGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGdsb2JhbENhbGxiYWNrKGNvbnRleHQsIGV2ZW50LCBpc0NhcHR1cmUpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgICAgIC8vIGV2ZW50IHdpbGwgYmUgdW5kZWZpbmVkLCBzbyB3ZSBuZWVkIHRvIHVzZSB3aW5kb3cuZXZlbnRcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBfZ2xvYmFsLmV2ZW50O1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXZlbnQudGFyZ2V0IGlzIG5lZWRlZCBmb3IgU2Ftc3VuZyBUViBhbmQgU291cmNlQnVmZmVyXG4gICAgICAgIC8vIHx8IGdsb2JhbCBpcyBuZWVkZWQgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvMTkwXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGNvbnRleHQgfHwgZXZlbnQudGFyZ2V0IHx8IF9nbG9iYWw7XG4gICAgICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3pvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdW2lzQ2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXV07XG4gICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgICAgICAvLyBpbnZva2UgYWxsIHRhc2tzIHdoaWNoIGF0dGFjaGVkIHRvIGN1cnJlbnQgdGFyZ2V0IHdpdGggZ2l2ZW4gZXZlbnQudHlwZSBhbmQgY2FwdHVyZSA9IGZhbHNlXG4gICAgICAgICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgaWYgdGFzay5sZW5ndGggPT09IDEsIGp1c3QgaW52b2tlXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyID0gaW52b2tlVGFzayh0YXNrc1swXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAgICAgZXJyICYmIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy84MzZcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSB0YXNrcyBhcnJheSBiZWZvcmUgaW52b2tlLCB0byBhdm9pZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgb3Igb3RoZXIgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3B5VGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29weVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBldmVudFtJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gaW52b2tlVGFzayhjb3B5VGFza3NbaV0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBlcnIgJiYgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGVyZSBpcyBvbmx5IG9uZSBlcnJvciwgd2UgZG9uJ3QgbmVlZCB0byBzY2hlZHVsZSBtaWNyb1Rhc2tcbiAgICAgICAgICAgIC8vIHRvIHRocm93IHRoZSBlcnJvci5cbiAgICAgICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gZXJyb3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICBhcGkubmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZ2xvYmFsIHNoYXJlZCB6b25lQXdhcmVDYWxsYmFjayB0byBoYW5kbGUgYWxsIGV2ZW50IGNhbGxiYWNrIHdpdGggY2FwdHVyZSA9IGZhbHNlXG4gICAgY29uc3QgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbENhbGxiYWNrKHRoaXMsIGV2ZW50LCBmYWxzZSk7XG4gICAgfTtcbiAgICAvLyBnbG9iYWwgc2hhcmVkIHpvbmVBd2FyZUNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgZXZlbnQgY2FsbGJhY2sgd2l0aCBjYXB0dXJlID0gdHJ1ZVxuICAgIGNvbnN0IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ2FsbGJhY2sodGhpcywgZXZlbnQsIHRydWUpO1xuICAgIH07XG4gICAgZnVuY3Rpb24gcGF0Y2hFdmVudFRhcmdldE1ldGhvZHMob2JqLCBwYXRjaE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXNlR2xvYmFsQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy51c2VHICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHVzZUdsb2JhbENhbGxiYWNrID0gcGF0Y2hPcHRpb25zLnVzZUc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsaWRhdGVIYW5kbGVyID0gcGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy52aDtcbiAgICAgICAgbGV0IGNoZWNrRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuY2hrRHVwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoZWNrRHVwbGljYXRlID0gcGF0Y2hPcHRpb25zLmNoa0R1cDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0dXJuVGFyZ2V0ID0gZmFsc2U7XG4gICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVyblRhcmdldCA9IHBhdGNoT3B0aW9ucy5ydDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJvdG8gPSBvYmo7XG4gICAgICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkoQUREX0VWRU5UX0xJU1RFTkVSKSkge1xuICAgICAgICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcm90byAmJiBvYmpbQUREX0VWRU5UX0xJU1RFTkVSXSkge1xuICAgICAgICAgICAgLy8gc29tZWhvdyB3ZSBkaWQgbm90IGZpbmQgaXQsIGJ1dCB3ZSBjYW4gc2VlIGl0LiBUaGlzIGhhcHBlbnMgb24gSUUgZm9yIFdpbmRvdyBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgcHJvdG8gPSBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcm90bykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm90b1t6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lcl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmVudE5hbWVUb1N0cmluZyA9IHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuZXZlbnROYW1lVG9TdHJpbmc7XG4gICAgICAgIC8vIFdlIHVzZSBhIHNoYXJlZCBnbG9iYWwgYHRhc2tEYXRhYCB0byBwYXNzIGRhdGEgZm9yIGBzY2hlZHVsZUV2ZW50VGFza2AsXG4gICAgICAgIC8vIGVsaW1pbmF0aW5nIHRoZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3Qgc29sZWx5IGZvciBwYXNzaW5nIGRhdGEuXG4gICAgICAgIC8vIFdBUk5JTkc6IFRoaXMgb2JqZWN0IGhhcyBhIHN0YXRpYyBsaWZldGltZSwgbWVhbmluZyBpdCBpcyBub3QgY3JlYXRlZFxuICAgICAgICAvLyBlYWNoIHRpbWUgYGFkZEV2ZW50TGlzdGVuZXJgIGlzIGNhbGxlZC4gSXQgaXMgaW5zdGFudGlhdGVkIG9ubHkgb25jZVxuICAgICAgICAvLyBhbmQgY2FwdHVyZWQgYnkgcmVmZXJlbmNlIGluc2lkZSB0aGUgYGFkZEV2ZW50TGlzdGVuZXJgIGFuZFxuICAgICAgICAvLyBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgZnVuY3Rpb25zLiBEbyBub3QgYWRkIGFueSBuZXcgcHJvcGVydGllcyB0byB0aGlzXG4gICAgICAgIC8vIG9iamVjdCwgYXMgZG9pbmcgc28gd291bGQgbmVjZXNzaXRhdGUgbWFpbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uXG4gICAgICAgIC8vIGJldHdlZW4gYGFkZEV2ZW50TGlzdGVuZXJgIGNhbGxzLlxuICAgICAgICBjb25zdCB0YXNrRGF0YSA9IHt9O1xuICAgICAgICBjb25zdCBuYXRpdmVBZGRFdmVudExpc3RlbmVyID0gKHByb3RvW3pvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyXSA9IHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0pO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyID0gKHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICAgICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSk7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUxpc3RlbmVycyA9IChwcm90b1t6b25lU3ltYm9sKExJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0pO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMgPSAocHJvdG9bem9uZVN5bWJvbChSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSk7XG4gICAgICAgIGxldCBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lcjtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucHJlcGVuZCkge1xuICAgICAgICAgICAgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sKHBhdGNoT3B0aW9ucy5wcmVwZW5kKV0gPVxuICAgICAgICAgICAgICAgIHByb3RvW3BhdGNoT3B0aW9ucy5wcmVwZW5kXTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyB1dGlsIGZ1bmN0aW9uIHdpbGwgYnVpbGQgYW4gb3B0aW9uIG9iamVjdCB3aXRoIHBhc3NpdmUgb3B0aW9uXG4gICAgICAgICAqIHRvIGhhbmRsZSBhbGwgcG9zc2libGUgaW5wdXQgZnJvbSB0aGUgdXNlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkRXZlbnRMaXN0ZW5lck9wdGlvbnMob3B0aW9ucywgcGFzc2l2ZSkge1xuICAgICAgICAgICAgaWYgKCFwYXNzaXZlU3VwcG9ydGVkICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gZG9lc24ndCBzdXBwb3J0IHBhc3NpdmUgYnV0IHVzZXIgd2FudCB0byBwYXNzIGFuIG9iamVjdCBhcyBvcHRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBub3Qgd29yayBvbiBzb21lIG9sZCBicm93c2VyLCBzbyB3ZSBqdXN0IHBhc3MgYSBib29sZWFuXG4gICAgICAgICAgICAgICAgLy8gYXMgdXNlQ2FwdHVyZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBhc3NpdmVTdXBwb3J0ZWQgfHwgIXBhc3NpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2FwdHVyZTogb3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLnBhc3NpdmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVHbG9iYWwgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRhc2sgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlLFxuICAgICAgICAgICAgLy8ganVzdCByZXR1cm4sIGJlY2F1c2Ugd2UgdXNlIHRoZSBzaGFyZWQgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgaGVyZS5cbiAgICAgICAgICAgIGlmICh0YXNrRGF0YS5pc0V4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFza0RhdGEuY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluIHRoZSBjb250ZXh0IG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICogY2FsbGVkIGF0IHRoZSBlbmQgYnkgYGNhbmNlbFRhc2tgLCB3aGljaCwgaW4gdHVybiwgY2FsbHMgYHRhc2suY2FuY2VsRm5gLlxuICAgICAgICAgKiBDYW5jZWxsaW5nIGEgdGFzayBpcyBwcmltYXJpbHkgdXNlZCB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb21cbiAgICAgICAgICogdGhlIHRhc2sgdGFyZ2V0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY3VzdG9tQ2FuY2VsR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIC8vIGlmIHRhc2sgaXMgbm90IG1hcmtlZCBhcyBpc1JlbW92ZWQsIHRoaXMgY2FsbCBpcyBkaXJlY3RseVxuICAgICAgICAgICAgLy8gZnJvbSBab25lLnByb3RvdHlwZS5jYW5jZWxUYXNrLCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSB0YXNrXG4gICAgICAgICAgICAvLyBmcm9tIHRhc2tzTGlzdCBvZiB0YXJnZXQgZmlyc3RcbiAgICAgICAgICAgIGlmICghdGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbdGFzay5ldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1t0YXNrLmNhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFzay50YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5yZW1vdmVBYm9ydExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucmVtb3ZlQWJvcnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnJlbW92ZUFib3J0TGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgLy8gd2Ugd2lsbCByZWFsbHkgcmVtb3ZlIHRoZSBnbG9iYWwgZXZlbnQgY2FsbGJhY2ssXG4gICAgICAgICAgICAvLyBpZiBub3QsIHJldHVyblxuICAgICAgICAgICAgaWYgKCF0YXNrLmFsbFJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5jYXB0dXJlID8gZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrIDogZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2ssIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwodGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVQcmVwZW5kID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbUNhbmNlbE5vbkdsb2JhbCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21TY2hlZHVsZUdsb2JhbCA6IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsO1xuICAgICAgICBjb25zdCBjdXN0b21DYW5jZWwgPSB1c2VHbG9iYWxDYWxsYmFjayA/IGN1c3RvbUNhbmNlbEdsb2JhbCA6IGN1c3RvbUNhbmNlbE5vbkdsb2JhbDtcbiAgICAgICAgY29uc3QgY29tcGFyZVRhc2tDYWxsYmFja1ZzRGVsZWdhdGUgPSBmdW5jdGlvbiAodGFzaywgZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVPZkRlbGVnYXRlID0gdHlwZW9mIGRlbGVnYXRlO1xuICAgICAgICAgICAgcmV0dXJuICgodHlwZU9mRGVsZWdhdGUgPT09ICdmdW5jdGlvbicgJiYgdGFzay5jYWxsYmFjayA9PT0gZGVsZWdhdGUpIHx8XG4gICAgICAgICAgICAgICAgKHR5cGVPZkRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPT09IGRlbGVnYXRlKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBhcmUgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmRpZmYgPyBwYXRjaE9wdGlvbnMuZGlmZiA6IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlO1xuICAgICAgICBjb25zdCB1bnBhdGNoZWRFdmVudHMgPSBab25lW3pvbmVTeW1ib2woJ1VOUEFUQ0hFRF9FVkVOVFMnKV07XG4gICAgICAgIGNvbnN0IHBhc3NpdmVFdmVudHMgPSBfZ2xvYmFsW3pvbmVTeW1ib2woJ1BBU1NJVkVfRVZFTlRTJyldO1xuICAgICAgICBmdW5jdGlvbiBjb3B5RXZlbnRMaXN0ZW5lck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBkZXN0cnVjdHVyZSB0aGUgdGFyZ2V0IGBvcHRpb25zYCBvYmplY3Qgc2luY2UgaXQgbWF5XG4gICAgICAgICAgICAgICAgLy8gYmUgZnJvemVuIG9yIHNlYWxlZCAocG9zc2libHkgcHJvdmlkZWQgaW1wbGljaXRseSBieSBhIHRoaXJkLXBhcnR5XG4gICAgICAgICAgICAgICAgLy8gbGlicmFyeSksIG9yIGl0cyBwcm9wZXJ0aWVzIG1heSBiZSByZWFkb25seS5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdPcHRpb25zID0geyAuLi5vcHRpb25zIH07XG4gICAgICAgICAgICAgICAgLy8gVGhlIGBzaWduYWxgIG9wdGlvbiB3YXMgcmVjZW50bHkgaW50cm9kdWNlZCwgd2hpY2ggY2F1c2VkIHJlZ3Jlc3Npb25zIGluXG4gICAgICAgICAgICAgICAgLy8gdGhpcmQtcGFydHkgc2NlbmFyaW9zIHdoZXJlIGBBYm9ydENvbnRyb2xsZXJgIHdhcyBkaXJlY3RseSBwcm92aWRlZCB0b1xuICAgICAgICAgICAgICAgIC8vIGBhZGRFdmVudExpc3RlbmVyYCBhcyBvcHRpb25zLiBGb3IgaW5zdGFuY2UsIGluIGNhc2VzIGxpa2VcbiAgICAgICAgICAgICAgICAvLyBgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNhbGxiYWNrLCBhYm9ydENvbnRyb2xsZXJJbnN0YW5jZSlgLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGlzIHZhbGlkIGJlY2F1c2UgYEFib3J0Q29udHJvbGxlcmAgaW5jbHVkZXMgYSBgc2lnbmFsYCBnZXR0ZXIsIHNwcmVhZGluZ1xuICAgICAgICAgICAgICAgIC8vIGB7Li4ub3B0aW9uc31gIHdvdWxkbid0IGNvcHkgdGhlIGBzaWduYWxgLiBBZGRpdGlvbmFsbHksIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgICAgIC8vIGlzbid0IGZlYXNpYmxlIHNpbmNlIGBBYm9ydENvbnRyb2xsZXJgIGlzIGEgYnVpbHQtaW4gb2JqZWN0IHR5cGUsIGFuZCBhdHRlbXB0aW5nXG4gICAgICAgICAgICAgICAgLy8gdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBkaXJlY3RseSB3aXRoIGl0IGFzIHRoZSBwcm90b3R5cGUgbWlnaHQgcmVzdWx0IGluXG4gICAgICAgICAgICAgICAgLy8gdW5leHBlY3RlZCBiZWhhdmlvci5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zaWduYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T3B0aW9ucy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld09wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYWtlQWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAobmF0aXZlTGlzdGVuZXIsIGFkZFNvdXJjZSwgY3VzdG9tU2NoZWR1bGVGbiwgY3VzdG9tQ2FuY2VsRm4sIHJldHVyblRhcmdldCA9IGZhbHNlLCBwcmVwZW5kID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNOb2RlICYmIGV2ZW50TmFtZSA9PT0gJ3VuY2F1Z2h0RXhjZXB0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBwYXRjaCB1bmNhdWdodEV4Y2VwdGlvbiBvZiBub2RlanMgdG8gcHJldmVudCBlbmRsZXNzIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGNyZWF0ZSB0aGUgYmluZCBkZWxlZ2F0ZSBmdW5jdGlvbiBmb3IgaGFuZGxlRXZlbnRcbiAgICAgICAgICAgICAgICAvLyBjYXNlIGhlcmUgdG8gaW1wcm92ZSBhZGRFdmVudExpc3RlbmVyIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2lsbCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgd2hlbiBpbnZva2VcbiAgICAgICAgICAgICAgICBsZXQgaXNIYW5kbGVFdmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNIYW5kbGVFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiYgIXZhbGlkYXRlSGFuZGxlcihuYXRpdmVMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NpdmUgPSBwYXNzaXZlU3VwcG9ydGVkICYmICEhcGFzc2l2ZUV2ZW50cyAmJiBwYXNzaXZlRXZlbnRzLmluZGV4T2YoZXZlbnROYW1lKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvcHlFdmVudExpc3RlbmVyT3B0aW9ucyhidWlsZEV2ZW50TGlzdGVuZXJPcHRpb25zKGFyZ3VtZW50c1syXSwgcGFzc2l2ZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpZ25hbCA9IG9wdGlvbnM/LnNpZ25hbDtcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzaWduYWwgaXMgYW4gYWJvcnRlZCBvbmUsIGp1c3QgcmV0dXJuIHdpdGhvdXQgYXR0YWNoaW5nIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodW5wYXRjaGVkRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHVucGF0Y2hlZCBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5wYXRjaGVkRXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSB1bnBhdGNoZWRFdmVudHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2l2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuY2FsbCh0YXJnZXQsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNhcHR1cmUgPSAhb3B0aW9ucyA/IGZhbHNlIDogdHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJyA/IHRydWUgOiBvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICAgICAgY29uc3Qgb25jZSA9IG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnID8gb3B0aW9ucy5vbmNlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCFzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXBhcmVFdmVudE5hbWVzKGV2ZW50TmFtZSwgZXZlbnROYW1lVG9TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tjYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICAgICAgICAgIGxldCBleGlzdGluZ1Rhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGlzRXhpc3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBhbHJlYWR5IGhhdmUgdGFzayByZWdpc3RlcmVkXG4gICAgICAgICAgICAgICAgICAgIGlzRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlKGV4aXN0aW5nVGFza3NbaV0sIGRlbGVnYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYW1lIGNhbGxiYWNrLCBzYW1lIGNhcHR1cmUsIHNhbWUgZXZlbnQgbmFtZSwganVzdCByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2U7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3JOYW1lID0gdGFyZ2V0LmNvbnN0cnVjdG9yWyduYW1lJ107XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0U291cmNlID0gZ2xvYmFsU291cmNlc1tjb25zdHJ1Y3Rvck5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gdGFyZ2V0U291cmNlW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvck5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNvdXJjZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBjb2RlIGJlbG93LCBgb3B0aW9uc2Agc2hvdWxkIG5vIGxvbmdlciBiZSByZWFzc2lnbmVkOyBpbnN0ZWFkLCBpdFxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBvbmx5IGJlIG11dGF0ZWQuIFRoaXMgaXMgYmVjYXVzZSB3ZSBwYXNzIHRoYXQgb2JqZWN0IHRvIHRoZSBuYXRpdmVcbiAgICAgICAgICAgICAgICAvLyBgYWRkRXZlbnRMaXN0ZW5lcmAuXG4gICAgICAgICAgICAgICAgLy8gSXQncyBnZW5lcmFsbHkgcmVjb21tZW5kZWQgdG8gdXNlIHRoZSBzYW1lIG9iamVjdCByZWZlcmVuY2UgZm9yIG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBlbnN1cmVzIGNvbnNpc3RlbmN5IGFuZCBhdm9pZHMgcG90ZW50aWFsIGlzc3Vlcy5cbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIGBhZGRFdmVudExpc3RlbmVyYCB3aXRoIHRoZSBgb25jZWAgb3B0aW9uLCB3ZSBkb24ndCBwYXNzXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBgb25jZWAgb3B0aW9uIGRpcmVjdGx5IHRvIHRoZSBuYXRpdmUgYGFkZEV2ZW50TGlzdGVuZXJgIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGVhZCwgd2Uga2VlcCB0aGUgYG9uY2VgIHNldHRpbmcgYW5kIGhhbmRsZSBpdCBvdXJzZWx2ZXMuXG4gICAgICAgICAgICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMub25jZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrRGF0YS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGFza0RhdGEuY2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgICAgICAgICAgdGFza0RhdGEuZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICAgICAgICAgIHRhc2tEYXRhLmlzRXhpc3RpbmcgPSBpc0V4aXN0aW5nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB1c2VHbG9iYWxDYWxsYmFjayA/IE9QVElNSVpFRF9aT05FX0VWRU5UX1RBU0tfREFUQSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBrZWVwIHRhc2tEYXRhIGludG8gZGF0YSB0byBhbGxvdyBvblNjaGVkdWxlRXZlbnRUYXNrIHRvIGFjY2VzcyB0aGUgdGFzayBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGFza0RhdGEgPSB0YXNrRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHVzaW5nIGBhZGRFdmVudExpc3RlbmVyYCB3aXRoIHRoZSBgc2lnbmFsYCBvcHRpb24sIHdlIGRvbid0IHBhc3NcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGBzaWduYWxgIG9wdGlvbiBkaXJlY3RseSB0byB0aGUgbmF0aXZlIGBhZGRFdmVudExpc3RlbmVyYCBtZXRob2QuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluc3RlYWQsIHdlIGtlZXAgdGhlIGBzaWduYWxgIHNldHRpbmcgYW5kIGhhbmRsZSBpdCBvdXJzZWx2ZXMuXG4gICAgICAgICAgICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMuc2lnbmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUaGUgYHNjaGVkdWxlRXZlbnRUYXNrYCBmdW5jdGlvbiB3aWxsIHVsdGltYXRlbHkgY2FsbCBgY3VzdG9tU2NoZWR1bGVHbG9iYWxgLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGluIHR1cm4gY2FsbHMgdGhlIG5hdGl2ZSBgYWRkRXZlbnRMaXN0ZW5lcmAuIFRoaXMgaXMgd2h5IGB0YXNrRGF0YS5vcHRpb25zYFxuICAgICAgICAgICAgICAgIC8vIGlzIHVwZGF0ZWQgYmVmb3JlIHNjaGVkdWxpbmcgdGhlIHRhc2ssIGFzIGBjdXN0b21TY2hlZHVsZUdsb2JhbGAgdXNlc1xuICAgICAgICAgICAgICAgIC8vIGB0YXNrRGF0YS5vcHRpb25zYCB0byBwYXNzIGl0IHRvIHRoZSBuYXRpdmUgYGFkZEV2ZW50TGlzdGVuZXJgLlxuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSB6b25lLnNjaGVkdWxlRXZlbnRUYXNrKHNvdXJjZSwgZGVsZWdhdGUsIGRhdGEsIGN1c3RvbVNjaGVkdWxlRm4sIGN1c3RvbUNhbmNlbEZuKTtcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRhc2sgaXMgc2NoZWR1bGVkLCB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBzaWduYWwgYmFjayB0byB0YXNrLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdyYXBwaW5nIGB0YXNrYCBpbiBhIHdlYWsgcmVmZXJlbmNlIHdvdWxkIG5vdCBwcmV2ZW50IG1lbW9yeSBsZWFrcy4gV2VhayByZWZlcmVuY2VzIGFyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcmltYXJpbHkgdXNlZCBmb3IgcHJldmVudGluZyBzdHJvbmcgcmVmZXJlbmNlcyBjeWNsZXMuIGBvbkFib3J0YCBpcyBhbHdheXMgcmVhY2hhYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3MgYW4gZXZlbnQgbGlzdGVuZXIsIHNvIGl0cyBjbG9zdXJlIHJldGFpbnMgYSBzdHJvbmcgcmVmZXJlbmNlIHRvIHRoZSBgdGFza2AuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgbmF0aXZlTGlzdGVuZXIuY2FsbChzaWduYWwsICdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byByZW1vdmUgdGhlIGBhYm9ydGAgbGlzdGVuZXIgd2hlbiB0aGUgZXZlbnQgbGlzdGVuZXIgaXMgZ29pbmcgdG8gYmUgcmVtb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gYXMgaXQgY3JlYXRlcyBhIGNsb3N1cmUgdGhhdCBjYXB0dXJlcyBgdGFza2AuIFRoaXMgY2xvc3VyZSByZXRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBgdGFza2Agb2JqZWN0IGV2ZW4gYWZ0ZXIgaXQgZ29lcyBvdXQgb2Ygc2NvcGUsIHByZXZlbnRpbmcgYHRhc2tgIGZyb20gYmVpbmcgZ2FyYmFnZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgIHRhc2sucmVtb3ZlQWJvcnRMaXN0ZW5lciA9ICgpID0+IHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgY2xlYXIgdGFza0RhdGEudGFyZ2V0IHRvIGF2b2lkIG1lbW9yeSBsZWFrXG4gICAgICAgICAgICAgICAgLy8gaXNzdWUsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNDQyXG4gICAgICAgICAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGNsZWFyIHVwIHRhc2tEYXRhIGJlY2F1c2UgaXQgaXMgYSBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50YXNrRGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGhhdmUgdG8gc2F2ZSB0aG9zZSBpbmZvcm1hdGlvbiB0byB0YXNrIGluIGNhc2VcbiAgICAgICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiBtYXkgY2FsbCB0YXNrLnpvbmUuY2FuY2VsVGFzaygpIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoIXBhc3NpdmVTdXBwb3J0ZWQgJiYgdHlwZW9mIHRhc2sub3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBub3Qgc3VwcG9ydCBwYXNzaXZlLCBhbmQgd2UgcGFzcyBhbiBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGFkZEV2ZW50TGlzdGVuZXIsIHdlIHNob3VsZCBzYXZlIHRoZSBvcHRpb25zIHRvIHRhc2tcbiAgICAgICAgICAgICAgICAgICAgdGFzay5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFzay50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGFzay5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgICB0YXNrLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoaXNIYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIG9yaWdpbmFsIGRlbGVnYXRlIGZvciBjb21wYXJlIHRvIGNoZWNrIGR1cGxpY2F0ZVxuICAgICAgICAgICAgICAgICAgICB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVwZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MudW5zaGlmdCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0gPSBtYWtlQWRkTGlzdGVuZXIobmF0aXZlQWRkRXZlbnRMaXN0ZW5lciwgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCwgcmV0dXJuVGFyZ2V0KTtcbiAgICAgICAgaWYgKG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBwcm90b1tQUkVQRU5EX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lciwgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UsIGN1c3RvbVNjaGVkdWxlUHJlcGVuZCwgY3VzdG9tQ2FuY2VsLCByZXR1cm5UYXJnZXQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlID0gIW9wdGlvbnMgPyBmYWxzZSA6IHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicgPyB0cnVlIDogb3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiZcbiAgICAgICAgICAgICAgICAhdmFsaWRhdGVIYW5kbGVyKG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAvLyBgZXhpc3RpbmdUYXNrc2AgbWF5IG5vdCBleGlzdCBpZiB0aGUgYGFkZEV2ZW50TGlzdGVuZXJgIHdhcyBjYWxsZWQgYmVmb3JlXG4gICAgICAgICAgICAvLyBpdCB3YXMgcGF0Y2hlZCBieSB6b25lLmpzLiBQbGVhc2UgcmVmZXIgdG8gdGhlIGF0dGFjaGVkIGlzc3VlIGZvclxuICAgICAgICAgICAgLy8gY2xhcmlmaWNhdGlvbiwgcGFydGljdWxhcmx5IGFmdGVyIHRoZSBgaWZgIGNvbmRpdGlvbiwgYmVmb3JlIGNhbGxpbmdcbiAgICAgICAgICAgIC8vIHRoZSBuYXRpdmUgYHJlbW92ZUV2ZW50TGlzdGVuZXJgLlxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrID0gZXhpc3RpbmdUYXNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUoZXhpc3RpbmdUYXNrLCBkZWxlZ2F0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgYW5kIHJlbW92ZSB0aGUgdGFzayBjYWNoZSBmcm9tIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay5hbGxSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIHRhcmdldCwgd2UgaGF2ZSBhbiBldmVudCBsaXN0ZW5lciB3aGljaCBpcyBhZGRlZCBieSBvbl9wcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1Y2ggYXMgdGFyZ2V0Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHt9LCBzbyB3ZSBuZWVkIHRvIGNsZWFyIHRoaXMgaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSB0b28gaWYgYWxsIGRlbGVnYXRlcyB3aXRoIGNhcHR1cmU9ZmFsc2Ugd2VyZSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly8gZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMxNjQzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNTQ1ODFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNhcHR1cmUgJiYgdHlwZW9mIGV2ZW50TmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb25Qcm9wZXJ0eVN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArICdPTl9QUk9QRVJUWScgKyBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtvblByb3BlcnR5U3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gYWxsIG90aGVyIGNvbmRpdGlvbnMsIHdoZW4gYGFkZEV2ZW50TGlzdGVuZXJgIGlzIGNhbGxlZCBhZnRlciBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGF0Y2hlZCBieSB6b25lLmpzLCB3ZSB3b3VsZCBhbHdheXMgZmluZCBhbiBldmVudCB0YXNrIG9uIHRoZSBgRXZlbnRUYXJnZXRgLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHRyaWdnZXIgYGNhbmNlbEZuYCBvbiB0aGUgYGV4aXN0aW5nVGFza2AsIGxlYWRpbmcgdG8gYGN1c3RvbUNhbmNlbEdsb2JhbGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB1bHRpbWF0ZWx5IHJlbW92ZXMgYW4gZXZlbnQgbGlzdGVuZXIgYW5kIGNsZWFucyB1cCB0aGUgYWJvcnQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChpZiBhbiBgQWJvcnRTaWduYWxgIHdhcyBwcm92aWRlZCB3aGVuIHNjaGVkdWxpbmcgYSB0YXNrKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay56b25lLmNhbmNlbFRhc2soZXhpc3RpbmdUYXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTMwXG4gICAgICAgICAgICAvLyBXZSBtYXkgZW5jb3VudGVyIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSBgYWRkRXZlbnRMaXN0ZW5lcmAgd2FzXG4gICAgICAgICAgICAvLyBjYWxsZWQgb24gdGhlIGV2ZW50IHRhcmdldCBiZWZvcmUgem9uZS5qcyBpcyBsb2FkZWQsIHJlc3VsdGluZ1xuICAgICAgICAgICAgLy8gaW4gbm8gdGFzayBiZWluZyBzdG9yZWQgb24gdGhlIGV2ZW50IHRhcmdldCBkdWUgdG8gaXRzIGludm9jYXRpb25cbiAgICAgICAgICAgIC8vIG9mIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24uIEluIHRoaXMgc2NlbmFyaW8sIHdlIHNpbXBseSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBpbnZva2UgdGhlIG5hdGl2ZSBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAuXG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHRhc2tzID0gZmluZEV2ZW50VGFza3ModGFyZ2V0LCBldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSB0YXNrc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGRlbGVnYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYLmV4ZWMocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIGluIG5vZGVqcyBFdmVudEVtaXR0ZXIsIHJlbW92ZUxpc3RlbmVyIGV2ZW50IGlzXG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIG1vbml0b3JpbmcgdGhlIHJlbW92ZUxpc3RlbmVyIGNhbGwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIGp1c3Qga2VlcCByZW1vdmVMaXN0ZW5lciBldmVudExpc3RlbmVyIHVudGlsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbCBvdGhlciBldmVudExpc3RlbmVycyBhcmUgcmVtb3ZlZFxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0TmFtZSAmJiBldnROYW1lICE9PSAncmVtb3ZlTGlzdGVuZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2dE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSByZW1vdmVMaXN0ZW5lciBsaXN0ZW5lciBmaW5hbGx5XG4gICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCAncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW0ZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbENhcHR1cmVFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW1RSVUVfU1RSXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FwdHVyZVRhc2tzID0gdGFyZ2V0W3N5bWJvbENhcHR1cmVFdmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcmVtb3ZlVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldmVudE5hbWUsIGRlbGVnYXRlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXB0dXJlVGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gY2FwdHVyZVRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlbW92ZVRhc2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgdGFzay5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gZm9yIG5hdGl2ZSB0b1N0cmluZyBwYXRjaFxuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlQWRkRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgaWYgKG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycykge1xuICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmF0aXZlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFwaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0c1tpXSA9IHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKGFwaXNbaV0sIHBhdGNoT3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xufVxuZnVuY3Rpb24gZmluZEV2ZW50VGFza3ModGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICBjb25zdCBmb3VuZFRhc2tzID0gW107XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IEVWRU5UX05BTUVfU1lNQk9MX1JFR1guZXhlYyhwcm9wKTtcbiAgICAgICAgICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgICAgICAgICBpZiAoZXZ0TmFtZSAmJiAoIWV2ZW50TmFtZSB8fCBldnROYW1lID09PSBldmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kVGFza3MucHVzaCh0YXNrc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvdW5kVGFza3M7XG4gICAgfVxuICAgIGxldCBzeW1ib2xFdmVudE5hbWUgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgIGlmICghc3ltYm9sRXZlbnROYW1lKSB7XG4gICAgICAgIHByZXBhcmVFdmVudE5hbWVzKGV2ZW50TmFtZSk7XG4gICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgfVxuICAgIGNvbnN0IGNhcHR1cmVGYWxzZVRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZVtGQUxTRV9TVFJdXTtcbiAgICBjb25zdCBjYXB0dXJlVHJ1ZVRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZVtUUlVFX1NUUl1dO1xuICAgIGlmICghY2FwdHVyZUZhbHNlVGFza3MpIHtcbiAgICAgICAgcmV0dXJuIGNhcHR1cmVUcnVlVGFza3MgPyBjYXB0dXJlVHJ1ZVRhc2tzLnNsaWNlKCkgOiBbXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBjYXB0dXJlVHJ1ZVRhc2tzXG4gICAgICAgICAgICA/IGNhcHR1cmVGYWxzZVRhc2tzLmNvbmNhdChjYXB0dXJlVHJ1ZVRhc2tzKVxuICAgICAgICAgICAgOiBjYXB0dXJlRmFsc2VUYXNrcy5zbGljZSgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpIHtcbiAgICBjb25zdCBFdmVudCA9IGdsb2JhbFsnRXZlbnQnXTtcbiAgICBpZiAoRXZlbnQgJiYgRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICAgIGFwaS5wYXRjaE1ldGhvZChFdmVudC5wcm90b3R5cGUsICdzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBzZWxmW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCB0aGUgbmF0aXZlIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAgICAgICAgICAgLy8gaW4gY2FzZSBpbiBzb21lIGh5YnJpZCBhcHBsaWNhdGlvbiwgc29tZSBwYXJ0IG9mXG4gICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiB3aWxsIGJlIGNvbnRyb2xsZWQgYnkgem9uZSwgc29tZSBhcmUgbm90XG4gICAgICAgICAgICBkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cbmZ1bmN0aW9uIHBhdGNoUXVldWVNaWNyb3Rhc2soZ2xvYmFsLCBhcGkpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLCAncXVldWVNaWNyb3Rhc2snLCAoZGVsZWdhdGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soJ3F1ZXVlTWljcm90YXNrJywgYXJnc1swXSk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuY29uc3QgdGFza1N5bWJvbCA9IHpvbmVTeW1ib2woJ3pvbmVUYXNrJyk7XG5mdW5jdGlvbiBwYXRjaFRpbWVyKHdpbmRvdywgc2V0TmFtZSwgY2FuY2VsTmFtZSwgbmFtZVN1ZmZpeCkge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGxldCBjbGVhck5hdGl2ZSA9IG51bGw7XG4gICAgc2V0TmFtZSArPSBuYW1lU3VmZml4O1xuICAgIGNhbmNlbE5hbWUgKz0gbmFtZVN1ZmZpeDtcbiAgICBjb25zdCB0YXNrc0J5SGFuZGxlSWQgPSB7fTtcbiAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICBkYXRhLmFyZ3NbMF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGF0YS5oYW5kbGVJZCA9IHNldE5hdGl2ZS5hcHBseSh3aW5kb3csIGRhdGEuYXJncyk7XG4gICAgICAgIHJldHVybiB0YXNrO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclRhc2sodGFzaykge1xuICAgICAgICByZXR1cm4gY2xlYXJOYXRpdmUuY2FsbCh3aW5kb3csIHRhc2suZGF0YS5oYW5kbGVJZCk7XG4gICAgfVxuICAgIHNldE5hdGl2ZSA9IHBhdGNoTWV0aG9kKHdpbmRvdywgc2V0TmFtZSwgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgaXNQZXJpb2RpYzogbmFtZVN1ZmZpeCA9PT0gJ0ludGVydmFsJyxcbiAgICAgICAgICAgICAgICBkZWxheTogbmFtZVN1ZmZpeCA9PT0gJ1RpbWVvdXQnIHx8IG5hbWVTdWZmaXggPT09ICdJbnRlcnZhbCcgPyBhcmdzWzFdIHx8IDAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3NbMF07XG4gICAgICAgICAgICBhcmdzWzBdID0gZnVuY3Rpb24gdGltZXIoKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpc3N1ZS05MzQsIHRhc2sgd2lsbCBiZSBjYW5jZWxsZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpdCBpcyBhIHBlcmlvZGljIHRhc2sgc3VjaCBhc1xuICAgICAgICAgICAgICAgICAgICAvLyBzZXRJbnRlcnZhbFxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80MDM4N1xuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbnVwIHRhc2tzQnlIYW5kbGVJZCBzaG91bGQgYmUgaGFuZGxlZCBiZWZvcmUgc2NoZWR1bGVUYXNrXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHNvbWUgem9uZVNwZWMgbWF5IGludGVyY2VwdCBhbmQgZG9lc24ndCB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNjaGVkdWxlRm4oc2NoZWR1bGVUYXNrKSBwcm92aWRlZCBoZXJlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXNQZXJpb2RpYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmhhbmRsZUlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIG5vbi1ub2RlanMgZW52LCB3ZSByZW1vdmUgdGltZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb20gbG9jYWwgY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW29wdGlvbnMuaGFuZGxlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5oYW5kbGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vZGUgcmV0dXJucyBjb21wbGV4IG9iamVjdHMgYXMgaGFuZGxlSWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgcmVtb3ZlIHRhc2sgcmVmZXJlbmNlIGZyb20gdGltZXIgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oYW5kbGVJZFt0YXNrU3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKHNldE5hbWUsIGFyZ3NbMF0sIG9wdGlvbnMsIHNjaGVkdWxlVGFzaywgY2xlYXJUYXNrKTtcbiAgICAgICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm9kZS5qcyBtdXN0IGFkZGl0aW9uYWxseSBzdXBwb3J0IHRoZSByZWYgYW5kIHVucmVmIGZ1bmN0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHRhc2suZGF0YS5oYW5kbGVJZDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIC8vIGZvciBub24gbm9kZWpzIGVudiwgd2Ugc2F2ZSBoYW5kbGVJZDogdGFza1xuICAgICAgICAgICAgICAgIC8vIG1hcHBpbmcgaW4gbG9jYWwgY2FjaGUgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgICAgIHRhc2tzQnlIYW5kbGVJZFtoYW5kbGVdID0gdGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIC8vIGZvciBub2RlanMgZW52LCB3ZSBzYXZlIHRhc2tcbiAgICAgICAgICAgICAgICAvLyByZWZlcmVuY2UgaW4gdGltZXJJZCBPYmplY3QgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgICAgIGhhbmRsZVt0YXNrU3ltYm9sXSA9IHRhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGhhbmRsZSBpcyBudWxsLCBiZWNhdXNlIHNvbWUgcG9seWZpbGwgb3IgYnJvd3NlclxuICAgICAgICAgICAgLy8gbWF5IHJldHVybiB1bmRlZmluZWQgZnJvbSBzZXRUaW1lb3V0L3NldEludGVydmFsL3NldEltbWVkaWF0ZS9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgICAgIGlmIChoYW5kbGUgJiZcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVmICYmXG4gICAgICAgICAgICAgICAgaGFuZGxlLnVucmVmICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGhhbmRsZS5yZWYgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgaGFuZGxlLnVucmVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGFzay5yZWYgPSBoYW5kbGUucmVmLmJpbmQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICB0YXNrLnVucmVmID0gaGFuZGxlLnVucmVmLmJpbmQoaGFuZGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlID09PSAnbnVtYmVyJyB8fCBoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjbGVhck5hdGl2ZSA9IHBhdGNoTWV0aG9kKHdpbmRvdywgY2FuY2VsTmFtZSwgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICBjb25zdCBpZCA9IGFyZ3NbMF07XG4gICAgICAgIGxldCB0YXNrO1xuICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gbm9uIG5vZGVqcyBlbnYuXG4gICAgICAgICAgICB0YXNrID0gdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIG5vZGVqcyBlbnYuXG4gICAgICAgICAgICB0YXNrID0gaWQgJiYgaWRbdGFza1N5bWJvbF07XG4gICAgICAgICAgICAvLyBvdGhlciBlbnZpcm9ubWVudHMuXG4gICAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhc2sgJiYgdHlwZW9mIHRhc2sudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSAnbm90U2NoZWR1bGVkJyAmJlxuICAgICAgICAgICAgICAgICgodGFzay5jYW5jZWxGbiAmJiB0YXNrLmRhdGEuaXNQZXJpb2RpYykgfHwgdGFzay5ydW5Db3VudCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRbdGFza1N5bWJvbF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEbyBub3QgY2FuY2VsIGFscmVhZHkgY2FuY2VsZWQgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgdGFzay56b25lLmNhbmNlbFRhc2sodGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgICAgZGVsZWdhdGUuYXBwbHkod2luZG93LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXRjaEN1c3RvbUVsZW1lbnRzKF9nbG9iYWwsIGFwaSkge1xuICAgIGNvbnN0IHsgaXNCcm93c2VyLCBpc01peCB9ID0gYXBpLmdldEdsb2JhbE9iamVjdHMoKTtcbiAgICBpZiAoKCFpc0Jyb3dzZXIgJiYgIWlzTWl4KSB8fCAhX2dsb2JhbFsnY3VzdG9tRWxlbWVudHMnXSB8fCAhKCdjdXN0b21FbGVtZW50cycgaW4gX2dsb2JhbCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jdXN0b20tZWxlbWVudHMuaHRtbCNjb25jZXB0LWN1c3RvbS1lbGVtZW50LWRlZmluaXRpb24tbGlmZWN5Y2xlLWNhbGxiYWNrc1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IFtcbiAgICAgICAgJ2Nvbm5lY3RlZENhbGxiYWNrJyxcbiAgICAgICAgJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJyxcbiAgICAgICAgJ2Fkb3B0ZWRDYWxsYmFjaycsXG4gICAgICAgICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snLFxuICAgICAgICAnZm9ybUFzc29jaWF0ZWRDYWxsYmFjaycsXG4gICAgICAgICdmb3JtRGlzYWJsZWRDYWxsYmFjaycsXG4gICAgICAgICdmb3JtUmVzZXRDYWxsYmFjaycsXG4gICAgICAgICdmb3JtU3RhdGVSZXN0b3JlQ2FsbGJhY2snLFxuICAgIF07XG4gICAgYXBpLnBhdGNoQ2FsbGJhY2tzKGFwaSwgX2dsb2JhbC5jdXN0b21FbGVtZW50cywgJ2N1c3RvbUVsZW1lbnRzJywgJ2RlZmluZScsIGNhbGxiYWNrcyk7XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0UGF0Y2goX2dsb2JhbCwgYXBpKSB7XG4gICAgaWYgKFpvbmVbYXBpLnN5bWJvbCgncGF0Y2hFdmVudFRhcmdldCcpXSkge1xuICAgICAgICAvLyBFdmVudFRhcmdldCBpcyBhbHJlYWR5IHBhdGNoZWQuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyBldmVudE5hbWVzLCB6b25lU3ltYm9sRXZlbnROYW1lcywgVFJVRV9TVFIsIEZBTFNFX1NUUiwgWk9ORV9TWU1CT0xfUFJFRklYIH0gPSBhcGkuZ2V0R2xvYmFsT2JqZWN0cygpO1xuICAgIC8vICBwcmVkZWZpbmUgYWxsIF9fem9uZV9zeW1ib2xfXyArIGV2ZW50TmFtZSArIHRydWUvZmFsc2Ugc3RyaW5nXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbaV07XG4gICAgICAgIGNvbnN0IGZhbHNlRXZlbnROYW1lID0gZXZlbnROYW1lICsgRkFMU0VfU1RSO1xuICAgICAgICBjb25zdCB0cnVlRXZlbnROYW1lID0gZXZlbnROYW1lICsgVFJVRV9TVFI7XG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIGZhbHNlRXZlbnROYW1lO1xuICAgICAgICBjb25zdCBzeW1ib2xDYXB0dXJlID0gWk9ORV9TWU1CT0xfUFJFRklYICsgdHJ1ZUV2ZW50TmFtZTtcbiAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHt9O1xuICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW0ZBTFNFX1NUUl0gPSBzeW1ib2w7XG4gICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bVFJVRV9TVFJdID0gc3ltYm9sQ2FwdHVyZTtcbiAgICB9XG4gICAgY29uc3QgRVZFTlRfVEFSR0VUID0gX2dsb2JhbFsnRXZlbnRUYXJnZXQnXTtcbiAgICBpZiAoIUVWRU5UX1RBUkdFVCB8fCAhRVZFTlRfVEFSR0VULnByb3RvdHlwZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KF9nbG9iYWwsIGFwaSwgW0VWRU5UX1RBUkdFVCAmJiBFVkVOVF9UQVJHRVQucHJvdG90eXBlXSk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50KGdsb2JhbCwgYXBpKSB7XG4gICAgYXBpLnBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpO1xufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7Z2xvYmFsVGhpc31cbiAqL1xuZnVuY3Rpb24gZmlsdGVyUHJvcGVydGllcyh0YXJnZXQsIG9uUHJvcGVydGllcywgaWdub3JlUHJvcGVydGllcykge1xuICAgIGlmICghaWdub3JlUHJvcGVydGllcyB8fCBpZ25vcmVQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBjb25zdCB0aXAgPSBpZ25vcmVQcm9wZXJ0aWVzLmZpbHRlcigoaXApID0+IGlwLnRhcmdldCA9PT0gdGFyZ2V0KTtcbiAgICBpZiAoIXRpcCB8fCB0aXAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBvblByb3BlcnRpZXM7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldElnbm9yZVByb3BlcnRpZXMgPSB0aXBbMF0uaWdub3JlUHJvcGVydGllcztcbiAgICByZXR1cm4gb25Qcm9wZXJ0aWVzLmZpbHRlcigob3ApID0+IHRhcmdldElnbm9yZVByb3BlcnRpZXMuaW5kZXhPZihvcCkgPT09IC0xKTtcbn1cbmZ1bmN0aW9uIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKHRhcmdldCwgb25Qcm9wZXJ0aWVzLCBpZ25vcmVQcm9wZXJ0aWVzLCBwcm90b3R5cGUpIHtcbiAgICAvLyBjaGVjayB3aGV0aGVyIHRhcmdldCBpcyBhdmFpbGFibGUsIHNvbWV0aW1lcyB0YXJnZXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAvLyBiZWNhdXNlIGRpZmZlcmVudCBicm93c2VyIG9yIHNvbWUgM3JkIHBhcnR5IHBsdWdpbi5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydGllcyA9IGZpbHRlclByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIHBhdGNoT25Qcm9wZXJ0aWVzKHRhcmdldCwgZmlsdGVyZWRQcm9wZXJ0aWVzLCBwcm90b3R5cGUpO1xufVxuLyoqXG4gKiBHZXQgYWxsIGV2ZW50IG5hbWUgcHJvcGVydGllcyB3aGljaCB0aGUgZXZlbnQgbmFtZSBzdGFydHNXaXRoIGBvbmBcbiAqIGZyb20gdGhlIHRhcmdldCBvYmplY3QgaXRzZWxmLCBpbmhlcml0ZWQgcHJvcGVydGllcyBhcmUgbm90IGNvbnNpZGVyZWQuXG4gKi9cbmZ1bmN0aW9uIGdldE9uRXZlbnROYW1lcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgICAuZmlsdGVyKChuYW1lKSA9PiBuYW1lLnN0YXJ0c1dpdGgoJ29uJykgJiYgbmFtZS5sZW5ndGggPiAyKVxuICAgICAgICAubWFwKChuYW1lKSA9PiBuYW1lLnN1YnN0cmluZygyKSk7XG59XG5mdW5jdGlvbiBwcm9wZXJ0eURlc2NyaXB0b3JQYXRjaChhcGksIF9nbG9iYWwpIHtcbiAgICBpZiAoaXNOb2RlICYmICFpc01peCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChab25lW2FwaS5zeW1ib2woJ3BhdGNoRXZlbnRzJyldKSB7XG4gICAgICAgIC8vIGV2ZW50cyBhcmUgYWxyZWFkeSBiZWVuIHBhdGNoZWQgYnkgbGVnYWN5IHBhdGNoLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlnbm9yZVByb3BlcnRpZXMgPSBfZ2xvYmFsWydfX1pvbmVfaWdub3JlX29uX3Byb3BlcnRpZXMnXTtcbiAgICAvLyBmb3IgYnJvd3NlcnMgdGhhdCB3ZSBjYW4gcGF0Y2ggdGhlIGRlc2NyaXB0b3I6ICBDaHJvbWUgJiBGaXJlZm94XG4gICAgbGV0IHBhdGNoVGFyZ2V0cyA9IFtdO1xuICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxXaW5kb3cgPSB3aW5kb3c7XG4gICAgICAgIHBhdGNoVGFyZ2V0cyA9IHBhdGNoVGFyZ2V0cy5jb25jYXQoW1xuICAgICAgICAgICAgJ0RvY3VtZW50JyxcbiAgICAgICAgICAgICdTVkdFbGVtZW50JyxcbiAgICAgICAgICAgICdFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MRWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTEJvZHlFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MTWVkaWFFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MRnJhbWVTZXRFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MRnJhbWVFbGVtZW50JyxcbiAgICAgICAgICAgICdIVE1MSUZyYW1lRWxlbWVudCcsXG4gICAgICAgICAgICAnSFRNTE1hcnF1ZWVFbGVtZW50JyxcbiAgICAgICAgICAgICdXb3JrZXInLFxuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgaWdub3JlRXJyb3JQcm9wZXJ0aWVzID0gaXNJRSgpXG4gICAgICAgICAgICA/IFt7IHRhcmdldDogaW50ZXJuYWxXaW5kb3csIGlnbm9yZVByb3BlcnRpZXM6IFsnZXJyb3InXSB9XVxuICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgLy8gaW4gSUUvRWRnZSwgb25Qcm9wIG5vdCBleGlzdCBpbiB3aW5kb3cgb2JqZWN0LCBidXQgaW4gV2luZG93UHJvdG90eXBlXG4gICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gcGFzcyBXaW5kb3dQcm90b3R5cGUgdG8gY2hlY2sgb25Qcm9wIGV4aXN0IG9yIG5vdFxuICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhpbnRlcm5hbFdpbmRvdywgZ2V0T25FdmVudE5hbWVzKGludGVybmFsV2luZG93KSwgaWdub3JlUHJvcGVydGllcyA/IGlnbm9yZVByb3BlcnRpZXMuY29uY2F0KGlnbm9yZUVycm9yUHJvcGVydGllcykgOiBpZ25vcmVQcm9wZXJ0aWVzLCBPYmplY3RHZXRQcm90b3R5cGVPZihpbnRlcm5hbFdpbmRvdykpO1xuICAgIH1cbiAgICBwYXRjaFRhcmdldHMgPSBwYXRjaFRhcmdldHMuY29uY2F0KFtcbiAgICAgICAgJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgICAgICAgJ1hNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQnLFxuICAgICAgICAnSURCSW5kZXgnLFxuICAgICAgICAnSURCUmVxdWVzdCcsXG4gICAgICAgICdJREJPcGVuREJSZXF1ZXN0JyxcbiAgICAgICAgJ0lEQkRhdGFiYXNlJyxcbiAgICAgICAgJ0lEQlRyYW5zYWN0aW9uJyxcbiAgICAgICAgJ0lEQkN1cnNvcicsXG4gICAgICAgICdXZWJTb2NrZXQnLFxuICAgIF0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0Y2hUYXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF9nbG9iYWxbcGF0Y2hUYXJnZXRzW2ldXTtcbiAgICAgICAgdGFyZ2V0ICYmXG4gICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlICYmXG4gICAgICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyh0YXJnZXQucHJvdG90eXBlLCBnZXRPbkV2ZW50TmFtZXModGFyZ2V0LnByb3RvdHlwZSksIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge21pc3NpbmdSZXF1aXJlfVxuICovXG5mdW5jdGlvbiBwYXRjaEJyb3dzZXIoWm9uZSkge1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdsZWdhY3knLCAoZ2xvYmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IGxlZ2FjeVBhdGNoID0gZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnbGVnYWN5UGF0Y2gnKV07XG4gICAgICAgIGlmIChsZWdhY3lQYXRjaCkge1xuICAgICAgICAgICAgbGVnYWN5UGF0Y2goKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCd0aW1lcnMnLCAoZ2xvYmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IHNldCA9ICdzZXQnO1xuICAgICAgICBjb25zdCBjbGVhciA9ICdjbGVhcic7XG4gICAgICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnVGltZW91dCcpO1xuICAgICAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ0ludGVydmFsJyk7XG4gICAgICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnSW1tZWRpYXRlJyk7XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ3JlcXVlc3RBbmltYXRpb25GcmFtZScsIChnbG9iYWwpID0+IHtcbiAgICAgICAgcGF0Y2hUaW1lcihnbG9iYWwsICdyZXF1ZXN0JywgJ2NhbmNlbCcsICdBbmltYXRpb25GcmFtZScpO1xuICAgICAgICBwYXRjaFRpbWVyKGdsb2JhbCwgJ21velJlcXVlc3QnLCAnbW96Q2FuY2VsJywgJ0FuaW1hdGlvbkZyYW1lJyk7XG4gICAgICAgIHBhdGNoVGltZXIoZ2xvYmFsLCAnd2Via2l0UmVxdWVzdCcsICd3ZWJraXRDYW5jZWwnLCAnQW5pbWF0aW9uRnJhbWUnKTtcbiAgICB9KTtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnYmxvY2tpbmcnLCAoZ2xvYmFsLCBab25lKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsb2NraW5nTWV0aG9kcyA9IFsnYWxlcnQnLCAncHJvbXB0JywgJ2NvbmZpcm0nXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja2luZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBibG9ja2luZ01ldGhvZHNbaV07XG4gICAgICAgICAgICBwYXRjaE1ldGhvZChnbG9iYWwsIG5hbWUsIChkZWxlZ2F0ZSwgc3ltYm9sLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBab25lLmN1cnJlbnQucnVuKGRlbGVnYXRlLCBnbG9iYWwsIGFyZ3MsIG5hbWUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdFdmVudFRhcmdldCcsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBwYXRjaEV2ZW50KGdsb2JhbCwgYXBpKTtcbiAgICAgICAgZXZlbnRUYXJnZXRQYXRjaChnbG9iYWwsIGFwaSk7XG4gICAgICAgIC8vIHBhdGNoIFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQncyBhZGRFdmVudExpc3RlbmVyL3JlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgICAgY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IGdsb2JhbFsnWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCddO1xuICAgICAgICBpZiAoWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCAmJiBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgYXBpLnBhdGNoRXZlbnRUYXJnZXQoZ2xvYmFsLCBhcGksIFtYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZV0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ011dGF0aW9uT2JzZXJ2ZXInLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgcGF0Y2hDbGFzcygnTXV0YXRpb25PYnNlcnZlcicpO1xuICAgICAgICBwYXRjaENsYXNzKCdXZWJLaXRNdXRhdGlvbk9ic2VydmVyJyk7XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ0ludGVyc2VjdGlvbk9ic2VydmVyJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgICAgIHBhdGNoQ2xhc3MoJ0ludGVyc2VjdGlvbk9ic2VydmVyJyk7XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ0ZpbGVSZWFkZXInLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICAgICAgcGF0Y2hDbGFzcygnRmlsZVJlYWRlcicpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdvbl9wcm9wZXJ0eScsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBwcm9wZXJ0eURlc2NyaXB0b3JQYXRjaChhcGksIGdsb2JhbCk7XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ2N1c3RvbUVsZW1lbnRzJywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgICAgIHBhdGNoQ3VzdG9tRWxlbWVudHMoZ2xvYmFsLCBhcGkpO1xuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdYSFInLCAoZ2xvYmFsLCBab25lKSA9PiB7XG4gICAgICAgIC8vIFRyZWF0IFhNTEh0dHBSZXF1ZXN0IGFzIGEgbWFjcm90YXNrLlxuICAgICAgICBwYXRjaFhIUihnbG9iYWwpO1xuICAgICAgICBjb25zdCBYSFJfVEFTSyA9IHpvbmVTeW1ib2woJ3hoclRhc2snKTtcbiAgICAgICAgY29uc3QgWEhSX1NZTkMgPSB6b25lU3ltYm9sKCd4aHJTeW5jJyk7XG4gICAgICAgIGNvbnN0IFhIUl9MSVNURU5FUiA9IHpvbmVTeW1ib2woJ3hockxpc3RlbmVyJyk7XG4gICAgICAgIGNvbnN0IFhIUl9TQ0hFRFVMRUQgPSB6b25lU3ltYm9sKCd4aHJTY2hlZHVsZWQnKTtcbiAgICAgICAgY29uc3QgWEhSX1VSTCA9IHpvbmVTeW1ib2woJ3hoclVSTCcpO1xuICAgICAgICBjb25zdCBYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRCA9IHpvbmVTeW1ib2woJ3hockVycm9yQmVmb3JlU2NoZWR1bGVkJyk7XG4gICAgICAgIGZ1bmN0aW9uIHBhdGNoWEhSKHdpbmRvdykge1xuICAgICAgICAgICAgY29uc3QgWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3dbJ1hNTEh0dHBSZXF1ZXN0J107XG4gICAgICAgICAgICBpZiAoIVhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgLy8gWE1MSHR0cFJlcXVlc3QgaXMgbm90IGF2YWlsYWJsZSBpbiBzZXJ2aWNlIHdvcmtlclxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZFBlbmRpbmdUYXNrKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbWEhSX1RBU0tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG9yaUFkZExpc3RlbmVyID0gWE1MSHR0cFJlcXVlc3RQcm90b3R5cGVbWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgIGxldCBvcmlSZW1vdmVMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW1pPTkVfU1lNQk9MX1JFTU9WRV9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICBpZiAoIW9yaUFkZExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IHdpbmRvd1snWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCddO1xuICAgICAgICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXRQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgb3JpQWRkTGlzdGVuZXIgPSBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0UHJvdG90eXBlW1pPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICAgICAgICAgIG9yaVJlbW92ZUxpc3RlbmVyID0gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFByb3RvdHlwZVtaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFJFQURZX1NUQVRFX0NIQU5HRSA9ICdyZWFkeXN0YXRlY2hhbmdlJztcbiAgICAgICAgICAgIGNvbnN0IFNDSEVEVUxFRCA9ICdzY2hlZHVsZWQnO1xuICAgICAgICAgICAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGRhdGEudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfU0NIRURVTEVEXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldFtYSFJfTElTVEVORVJdO1xuICAgICAgICAgICAgICAgIGlmICghb3JpQWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpQWRkTGlzdGVuZXIgPSB0YXJnZXRbWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICAgICAgb3JpUmVtb3ZlTGlzdGVuZXIgPSB0YXJnZXRbWk9ORV9TWU1CT0xfUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaVJlbW92ZUxpc3RlbmVyLmNhbGwodGFyZ2V0LCBSRUFEWV9TVEFURV9DSEFOR0UsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGlzdGVuZXIgPSAodGFyZ2V0W1hIUl9MSVNURU5FUl0gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQucmVhZHlTdGF0ZSA9PT0gdGFyZ2V0LkRPTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aW1lcyBvbiBzb21lIGJyb3dzZXJzIFhNTEh0dHBSZXF1ZXN0IHdpbGwgZmlyZSBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2l0aFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZHlTdGF0ZT00IG11bHRpcGxlIHRpbWVzLCBzbyB3ZSBuZWVkIHRvIGNoZWNrIHRhc2sgc3RhdGUgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLmFib3J0ZWQgJiYgdGFyZ2V0W1hIUl9TQ0hFRFVMRURdICYmIHRhc2suc3RhdGUgPT09IFNDSEVEVUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhlIHhociBoYXMgcmVnaXN0ZXJlZCBvbmxvYWQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGF0IGlzIHRoZSBjYXNlLCB0aGUgdGFzayBzaG91bGQgaW52b2tlIGFmdGVyIGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubG9hZCBsaXN0ZW5lcnMgZmluaXNoLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsc28gaWYgdGhlIHJlcXVlc3QgZmFpbGVkIHdpdGhvdXQgcmVzcG9uc2UgKHN0YXR1cyA9IDApLCB0aGUgbG9hZCBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBub3QgYmUgdHJpZ2dlcmVkLCBpbiB0aGF0IGNhc2UsIHdlIHNob3VsZCBhbHNvIGludm9rZSB0aGUgcGxhY2Vob2xkZXIgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBjbG9zZSB0aGUgWE1MSHR0cFJlcXVlc3Q6OnNlbmQgbWFjcm9UYXNrLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM4Nzk1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZFRhc2tzID0gdGFyZ2V0W1pvbmUuX19zeW1ib2xfXygnbG9hZGZhbHNlJyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc3RhdHVzICE9PSAwICYmIGxvYWRUYXNrcyAmJiBsb2FkVGFza3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlJbnZva2UgPSB0YXNrLmludm9rZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGxvYWQgdGhlIHRhc2tzIGFnYWluLCBiZWNhdXNlIGluIG90aGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGxpc3RlbmVyLCB0aGV5IG1heSByZW1vdmUgdGhlbXNlbHZlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZFRhc2tzID0gdGFyZ2V0W1pvbmUuX19zeW1ib2xfXygnbG9hZGZhbHNlJyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2FkVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9hZFRhc2tzW2ldID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLmFib3J0ZWQgJiYgdGFzay5zdGF0ZSA9PT0gU0NIRURVTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpSW52b2tlLmNhbGwodGFzayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUYXNrcy5wdXNoKHRhc2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghZGF0YS5hYm9ydGVkICYmIHRhcmdldFtYSFJfU0NIRURVTEVEXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBvY2N1cnMgd2hlbiB4aHIuc2VuZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W1hIUl9FUlJPUl9CRUZPUkVfU0NIRURVTEVEXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvcmlBZGRMaXN0ZW5lci5jYWxsKHRhcmdldCwgUkVBRFlfU1RBVEVfQ0hBTkdFLCBuZXdMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RvcmVkVGFzayA9IHRhcmdldFtYSFJfVEFTS107XG4gICAgICAgICAgICAgICAgaWYgKCFzdG9yZWRUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfVEFTS10gPSB0YXNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZW5kTmF0aXZlLmFwcGx5KHRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gcGxhY2Vob2xkZXJDYWxsYmFjaygpIHsgfVxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJUYXNrKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICAgICAgICAgIC8vIE5vdGUgLSBpZGVhbGx5LCB3ZSB3b3VsZCBjYWxsIGRhdGEudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIgaGVyZSwgYnV0IGl0J3MgdG9vIGxhdGVcbiAgICAgICAgICAgICAgICAvLyB0byBwcmV2ZW50IGl0IGZyb20gZmlyaW5nLiBTbyBpbnN0ZWFkLCB3ZSBzdG9yZSBpbmZvIGZvciB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gICAgICAgICAgICAgICAgZGF0YS5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWJvcnROYXRpdmUuYXBwbHkoZGF0YS50YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvcGVuTmF0aXZlID0gcGF0Y2hNZXRob2QoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsICdvcGVuJywgKCkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzZWxmW1hIUl9TWU5DXSA9IGFyZ3NbMl0gPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZltYSFJfVVJMXSA9IGFyZ3NbMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZW5OYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IFhNTEhUVFBSRVFVRVNUX1NPVVJDRSA9ICdYTUxIdHRwUmVxdWVzdC5zZW5kJztcbiAgICAgICAgICAgIGNvbnN0IGZldGNoVGFza0Fib3J0aW5nID0gem9uZVN5bWJvbCgnZmV0Y2hUYXNrQWJvcnRpbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoVGFza1NjaGVkdWxpbmcgPSB6b25lU3ltYm9sKCdmZXRjaFRhc2tTY2hlZHVsaW5nJyk7XG4gICAgICAgICAgICBjb25zdCBzZW5kTmF0aXZlID0gcGF0Y2hNZXRob2QoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsICdzZW5kJywgKCkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoWm9uZS5jdXJyZW50W2ZldGNoVGFza1NjaGVkdWxpbmddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGEgZmV0Y2ggaXMgc2NoZWR1bGluZywgc28gd2UgYXJlIHVzaW5nIHhociB0byBwb2x5ZmlsbCBmZXRjaFxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgYmVjYXVzZSB3ZSBhbHJlYWR5IHNjaGVkdWxlIG1hY3JvVGFzayBmb3IgZmV0Y2gsIHdlIHNob3VsZFxuICAgICAgICAgICAgICAgICAgICAvLyBub3Qgc2NoZWR1bGUgYSBtYWNyb1Rhc2sgZm9yIHhociBhZ2FpblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGZbWEhSX1NZTkNdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBYSFIgaXMgc3luYyB0aGVyZSBpcyBubyB0YXNrIHRvIHNjaGVkdWxlLCBqdXN0IGV4ZWN1dGUgdGhlIGNvZGUuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZW5kTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogc2VsZltYSFJfVVJMXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUGVyaW9kaWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoWE1MSFRUUFJFUVVFU1RfU09VUkNFLCBwbGFjZWhvbGRlckNhbGxiYWNrLCBvcHRpb25zLCBzY2hlZHVsZVRhc2ssIGNsZWFyVGFzayk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmW1hIUl9FUlJPUl9CRUZPUkVfU0NIRURVTEVEXSA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIW9wdGlvbnMuYWJvcnRlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5zdGF0ZSA9PT0gU0NIRURVTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB4aHIgcmVxdWVzdCB0aHJvdyBlcnJvciB3aGVuIHNlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCBpbnZva2UgdGFzayBpbnN0ZWFkIG9mIGxlYXZpbmcgYSBzY2hlZHVsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlbmRpbmcgbWFjcm9UYXNrXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBhYm9ydE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnYWJvcnQnLCAoKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBmaW5kUGVuZGluZ1Rhc2soc2VsZik7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2sgJiYgdHlwZW9mIHRhc2sudHlwZSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgWEhSIGhhcyBhbHJlYWR5IGNvbXBsZXRlZCwgZG8gbm90aGluZy5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIFhIUiBoYXMgYWxyZWFkeSBiZWVuIGFib3J0ZWQsIGRvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpeCAjNTY5LCBjYWxsIGFib3J0IG11bHRpcGxlIHRpbWVzIGJlZm9yZSBkb25lIHdpbGwgY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFjcm9UYXNrIHRhc2sgY291bnQgYmUgbmVnYXRpdmUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLmNhbmNlbEZuID09IG51bGwgfHwgKHRhc2suZGF0YSAmJiB0YXNrLmRhdGEuYWJvcnRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoWm9uZS5jdXJyZW50W2ZldGNoVGFza0Fib3J0aW5nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWJvcnQgaXMgY2FsbGVkIGZyb20gZmV0Y2ggcG9seWZpbGwsIHdlIG5lZWQgdG8gY2FsbCBuYXRpdmUgYWJvcnQgb2YgWEhSLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWJvcnROYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIHRyeWluZyB0byBhYm9ydCBhbiBYSFIgd2hpY2ggaGFzIG5vdCB5ZXQgYmVlbiBzZW50LCBzbyB0aGVyZSBpcyBub1xuICAgICAgICAgICAgICAgIC8vIHRhc2tcbiAgICAgICAgICAgICAgICAvLyB0byBjYW5jZWwuIERvIG5vdGhpbmcuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdnZW9sb2NhdGlvbicsIChnbG9iYWwpID0+IHtcbiAgICAgICAgLy8vIEdFT19MT0NBVElPTlxuICAgICAgICBpZiAoZ2xvYmFsWyduYXZpZ2F0b3InXSAmJiBnbG9iYWxbJ25hdmlnYXRvciddLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICBwYXRjaFByb3RvdHlwZShnbG9iYWxbJ25hdmlnYXRvciddLmdlb2xvY2F0aW9uLCBbJ2dldEN1cnJlbnRQb3NpdGlvbicsICd3YXRjaFBvc2l0aW9uJ10pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgWm9uZS5fX2xvYWRfcGF0Y2goJ1Byb21pc2VSZWplY3Rpb25FdmVudCcsIChnbG9iYWwsIFpvbmUpID0+IHtcbiAgICAgICAgLy8gaGFuZGxlIHVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvblxuICAgICAgICBmdW5jdGlvbiBmaW5kUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoZXZ0TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnRUYXNrcyA9IGZpbmRFdmVudFRhc2tzKGdsb2JhbCwgZXZ0TmFtZSk7XG4gICAgICAgICAgICAgICAgZXZlbnRUYXNrcy5mb3JFYWNoKChldmVudFRhc2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2luZG93cyBoYXMgYWRkZWQgdW5oYW5kbGVkcmVqZWN0aW9uIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFByb21pc2VSZWplY3Rpb25FdmVudCA9IGdsb2JhbFsnUHJvbWlzZVJlamVjdGlvbkV2ZW50J107XG4gICAgICAgICAgICAgICAgICAgIGlmIChQcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2dCA9IG5ldyBQcm9taXNlUmVqZWN0aW9uRXZlbnQoZXZ0TmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2U6IGUucHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IGUucmVqZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRhc2suaW52b2tlKGV2dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdsb2JhbFsnUHJvbWlzZVJlamVjdGlvbkV2ZW50J10pIHtcbiAgICAgICAgICAgIFpvbmVbem9uZVN5bWJvbCgndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKV0gPVxuICAgICAgICAgICAgICAgIGZpbmRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcigndW5oYW5kbGVkcmVqZWN0aW9uJyk7XG4gICAgICAgICAgICBab25lW3pvbmVTeW1ib2woJ3JlamVjdGlvbkhhbmRsZWRIYW5kbGVyJyldID1cbiAgICAgICAgICAgICAgICBmaW5kUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3JlamVjdGlvbmhhbmRsZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFpvbmUuX19sb2FkX3BhdGNoKCdxdWV1ZU1pY3JvdGFzaycsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBwYXRjaFF1ZXVlTWljcm90YXNrKGdsb2JhbCwgYXBpKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGF0Y2hQcm9taXNlKFpvbmUpIHtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgnWm9uZUF3YXJlUHJvbWlzZScsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICBjb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgICAgICBjb25zdCBPYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgICAgICAgZnVuY3Rpb24gcmVhZGFibGVPYmplY3RUb1N0cmluZyhvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAgICAgICAgIHJldHVybiAoY2xhc3NOYW1lID8gY2xhc3NOYW1lIDogJycpICsgJzogJyArIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqID8gb2JqLnRvU3RyaW5nKCkgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBfX3N5bWJvbF9fID0gYXBpLnN5bWJvbDtcbiAgICAgICAgY29uc3QgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycyA9IFtdO1xuICAgICAgICBjb25zdCBpc0Rpc2FibGVXcmFwcGluZ1VuY2F1Z2h0UHJvbWlzZVJlamVjdGlvbiA9IGdsb2JhbFtfX3N5bWJvbF9fKCdESVNBQkxFX1dSQVBQSU5HX1VOQ0FVR0hUX1BST01JU0VfUkVKRUNUSU9OJyldICE9PSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgICAgICAgY29uc3Qgc3ltYm9sVGhlbiA9IF9fc3ltYm9sX18oJ3RoZW4nKTtcbiAgICAgICAgY29uc3QgY3JlYXRpb25UcmFjZSA9ICdfX2NyZWF0aW9uVHJhY2VfXyc7XG4gICAgICAgIGFwaS5vblVuaGFuZGxlZEVycm9yID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChhcGkuc2hvd1VuY2F1Z2h0RXJyb3IoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlamVjdGlvbiA9IGUgJiYgZS5yZWplY3Rpb247XG4gICAgICAgICAgICAgICAgaWYgKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgUHJvbWlzZSByZWplY3Rpb246JywgcmVqZWN0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyByZWplY3Rpb24ubWVzc2FnZSA6IHJlamVjdGlvbiwgJzsgWm9uZTonLCBlLnpvbmUubmFtZSwgJzsgVGFzazonLCBlLnRhc2sgJiYgZS50YXNrLnNvdXJjZSwgJzsgVmFsdWU6JywgcmVqZWN0aW9uLCByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5zdGFjayA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXBpLm1pY3JvdGFza0RyYWluRG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHdoaWxlIChfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuY2F1Z2h0UHJvbWlzZUVycm9yID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnpvbmUucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5jYXVnaHRQcm9taXNlRXJyb3IudGhyb3dPcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHVuY2F1Z2h0UHJvbWlzZUVycm9yLnJlamVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHVuY2F1Z2h0UHJvbWlzZUVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBVTkhBTkRMRURfUFJPTUlTRV9SRUpFQ1RJT05fSEFORExFUl9TWU1CT0wgPSBfX3N5bWJvbF9fKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpO1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZSkge1xuICAgICAgICAgICAgYXBpLm9uVW5oYW5kbGVkRXJyb3IoZSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBab25lW1VOSEFORExFRF9QUk9NSVNFX1JFSkVDVElPTl9IQU5ETEVSX1NZTUJPTF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1RoZW5hYmxlKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3J3YXJkUmVzb2x1dGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZvcndhcmRSZWplY3Rpb24ocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzeW1ib2xTdGF0ZSA9IF9fc3ltYm9sX18oJ3N0YXRlJyk7XG4gICAgICAgIGNvbnN0IHN5bWJvbFZhbHVlID0gX19zeW1ib2xfXygndmFsdWUnKTtcbiAgICAgICAgY29uc3Qgc3ltYm9sRmluYWxseSA9IF9fc3ltYm9sX18oJ2ZpbmFsbHknKTtcbiAgICAgICAgY29uc3Qgc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlID0gX19zeW1ib2xfXygncGFyZW50UHJvbWlzZVZhbHVlJyk7XG4gICAgICAgIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VTdGF0ZSA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VTdGF0ZScpO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSAnUHJvbWlzZS50aGVuJztcbiAgICAgICAgY29uc3QgVU5SRVNPTFZFRCA9IG51bGw7XG4gICAgICAgIGNvbnN0IFJFU09MVkVEID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgUkVKRUNURUQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgUkVKRUNURURfTk9fQ0FUQ0ggPSAwO1xuICAgICAgICBmdW5jdGlvbiBtYWtlUmVzb2x2ZXIocHJvbWlzZSwgc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAodikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHN0YXRlLCB2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRG8gbm90IHJldHVybiB2YWx1ZSBvciB5b3Ugd2lsbCBicmVhayB0aGUgUHJvbWlzZSBzcGVjLlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHdhc0NhbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXIod3JhcHBlZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdhc0NhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdhc0NhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZWRGdW5jdGlvbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBUWVBFX0VSUk9SID0gJ1Byb21pc2UgcmVzb2x2ZWQgd2l0aCBpdHNlbGYnO1xuICAgICAgICBjb25zdCBDVVJSRU5UX1RBU0tfVFJBQ0VfU1lNQk9MID0gX19zeW1ib2xfXygnY3VycmVudFRhc2tUcmFjZScpO1xuICAgICAgICAvLyBQcm9taXNlIFJlc29sdXRpb25cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgc3RhdGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICAgICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoVFlQRV9FUlJPUik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xTdGF0ZV0gPT09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgb25seSBnZXQgdmFsdWUudGhlbiBvbmNlIGJhc2VkIG9uIHByb21pc2Ugc3BlYy5cbiAgICAgICAgICAgICAgICBsZXQgdGhlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVuID0gdmFsdWUgJiYgdmFsdWUudGhlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uY2VXcmFwcGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgKHZhbHVlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlICYmXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmhhc093blByb3BlcnR5KHN5bWJvbFN0YXRlKSAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShzeW1ib2xWYWx1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVbc3ltYm9sU3RhdGVdICE9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgdmFsdWVbc3ltYm9sU3RhdGVdLCB2YWx1ZVtzeW1ib2xWYWx1ZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgb25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIHN0YXRlKSksIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBmYWxzZSkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNlV3JhcHBlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFN0YXRlXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZSA9IHByb21pc2Vbc3ltYm9sVmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFZhbHVlXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xGaW5hbGx5XSA9PT0gc3ltYm9sRmluYWxseSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHByb21pc2UgaXMgZ2VuZXJhdGVkIGJ5IFByb21pc2UucHJvdG90eXBlLmZpbmFsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3RhdGUgaXMgcmVzb2x2ZWQsIHNob3VsZCBpZ25vcmUgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHVzZSBwYXJlbnQgcHJvbWlzZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sU3RhdGVdID0gcHJvbWlzZVtzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sVmFsdWVdID0gcHJvbWlzZVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY29yZCB0YXNrIGluZm9ybWF0aW9uIGluIHZhbHVlIHdoZW4gZXJyb3Igb2NjdXJzLCBzbyB3ZSBjYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZSBhZGRpdGlvbmFsIHdvcmsgc3VjaCBhcyByZW5kZXIgbG9uZ1N0YWNrVHJhY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCAmJiB2YWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBsb25nU3RhY2tUcmFjZVpvbmUgaXMgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhY2UgPSBab25lLmN1cnJlbnRUYXNrICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWm9uZS5jdXJyZW50VGFzay5kYXRhICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWm9uZS5jdXJyZW50VGFzay5kYXRhW2NyZWF0aW9uVHJhY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25seSBrZWVwIHRoZSBsb25nIHN0YWNrIHRyYWNlIGludG8gZXJyb3Igd2hlbiBpbiBsb25nU3RhY2tUcmFjZVpvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRyYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QocHJvbWlzZSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA9PSAwICYmIHN0YXRlID09IFJFSkVDVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFN0YXRlXSA9IFJFSkVDVEVEX05PX0NBVENIO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVuY2F1Z2h0UHJvbWlzZUVycm9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhlcmUgd2UgdGhyb3dzIGEgbmV3IEVycm9yIHRvIHByaW50IG1vcmUgcmVhZGFibGUgZXJyb3IgbG9nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGlmIHRoZSB2YWx1ZSBpcyBub3QgYW4gZXJyb3IsIHpvbmUuanMgYnVpbGRzIGFuIGBFcnJvcmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPYmplY3QgaGVyZSB0byBhdHRhY2ggdGhlIHN0YWNrIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jYXVnaHQgKGluIHByb21pc2UpOiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVPYmplY3RUb1N0cmluZyh2YWx1ZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWUgJiYgdmFsdWUuc3RhY2sgPyAnXFxuJyArIHZhbHVlLnN0YWNrIDogJycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvciA9IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Rpc2FibGVXcmFwcGluZ1VuY2F1Z2h0UHJvbWlzZVJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGRpc2FibGUgd3JhcHBpbmcgdW5jYXVnaHQgcHJvbWlzZSByZWplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHZhbHVlIGluc3RlYWQgb2Ygd3JhcHBpbmcgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IudGhyb3dPcmlnaW5hbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci5yZWplY3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3Iuem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnRhc2sgPSBab25lLmN1cnJlbnRUYXNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5wdXNoKHVuY2F1Z2h0UHJvbWlzZUVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zY2hlZHVsZU1pY3JvVGFzaygpOyAvLyB0byBtYWtlIHN1cmUgdGhhdCBpdCBpcyBydW5uaW5nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZXNvbHZpbmcgYW4gYWxyZWFkeSByZXNvbHZlZCBwcm9taXNlIGlzIGEgbm9vcC5cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFJFSkVDVElPTl9IQU5ETEVEX0hBTkRMRVIgPSBfX3N5bWJvbF9fKCdyZWplY3Rpb25IYW5kbGVkSGFuZGxlcicpO1xuICAgICAgICBmdW5jdGlvbiBjbGVhclJlamVjdGVkTm9DYXRjaChwcm9taXNlKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xTdGF0ZV0gPT09IFJFSkVDVEVEX05PX0NBVENIKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgbm8gY2F0Y2ggc3RhdHVzXG4gICAgICAgICAgICAgICAgLy8gYW5kIHF1ZXVlLmxlbmd0aCA+IDAsIG1lYW5zIHRoZXJlIGlzIGEgZXJyb3IgaGFuZGxlclxuICAgICAgICAgICAgICAgIC8vIGhlcmUgdG8gaGFuZGxlIHRoZSByZWplY3RlZCBwcm9taXNlLCB3ZSBzaG91bGQgdHJpZ2dlclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvd3MucmVqZWN0aW9uaGFuZGxlZCBldmVudEhhbmRsZXIgb3Igbm9kZWpzIHJlamVjdGlvbkhhbmRsZWRcbiAgICAgICAgICAgICAgICAvLyBldmVudEhhbmRsZXJcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gWm9uZVtSRUpFQ1RJT05fSEFORExFRF9IQU5ETEVSXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgdHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCB7IHJlamVjdGlvbjogcHJvbWlzZVtzeW1ib2xWYWx1ZV0sIHByb21pc2U6IHByb21pc2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikgeyB9XG4gICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UgPT09IF91bmNhdWdodFByb21pc2VFcnJvcnNbaV0ucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QocHJvbWlzZSwgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgICAgICAgY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZSk7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlU3RhdGUgPSBwcm9taXNlW3N5bWJvbFN0YXRlXTtcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gcHJvbWlzZVN0YXRlXG4gICAgICAgICAgICAgICAgPyB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgICAgPyBvbkZ1bGZpbGxlZFxuICAgICAgICAgICAgICAgICAgICA6IGZvcndhcmRSZXNvbHV0aW9uXG4gICAgICAgICAgICAgICAgOiB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICA/IG9uUmVqZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgOiBmb3J3YXJkUmVqZWN0aW9uO1xuICAgICAgICAgICAgem9uZS5zY2hlZHVsZU1pY3JvVGFzayhzb3VyY2UsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRQcm9taXNlVmFsdWUgPSBwcm9taXNlW3N5bWJvbFZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNGaW5hbGx5UHJvbWlzZSA9ICEhY2hhaW5Qcm9taXNlICYmIHN5bWJvbEZpbmFsbHkgPT09IGNoYWluUHJvbWlzZVtzeW1ib2xGaW5hbGx5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmluYWxseVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcm9taXNlIGlzIGdlbmVyYXRlZCBmcm9tIGZpbmFsbHkgY2FsbCwga2VlcCBwYXJlbnQgcHJvbWlzZSdzIHN0YXRlIGFuZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5Qcm9taXNlW3N5bWJvbFBhcmVudFByb21pc2VWYWx1ZV0gPSBwYXJlbnRQcm9taXNlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpblByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXSA9IHByb21pc2VTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgbm90IHBhc3MgdmFsdWUgdG8gZmluYWxseSBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHpvbmUucnVuKGRlbGVnYXRlLCB1bmRlZmluZWQsIGlzRmluYWxseVByb21pc2UgJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZWplY3Rpb24gJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZXNvbHV0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtwYXJlbnRQcm9taXNlVmFsdWVdKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCB0cnVlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBlcnJvciBvY2N1cnMsIHNob3VsZCBhbHdheXMgcmV0dXJuIHRoaXMgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCBmYWxzZSwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNoYWluUHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgWk9ORV9BV0FSRV9QUk9NSVNFX1RPX1NUUklORyA9ICdmdW5jdGlvbiBab25lQXdhcmVQcm9taXNlKCkgeyBbbmF0aXZlIGNvZGVdIH0nO1xuICAgICAgICBjb25zdCBub29wID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgICAgICBjb25zdCBBZ2dyZWdhdGVFcnJvciA9IGdsb2JhbC5BZ2dyZWdhdGVFcnJvcjtcbiAgICAgICAgY2xhc3MgWm9uZUF3YXJlUHJvbWlzZSB7XG4gICAgICAgICAgICBzdGF0aWMgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2UobmV3IHRoaXMobnVsbCksIFJFU09MVkVELCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgcmVqZWN0KGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQcm9taXNlKG5ldyB0aGlzKG51bGwpLCBSRUpFQ1RFRCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGljIHdpdGhSZXNvbHZlcnMoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgcmVzdWx0LnByb21pc2UgPSBuZXcgWm9uZUF3YXJlUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZWplY3QgPSByZWo7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyBhbnkodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMgfHwgdHlwZW9mIHZhbHVlc1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoW10sICdBbGwgcHJvbWlzZXMgd2VyZSByZWplY3RlZCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHYgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChab25lQXdhcmVQcm9taXNlLnJlc29sdmUodikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcihbXSwgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcihbXSwgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb21pc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlc1tpXS50aGVuKCh2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoZXJyb3JzLCAnQWxsIHByb21pc2VzIHdlcmUgcmVqZWN0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyByYWNlKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGxldCByZXNvbHZlO1xuICAgICAgICAgICAgICAgIGxldCByZWplY3Q7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpcygocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25SZWplY3QoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyBhbGwodmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2UuYWxsV2l0aENhbGxiYWNrKHZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgYWxsU2V0dGxlZCh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBQID0gdGhpcyAmJiB0aGlzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UgPyB0aGlzIDogWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUC5hbGxXaXRoQ2FsbGJhY2sodmFsdWVzLCB7XG4gICAgICAgICAgICAgICAgICAgIHRoZW5DYWxsYmFjazogKHZhbHVlKSA9PiAoeyBzdGF0dXM6ICdmdWxmaWxsZWQnLCB2YWx1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjazogKGVycikgPT4gKHsgc3RhdHVzOiAncmVqZWN0ZWQnLCByZWFzb246IGVyciB9KSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyBhbGxXaXRoQ2FsbGJhY2sodmFsdWVzLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGxldCByZXNvbHZlO1xuICAgICAgICAgICAgICAgIGxldCByZWplY3Q7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpcygocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IGF0IDIgdG8gcHJldmVudCBwcmVtYXR1cmVseSByZXNvbHZpbmcgaWYgLnRoZW4gaXMgY2FsbGVkIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgICAgIGxldCB1bnJlc29sdmVkQ291bnQgPSAyO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyVmFsdWVJbmRleCA9IHZhbHVlSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gY2FsbGJhY2sgPyBjYWxsYmFjay50aGVuQ2FsbGJhY2sodmFsdWUpIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gY2FsbGJhY2suZXJyb3JDYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnJlc29sdmVkQ291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAodGhlbkVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoZW5FcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIE1ha2UgdGhlIHVucmVzb2x2ZWRDb3VudCB6ZXJvLWJhc2VkIGFnYWluLlxuICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudCAtPSAyO1xuICAgICAgICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3RydWN0b3IoZXhlY3V0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoIShwcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IGJlIGFuIGluc3RhbmNlb2YgUHJvbWlzZS4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBVTlJFU09MVkVEO1xuICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sVmFsdWVdID0gW107IC8vIHF1ZXVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uY2VXcmFwcGVyID0gb25jZSgpO1xuICAgICAgICAgICAgICAgICAgICBleGVjdXRvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY3V0b3Iob25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIFJFU09MVkVEKSksIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRUpFQ1RFRCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnUHJvbWlzZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZXQgW1N5bWJvbC5zcGVjaWVzXSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBtdXN0IHJlYWQgYFN5bWJvbC5zcGVjaWVzYCBzYWZlbHkgYmVjYXVzZSBgdGhpc2AgbWF5IGJlIGFueXRoaW5nLiBGb3IgaW5zdGFuY2UsIGB0aGlzYFxuICAgICAgICAgICAgICAgIC8vIG1heSBiZSBhbiBvYmplY3Qgd2l0aG91dCBhIHByb3RvdHlwZSAoY3JlYXRlZCB0aHJvdWdoIGBPYmplY3QuY3JlYXRlKG51bGwpYCk7IHRodXNcbiAgICAgICAgICAgICAgICAvLyBgdGhpcy5jb25zdHJ1Y3RvcmAgd2lsbCBiZSB1bmRlZmluZWQuIE9uZSBvZiB0aGUgdXNlIGNhc2VzIGlzIFN5c3RlbUpTIGNyZWF0aW5nXG4gICAgICAgICAgICAgICAgLy8gcHJvdG90eXBlLWxlc3Mgb2JqZWN0cyAobW9kdWxlcykgdmlhIGBPYmplY3QuY3JlYXRlKG51bGwpYC4gVGhlIFN5c3RlbUpTIGNyZWF0ZXMgYW4gZW1wdHlcbiAgICAgICAgICAgICAgICAvLyBvYmplY3QgYW5kIGNvcGllcyBwcm9taXNlIHByb3BlcnRpZXMgaW50byB0aGF0IG9iamVjdCAod2l0aGluIHRoZSBgZ2V0T3JDcmVhdGVMb2FkYFxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uKS4gVGhlIHpvbmUuanMgdGhlbiBjaGVja3MgaWYgdGhlIHJlc29sdmVkIHZhbHVlIGhhcyB0aGUgYHRoZW5gIG1ldGhvZCBhbmRcbiAgICAgICAgICAgICAgICAvLyBpbnZva2VzIGl0IHdpdGggdGhlIGB2YWx1ZWAgY29udGV4dC4gT3RoZXJ3aXNlLCB0aGlzIHdpbGwgdGhyb3cgYW4gZXJyb3I6IGBUeXBlRXJyb3I6XG4gICAgICAgICAgICAgICAgLy8gQ2Fubm90IHJlYWQgcHJvcGVydGllcyBvZiB1bmRlZmluZWQgKHJlYWRpbmcgJ1N5bWJvbChTeW1ib2wuc3BlY2llcyknKWAuXG4gICAgICAgICAgICAgICAgbGV0IEMgPSB0aGlzLmNvbnN0cnVjdG9yPy5bU3ltYm9sLnNwZWNpZXNdO1xuICAgICAgICAgICAgICAgIGlmICghQyB8fCB0eXBlb2YgQyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBDID0gdGhpcy5jb25zdHJ1Y3RvciB8fCBab25lQXdhcmVQcm9taXNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjaGFpblByb21pc2UgPSBuZXcgQyhub29wKTtcbiAgICAgICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbc3ltYm9sVmFsdWVdLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYWluUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoKG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseShvbkZpbmFsbHkpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWUgY29tbWVudCBvbiB0aGUgY2FsbCB0byBgdGhlbmAgYWJvdXQgd2h5IHRoZWUgYFN5bWJvbC5zcGVjaWVzYCBpcyBzYWZlbHkgYWNjZXNzZWQuXG4gICAgICAgICAgICAgICAgbGV0IEMgPSB0aGlzLmNvbnN0cnVjdG9yPy5bU3ltYm9sLnNwZWNpZXNdO1xuICAgICAgICAgICAgICAgIGlmICghQyB8fCB0eXBlb2YgQyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBDID0gWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhaW5Qcm9taXNlID0gbmV3IEMobm9vcCk7XG4gICAgICAgICAgICAgICAgY2hhaW5Qcm9taXNlW3N5bWJvbEZpbmFsbHldID0gc3ltYm9sRmluYWxseTtcbiAgICAgICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbc3ltYm9sVmFsdWVdLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UsIG9uRmluYWxseSwgb25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYWluUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQcm90ZWN0IGFnYWluc3QgYWdncmVzc2l2ZSBvcHRpbWl6ZXJzIGRyb3BwaW5nIHNlZW1pbmdseSB1bnVzZWQgcHJvcGVydGllcy5cbiAgICAgICAgLy8gRS5nLiBDbG9zdXJlIENvbXBpbGVyIGluIGFkdmFuY2VkIG1vZGUuXG4gICAgICAgIFpvbmVBd2FyZVByb21pc2VbJ3Jlc29sdmUnXSA9IFpvbmVBd2FyZVByb21pc2UucmVzb2x2ZTtcbiAgICAgICAgWm9uZUF3YXJlUHJvbWlzZVsncmVqZWN0J10gPSBab25lQXdhcmVQcm9taXNlLnJlamVjdDtcbiAgICAgICAgWm9uZUF3YXJlUHJvbWlzZVsncmFjZSddID0gWm9uZUF3YXJlUHJvbWlzZS5yYWNlO1xuICAgICAgICBab25lQXdhcmVQcm9taXNlWydhbGwnXSA9IFpvbmVBd2FyZVByb21pc2UuYWxsO1xuICAgICAgICBjb25zdCBOYXRpdmVQcm9taXNlID0gKGdsb2JhbFtzeW1ib2xQcm9taXNlXSA9IGdsb2JhbFsnUHJvbWlzZSddKTtcbiAgICAgICAgZ2xvYmFsWydQcm9taXNlJ10gPSBab25lQXdhcmVQcm9taXNlO1xuICAgICAgICBjb25zdCBzeW1ib2xUaGVuUGF0Y2hlZCA9IF9fc3ltYm9sX18oJ3RoZW5QYXRjaGVkJyk7XG4gICAgICAgIGZ1bmN0aW9uIHBhdGNoVGhlbihDdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90byA9IEN0b3IucHJvdG90eXBlO1xuICAgICAgICAgICAgY29uc3QgcHJvcCA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgJ3RoZW4nKTtcbiAgICAgICAgICAgIGlmIChwcm9wICYmIChwcm9wLndyaXRhYmxlID09PSBmYWxzZSB8fCAhcHJvcC5jb25maWd1cmFibGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgQ3Rvci5wcm90b3R5cGUudGhlbiBwcm9wZXJ0eURlc2NyaXB0b3IgaXMgd3JpdGFibGUgb3Igbm90XG4gICAgICAgICAgICAgICAgLy8gaW4gbWV0ZW9yIGVudiwgd3JpdGFibGUgaXMgZmFsc2UsIHdlIHNob3VsZCBpZ25vcmUgc3VjaCBjYXNlXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUaGVuID0gcHJvdG8udGhlbjtcbiAgICAgICAgICAgIC8vIEtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAgICAgIHByb3RvW3N5bWJvbFRoZW5dID0gb3JpZ2luYWxUaGVuO1xuICAgICAgICAgICAgQ3Rvci5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvblJlc29sdmUsIG9uUmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IG5ldyBab25lQXdhcmVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUaGVuLmNhbGwodGhpcywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlZC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIEN0b3Jbc3ltYm9sVGhlblBhdGNoZWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBhcGkucGF0Y2hUaGVuID0gcGF0Y2hUaGVuO1xuICAgICAgICBmdW5jdGlvbiB6b25laWZ5KGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0UHJvbWlzZSA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRQcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGN0b3IgPSByZXN1bHRQcm9taXNlLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICghY3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hUaGVuKGN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE5hdGl2ZVByb21pc2UpIHtcbiAgICAgICAgICAgIHBhdGNoVGhlbihOYXRpdmVQcm9taXNlKTtcbiAgICAgICAgICAgIHBhdGNoTWV0aG9kKGdsb2JhbCwgJ2ZldGNoJywgKGRlbGVnYXRlKSA9PiB6b25laWZ5KGRlbGVnYXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyBub3QgcGFydCBvZiBwdWJsaWMgQVBJLCBidXQgaXQgaXMgdXNlZnVsIGZvciB0ZXN0cywgc28gd2UgZXhwb3NlIGl0LlxuICAgICAgICBQcm9taXNlW1pvbmUuX19zeW1ib2xfXygndW5jYXVnaHRQcm9taXNlRXJyb3JzJyldID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycztcbiAgICAgICAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2U7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhdGNoVG9TdHJpbmcoWm9uZSkge1xuICAgIC8vIG92ZXJyaWRlIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyB0byBtYWtlIHpvbmUuanMgcGF0Y2hlZCBmdW5jdGlvblxuICAgIC8vIGxvb2sgbGlrZSBuYXRpdmUgZnVuY3Rpb25cbiAgICBab25lLl9fbG9hZF9wYXRjaCgndG9TdHJpbmcnLCAoZ2xvYmFsKSA9PiB7XG4gICAgICAgIC8vIHBhdGNoIEZ1bmMucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgICAgICBjb25zdCBPUklHSU5BTF9ERUxFR0FURV9TWU1CT0wgPSB6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyk7XG4gICAgICAgIGNvbnN0IFBST01JU0VfU1lNQk9MID0gem9uZVN5bWJvbCgnUHJvbWlzZScpO1xuICAgICAgICBjb25zdCBFUlJPUl9TWU1CT0wgPSB6b25lU3ltYm9sKCdFcnJvcicpO1xuICAgICAgICBjb25zdCBuZXdGdW5jdGlvblRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbERlbGVnYXRlID0gdGhpc1tPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdO1xuICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbERlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxEZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKG9yaWdpbmFsRGVsZWdhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcmlnaW5hbERlbGVnYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVQcm9taXNlID0gZ2xvYmFsW1BST01JU0VfU1lNQk9MXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hdGl2ZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChuYXRpdmVQcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRXJyb3IgPSBnbG9iYWxbRVJST1JfU1lNQk9MXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hdGl2ZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmNhbGwobmF0aXZlRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKHRoaXMpO1xuICAgICAgICB9O1xuICAgICAgICBuZXdGdW5jdGlvblRvU3RyaW5nW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF0gPSBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmc7XG4gICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IG5ld0Z1bmN0aW9uVG9TdHJpbmc7XG4gICAgICAgIC8vIHBhdGNoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgdG8gbGV0IHRoZW0gbG9vayBsaWtlIG5hdGl2ZVxuICAgICAgICBjb25zdCBvcmlnaW5hbE9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgICAgICAgY29uc3QgUFJPTUlTRV9PQkpFQ1RfVE9fU1RSSU5HID0gJ1tvYmplY3QgUHJvbWlzZV0nO1xuICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09PSAnZnVuY3Rpb24nICYmIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFBST01JU0VfT0JKRUNUX1RPX1NUUklORztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbE9iamVjdFRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhdGNoQ2FsbGJhY2tzKGFwaSwgdGFyZ2V0LCB0YXJnZXROYW1lLCBtZXRob2QsIGNhbGxiYWNrcykge1xuICAgIGNvbnN0IHN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXyhtZXRob2QpO1xuICAgIGlmICh0YXJnZXRbc3ltYm9sXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5hdGl2ZURlbGVnYXRlID0gKHRhcmdldFtzeW1ib2xdID0gdGFyZ2V0W21ldGhvZF0pO1xuICAgIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24gKG5hbWUsIG9wdHMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdHMgJiYgb3B0cy5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGAke3RhcmdldE5hbWV9LiR7bWV0aG9kfTo6YCArIGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG9wdHMucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHRoZSBgcGF0Y2hDYWxsYmFja3NgIGlzIHVzZWQgZm9yIHBhdGNoaW5nIHRoZSBgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50YCBhbmRcbiAgICAgICAgICAgICAgICAvLyBgY3VzdG9tRWxlbWVudHMuZGVmaW5lYC4gV2UgZXhwbGljaXRseSB3cmFwIHRoZSBwYXRjaGluZyBjb2RlIGludG8gdHJ5LWNhdGNoIHNpbmNlXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2tzIG1heSBiZSBhbHJlYWR5IHBhdGNoZWQgYnkgb3RoZXIgd2ViIGNvbXBvbmVudHMgZnJhbWV3b3JrcyAoZS5nLiBMV0MpLCBhbmQgdGhleVxuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhvc2UgcHJvcGVydGllcyBub24td3JpdGFibGUuIFRoaXMgbWVhbnMgdGhhdCBwYXRjaGluZyBjYWxsYmFjayB3aWxsIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgLy8gYGNhbm5vdCBhc3NpZ24gdG8gcmVhZC1vbmx5IHByb3BlcnR5YC4gU2VlIHRoaXMgY29kZSBhcyBhbiBleGFtcGxlOlxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zYWxlc2ZvcmNlL2x3Yy9ibG9iL21hc3Rlci9wYWNrYWdlcy9AbHdjL2VuZ2luZS1jb3JlL3NyYy9mcmFtZXdvcmsvYmFzZS1icmlkZ2UtZWxlbWVudC50cyNMMTgwLUwxODZcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHN0b3AgdGhlIGFwcGxpY2F0aW9uIHJlbmRlcmluZyBpZiB3ZSBjb3VsZG4ndCBwYXRjaCBzb21lXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2ssIGUuZy4gYGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja2AuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBhcGkuT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShkZXNjcmlwdG9yLnZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5fcmVkZWZpbmVQcm9wZXJ0eShvcHRzLnByb3RvdHlwZSwgY2FsbGJhY2ssIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3RvdHlwZVtjYWxsYmFja10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZTogd2UgbGVhdmUgdGhlIGNhdGNoIGJsb2NrIGVtcHR5IHNpbmNlIHRoZXJlJ3Mgbm8gd2F5IHRvIGhhbmRsZSB0aGUgZXJyb3IgcmVsYXRlZFxuICAgICAgICAgICAgICAgICAgICAvLyB0byBub24td3JpdGFibGUgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hdGl2ZURlbGVnYXRlLmNhbGwodGFyZ2V0LCBuYW1lLCBvcHRzLCBvcHRpb25zKTtcbiAgICB9O1xuICAgIGFwaS5hdHRhY2hPcmlnaW5Ub1BhdGNoZWQodGFyZ2V0W21ldGhvZF0sIG5hdGl2ZURlbGVnYXRlKTtcbn1cblxuZnVuY3Rpb24gcGF0Y2hVdGlsKFpvbmUpIHtcbiAgICBab25lLl9fbG9hZF9wYXRjaCgndXRpbCcsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgICAgICAvLyBDb2xsZWN0IG5hdGl2ZSBldmVudCBuYW1lcyBieSBsb29raW5nIGF0IHByb3BlcnRpZXNcbiAgICAgICAgLy8gb24gdGhlIGdsb2JhbCBuYW1lc3BhY2UsIGUuZy4gJ29uY2xpY2snLlxuICAgICAgICBjb25zdCBldmVudE5hbWVzID0gZ2V0T25FdmVudE5hbWVzKGdsb2JhbCk7XG4gICAgICAgIGFwaS5wYXRjaE9uUHJvcGVydGllcyA9IHBhdGNoT25Qcm9wZXJ0aWVzO1xuICAgICAgICBhcGkucGF0Y2hNZXRob2QgPSBwYXRjaE1ldGhvZDtcbiAgICAgICAgYXBpLmJpbmRBcmd1bWVudHMgPSBiaW5kQXJndW1lbnRzO1xuICAgICAgICBhcGkucGF0Y2hNYWNyb1Rhc2sgPSBwYXRjaE1hY3JvVGFzaztcbiAgICAgICAgLy8gSW4gZWFybGllciB2ZXJzaW9uIG9mIHpvbmUuanMgKDwwLjkuMCksIHdlIHVzZSBlbnYgbmFtZSBgX196b25lX3N5bWJvbF9fQkxBQ0tfTElTVEVEX0VWRU5UU2BcbiAgICAgICAgLy8gdG8gZGVmaW5lIHdoaWNoIGV2ZW50cyB3aWxsIG5vdCBiZSBwYXRjaGVkIGJ5IGBab25lLmpzYC4gSW4gbmV3ZXIgdmVyc2lvbiAoPj0wLjkuMCksIHdlXG4gICAgICAgIC8vIGNoYW5nZSB0aGUgZW52IG5hbWUgdG8gYF9fem9uZV9zeW1ib2xfX1VOUEFUQ0hFRF9FVkVOVFNgIHRvIGtlZXAgdGhlIG5hbWUgY29uc2lzdGVudCB3aXRoXG4gICAgICAgIC8vIGFuZ3VsYXIgcmVwby4gVGhlICBgX196b25lX3N5bWJvbF9fQkxBQ0tfTElTVEVEX0VWRU5UU2AgaXMgZGVwcmVjYXRlZCwgYnV0IGl0IGlzIHN0aWxsIGJlXG4gICAgICAgIC8vIHN1cHBvcnRlZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGNvbnN0IFNZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTID0gWm9uZS5fX3N5bWJvbF9fKCdCTEFDS19MSVNURURfRVZFTlRTJyk7XG4gICAgICAgIGNvbnN0IFNZTUJPTF9VTlBBVENIRURfRVZFTlRTID0gWm9uZS5fX3N5bWJvbF9fKCdVTlBBVENIRURfRVZFTlRTJyk7XG4gICAgICAgIGlmIChnbG9iYWxbU1lNQk9MX1VOUEFUQ0hFRF9FVkVOVFNdKSB7XG4gICAgICAgICAgICBnbG9iYWxbU1lNQk9MX0JMQUNLX0xJU1RFRF9FVkVOVFNdID0gZ2xvYmFsW1NZTUJPTF9VTlBBVENIRURfRVZFTlRTXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXSkge1xuICAgICAgICAgICAgWm9uZVtTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UU10gPSBab25lW1NZTUJPTF9VTlBBVENIRURfRVZFTlRTXSA9XG4gICAgICAgICAgICAgICAgZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXTtcbiAgICAgICAgfVxuICAgICAgICBhcGkucGF0Y2hFdmVudFByb3RvdHlwZSA9IHBhdGNoRXZlbnRQcm90b3R5cGU7XG4gICAgICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0ID0gcGF0Y2hFdmVudFRhcmdldDtcbiAgICAgICAgYXBpLmlzSUVPckVkZ2UgPSBpc0lFT3JFZGdlO1xuICAgICAgICBhcGkuT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3REZWZpbmVQcm9wZXJ0eTtcbiAgICAgICAgYXBpLk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICAgICAgYXBpLk9iamVjdENyZWF0ZSA9IE9iamVjdENyZWF0ZTtcbiAgICAgICAgYXBpLkFycmF5U2xpY2UgPSBBcnJheVNsaWNlO1xuICAgICAgICBhcGkucGF0Y2hDbGFzcyA9IHBhdGNoQ2xhc3M7XG4gICAgICAgIGFwaS53cmFwV2l0aEN1cnJlbnRab25lID0gd3JhcFdpdGhDdXJyZW50Wm9uZTtcbiAgICAgICAgYXBpLmZpbHRlclByb3BlcnRpZXMgPSBmaWx0ZXJQcm9wZXJ0aWVzO1xuICAgICAgICBhcGkuYXR0YWNoT3JpZ2luVG9QYXRjaGVkID0gYXR0YWNoT3JpZ2luVG9QYXRjaGVkO1xuICAgICAgICBhcGkuX3JlZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgICAgIGFwaS5wYXRjaENhbGxiYWNrcyA9IHBhdGNoQ2FsbGJhY2tzO1xuICAgICAgICBhcGkuZ2V0R2xvYmFsT2JqZWN0cyA9ICgpID0+ICh7XG4gICAgICAgICAgICBnbG9iYWxTb3VyY2VzLFxuICAgICAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXMsXG4gICAgICAgICAgICBldmVudE5hbWVzLFxuICAgICAgICAgICAgaXNCcm93c2VyLFxuICAgICAgICAgICAgaXNNaXgsXG4gICAgICAgICAgICBpc05vZGUsXG4gICAgICAgICAgICBUUlVFX1NUUixcbiAgICAgICAgICAgIEZBTFNFX1NUUixcbiAgICAgICAgICAgIFpPTkVfU1lNQk9MX1BSRUZJWCxcbiAgICAgICAgICAgIEFERF9FVkVOVF9MSVNURU5FUl9TVFIsXG4gICAgICAgICAgICBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGF0Y2hDb21tb24oWm9uZSkge1xuICAgIHBhdGNoUHJvbWlzZShab25lKTtcbiAgICBwYXRjaFRvU3RyaW5nKFpvbmUpO1xuICAgIHBhdGNoVXRpbChab25lKTtcbn1cblxuY29uc3QgWm9uZSQxID0gbG9hZFpvbmUoKTtcbnBhdGNoQ29tbW9uKFpvbmUkMSk7XG5wYXRjaEJyb3dzZXIoWm9uZSQxKTtcbiJdLCJtYXBwaW5ncyI6IjtBQU1BLElBQU0sU0FBUztBQUdmLFNBQVMsV0FBVyxNQUFNO0FBQ3RCLFFBQU0sZUFBZSxPQUFPLHNCQUFzQixLQUFLO0FBQ3ZELFNBQU8sZUFBZTtBQUMxQjtBQUNBLFNBQVMsV0FBVztBQUNoQixRQUFNLGNBQWMsT0FBTyxhQUFhO0FBQ3hDLFdBQVMsS0FBSyxNQUFNO0FBQ2hCLG1CQUFlLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxFQUFFLElBQUk7QUFBQSxFQUNsRTtBQUNBLFdBQVMsbUJBQW1CLE1BQU0sT0FBTztBQUNyQyxtQkFBZSxZQUFZLFNBQVMsS0FBSyxZQUFZLFNBQVMsRUFBRSxNQUFNLEtBQUs7QUFBQSxFQUMvRTtBQUNBLE9BQUssTUFBTTtBQUNYLFFBQU0sWUFBTixNQUFNLFVBQVM7QUFBQSxJQUdYLE9BQU8sb0JBQW9CO0FBQ3ZCLFVBQUksT0FBTyxTQUFTLE1BQU0sUUFBUSxrQkFBa0IsR0FBRztBQUNuRCxjQUFNLElBQUksTUFBTSwrUkFJMEM7QUFBQSxNQUM5RDtBQUFBLElBQ0o7QUFBQSxJQUNBLFdBQVcsT0FBTztBQUNkLFVBQUksT0FBTyxVQUFTO0FBQ3BCLGFBQU8sS0FBSyxRQUFRO0FBQ2hCLGVBQU8sS0FBSztBQUFBLE1BQ2hCO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUNBLFdBQVcsVUFBVTtBQUNqQixhQUFPLGtCQUFrQjtBQUFBLElBQzdCO0FBQUEsSUFDQSxXQUFXLGNBQWM7QUFDckIsYUFBTztBQUFBLElBQ1g7QUFBQTtBQUFBLElBRUEsT0FBTyxhQUFhLE1BQU0sSUFBSSxrQkFBa0IsT0FBTztBQUNuRCxVQUFJLFFBQVEsZUFBZSxJQUFJLEdBQUc7QUFJOUIsY0FBTSxpQkFBaUIsT0FBTyxXQUFXLHlCQUF5QixDQUFDLE1BQU07QUFDekUsWUFBSSxDQUFDLG1CQUFtQixnQkFBZ0I7QUFDcEMsZ0JBQU0sTUFB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QUNyQixFQUFBQSxNQUFLLGFBQWEsUUFBUSxDQUFDZixTQUFRZSxPQUFNLFFBQVE7QUFHN0MsVUFBTSxhQUFhLGdCQUFnQmYsT0FBTTtBQUN6QyxRQUFJLG9CQUFvQjtBQUN4QixRQUFJLGNBQWM7QUFDbEIsUUFBSSxnQkFBZ0I7QUFDcEIsUUFBSSxpQkFBaUI7QUFNckIsVUFBTSw2QkFBNkJlLE1BQUssV0FBVyxxQkFBcUI7QUFDeEUsVUFBTSwwQkFBMEJBLE1BQUssV0FBVyxrQkFBa0I7QUFDbEUsUUFBSWYsUUFBTyx1QkFBdUIsR0FBRztBQUNqQyxNQUFBQSxRQUFPLDBCQUEwQixJQUFJQSxRQUFPLHVCQUF1QjtBQUFBLElBQ3ZFO0FBQ0EsUUFBSUEsUUFBTywwQkFBMEIsR0FBRztBQUNwQyxNQUFBZSxNQUFLLDBCQUEwQixJQUFJQSxNQUFLLHVCQUF1QixJQUMzRGYsUUFBTywwQkFBMEI7QUFBQSxJQUN6QztBQUNBLFFBQUksc0JBQXNCO0FBQzFCLFFBQUksbUJBQW1CO0FBQ3ZCLFFBQUksYUFBYTtBQUNqQixRQUFJLHVCQUF1QjtBQUMzQixRQUFJLGlDQUFpQztBQUNyQyxRQUFJLGVBQWU7QUFDbkIsUUFBSSxhQUFhO0FBQ2pCLFFBQUksYUFBYTtBQUNqQixRQUFJLHNCQUFzQjtBQUMxQixRQUFJLG1CQUFtQjtBQUN2QixRQUFJLHdCQUF3QjtBQUM1QixRQUFJLG9CQUFvQixPQUFPO0FBQy9CLFFBQUksaUJBQWlCO0FBQ3JCLFFBQUksbUJBQW1CLE9BQU87QUFBQSxNQUMxQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNKO0FBQUEsRUFDSixDQUFDO0FBQ0w7QUFFQSxTQUFTLFlBQVllLE9BQU07QUFDdkIsZUFBYUEsS0FBSTtBQUNqQixnQkFBY0EsS0FBSTtBQUNsQixZQUFVQSxLQUFJO0FBQ2xCO0FBRUEsSUFBTSxTQUFTLFNBQVM7QUFDeEIsWUFBWSxNQUFNO0FBQ2xCLGFBQWEsTUFBTTsiLCJuYW1lcyI6WyJzZWxmIiwiZ2xvYmFsIiwiZGVsZWdhdGUiLCJwcm9wIiwiX2dsb2JhbCIsImV2ZW50IiwicGF0Y2hPcHRpb25zIiwicmV0dXJuVGFyZ2V0Iiwid2luZG93IiwiaXNCcm93c2VyIiwiaXNNaXgiLCJ6b25lU3ltYm9sRXZlbnROYW1lcyIsIlRSVUVfU1RSIiwiRkFMU0VfU1RSIiwiWk9ORV9TWU1CT0xfUFJFRklYIiwiaW50ZXJuYWxXaW5kb3ciLCJab25lIiwibmFtZSIsImxvYWRUYXNrcyIsIk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdERlZmluZVByb3BlcnR5IiwiX19zeW1ib2xfXyIsInZhbHVlIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=