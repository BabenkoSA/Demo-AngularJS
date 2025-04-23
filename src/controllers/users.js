module.exports = function($scope, $timeout, RequestEmulator, Notification, UsersList) {
    $scope.users = UsersList;
    $scope.options = [{
        name: 'Administrator',
        value: 'admin'
    }, {
        name: 'Driver',
        value: 'driver'
    }];

    $scope.selectedUser = null;
    $scope.mode = null;
    $scope.processing = false;

    function resetForm() {
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
        $scope.selectedUser = null;
    }

    $scope.closeEdit = () => {
        $scope.mode = null;
        resetForm();
    }

    $scope.editUser = function(user) {
        if ($scope.selectedUser) {
            resetForm();
        }
        $scope.mode = 'edit';
        $scope.selectedUser = angular.copy(user);
    }

    $scope.createUser = function() {
        if ($scope.selectedUser) {
            resetForm();
        }
        $scope.mode = 'create';
        $scope.selectedUser = {
            type: {
                name: 'Driver',
                value: 'driver'
            }
        };
    }

    $scope.saveUser = async function() {
        try {
            if ($scope.userForm.$invalid) {
                throw Error('Form is invalid');
            }
            let result, message;
            $scope.processing = true;
            if ($scope.mode === 'create') {
                result = await RequestEmulator.saveUser($scope.selectedUser).then((response) => response, (error) => {
                    throw Error('Save user failed');
                });
                $scope.users.push(result);
                message = 'User saved successfully';
            } else if ($scope.mode === 'edit') {
                result = await RequestEmulator.updateUser($scope.selectedUser).then((response) => response, (error) => {
                    throw Error('Update user failed');
                });
                let index = $scope.users.findIndex(user => user.id === result.id);
                if (index !== -1) {
                    $scope.users[index] = result;
                }
                message = 'User updated successfully';
            }
            $timeout(() => {
                Notification.showMessage(message, 'success');
            }, 0);
            $scope.closeEdit();
        } catch ({ name, message }) {
            Notification.showMessage(message, 'error');
        } finally {
            $scope.processing = false;
        }
    }

    $scope.deleteUser = async function() {
        // Delete the user from the server or perform any other action
        try {
            $scope.processing = true;
            let id = await RequestEmulator.deleteUser($scope.selectedUser.id).then((deletedId) => deletedId, (error) => {
                throw Error('Operation failed');
            });
            let index = $scope.users.findIndex(user => user.id === id);
            if (index !== -1) {
                $scope.users.splice(index, 1); // Remove the user from the array
            }
            $timeout(() => {
                Notification.showMessage('User deleted successfully', 'success');
            }, 0);
            $scope.closeEdit();
        } catch ({ name, message }) {
            Notification.showMessage(message, 'error');
        } finally {
            $scope.processing = false;
        }
    }

}