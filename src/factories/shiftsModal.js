module.exports = function(modal) {
	return modal({
		controller: function ($scope, shiftsModal, config, $rootScope, Loader, $transitions, body, Staffing, Shifts, button, initCheck, Me) {
//			$rootScope.body = body;
            $scope.Staffing = Staffing;
            $scope.Shifts = Shifts;
            $scope.button_title = button;
            $scope.initCheck = initCheck;
            $scope.note = '';
//            $scope.notEmptyShift = (shift) => shift.count;
            
            if (initCheck && Staffing.event.type === 'physical') {//need only for invited status
                $scope.Shifts.forEach((shift) => {//check is already hired to overlap shift
                    if ($scope.Staffing.usershifts.some( (user_shift) => user_shift.status === 'HIRED' && user_shift.shift.id !== shift.id && 
                                                      ( user_shift.shift.start.isBetween(shift.start, shift.end) || 
                                                       user_shift.shift.end.isBetween(shift.start, shift.end) || 
                                                       shift.start.isBetween(user_shift.shift.start, user_shift.shift.end) || 
                                                       shift.end.isBetween(user_shift.shift.start, user_shift.shift.end) || 
                                                       (shift.start.isSame(user_shift.shift.start) && shift.end.isSame(user_shift.shift.end))
                                                      )) ) {
                        shift.selected = false;
                        shift.overlap_hired = true;
                    }
                    
                    if (shift.totalShiftStaffNeeded <= 0) {
                        shift.selected = false;
                        shift.staffed = true;
                    }
                });
            } else {
                if ($scope.Staffing.usershifts.length) {
                    let tmp = $scope.Staffing.usershifts.find((user_shift) => user_shift.description);
                    if (tmp) {
                        $scope.note = tmp.description;
                    }
                }
                if (button !== 'Reject') {
                    $scope.Shifts.forEach(shift => {
                        if (shift.isSocialError) {
                            shift.selected = false;
                            shift.disable = true;
                        }
                    });
                }
            }
            
            $scope.confirm = function() {
                shiftsModal.resolve({
                    picked_shifts: $scope.Shifts,
                    note: $scope.note
                });
				body.close();
            };
            
			$scope.close = function() {
				shiftsModal.reject();
				body.close();
			};
            
//            $scope.disable = function(Shift) {
//                if (initCheck) {
//                    return Shift.totalShiftStaffNeeded <= 0 || $scope.disableOverlap(Shift);
//                } else {
//                    return false;
//                }
//            }
//
            $scope.disableOverlap = function(shiftToCheck) {
                if (initCheck) {
                    return $scope.Shifts.some( (shift) => shiftToCheck.id !== shift.id && shift.selected && 
                                                  ( shiftToCheck.start.isBetween(shift.start, shift.end) || 
                                                   shiftToCheck.end.isBetween(shift.start, shift.end) || 
                                                   shift.start.isBetween(shiftToCheck.start, shiftToCheck.end) || 
                                                   shift.end.isBetween(shiftToCheck.start, shiftToCheck.end) || 
                                                   (shift.start.isSame(shiftToCheck.start) && shift.end.isSame(shiftToCheck.end))
                                                  ) );
                } else {
                    return false;
                }
            };
            
            $scope.isDisabled = () => !$scope.Shifts.some((shift) => shift.selected);
            
            $transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/shiftsModal.html'
	});
    
};