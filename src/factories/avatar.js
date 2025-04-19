module.exports = function(modal) {
	return modal({
		controller: function($scope, $transitions, $timeout, $state, body, data, avatar) {

            let Croppie = require('./../utils/croppie'),
                crop = null;    
            $scope.state = $state;
            
            function closeCrop() {
                crop.destroy();
                crop = null;
            }
            
            function imageEdit(image) {
                $scope.spinner = true;
                if (crop) {
                    closeCrop();
                }
                let elem = document.getElementById('modal-cropper'),
                    viewport = { width: 320, height: 420, type: 'square' };

                if (window.innerWidth < 1024) {
                    viewport = { width: 240, height: 315, type: 'square' };
                }

                let opts = {
                    viewport: viewport,
//                    boundary: { height: 502 },
                    enableResize: false,
                    enableOrientation: true,
                    mouseWheelZoom: 'ctrl',
//                    customClass: 'ot-croparea--height',
        //            enableZoom: false
                };
                crop = new Croppie(elem, opts);
                crop.bind({
                    url: data.img.url_cors,
                    zoom: 0
                }).then(() => {
                    $scope.spinner = false;
                    $scope.$digest();
                    return true;
                });
            };
            
			$scope.close = function() {
                closeCrop();
				avatar.reject();
				body.close();
			};
            
            $scope.confirm = () => avatar.resolve();
            
            $scope.rotateImg = function() {
                crop.rotate(90);
                crop.setZoom(0);
            }
            
            $scope.saveCrop = async function() {
                let result = await crop.result({ 
                    type: 'base64',
                    size: 'original', 
                    format: 'jpeg'
                }),
                    f = dataURLtoFile(result, `avatar#${data.img.id}`);
                closeCrop();
                avatar.resolve(f);
            };
            
            function dataURLtoFile(dataurl, filename) {
                let arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while(n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            }
            
            $timeout(imageEdit, 500);

            $transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/avatar.html'
	});
}