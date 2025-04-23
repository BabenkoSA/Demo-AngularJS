module.exports = function($compileProvider, $qProvider, config) {
    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|tel|javascript):/);
    
    if (config.env === 'production') {
        $qProvider.errorOnUnhandledRejections(false);
		$compileProvider.debugInfoEnabled(false);
		$compileProvider.commentDirectivesEnabled(false);
        // $compileProvider.cssClassDirectivesEnabled(false);
    }
    
}
