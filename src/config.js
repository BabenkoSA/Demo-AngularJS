module.exports = function($mdGestureProvider, config, $compileProvider, $qProvider) {
    
    $mdGestureProvider.skipClickHijack(); //angular material touch support issue fix
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|tel|javascript):/);
    
    if (config.env === 'production') {
      $qProvider.errorOnUnhandledRejections(false);
		  $compileProvider.debugInfoEnabled(false);
		  $compileProvider.commentDirectivesEnabled(false);
        // $compileProvider.cssClassDirectivesEnabled(false);
    }
    
}
