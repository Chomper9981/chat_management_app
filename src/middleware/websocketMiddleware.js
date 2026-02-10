const websocketMiddleware = store => next => action => {
  // WebSocket middleware will handle WebSocket operations here
  return next(action);
};

export default websocketMiddleware;
