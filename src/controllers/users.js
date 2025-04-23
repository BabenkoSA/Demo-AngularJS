module.exports = function($scope, RequestEmulator, Notification, UsersList) {
    $scope.users = UsersList;
    console.log('Users:', $scope.users);
    $scope.options = [{
        name: 'Administrator',
        value: 'admin'
    }, {
        name: 'Driver',
        value: 'driver'
    }];

    $scope.selectedUser = null;
    $scope.mode = null;

    function resetForm() {
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
        $scope.selectedUser = null;
    }

    $scope.closeEdit = () => {
        $scope.mode = null;
        resetForm();
        console.log('form:', $scope.userForm);
    }

    $scope.editUser = function(user) {
        if ($scope.selectedUser) {
            resetForm();
        }
        $scope.mode = 'edit';
        $scope.selectedUser = angular.copy(user);
        console.log('form:', $scope.userForm);
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

    $scope.saveUser = function() {
        // Save the user to the server or perform any other action
        console.log('User saved:', $scope.selectedUser);
        if ($scope.userForm.$invalid) {
            console.log('Form is invalid:', $scope.userForm);
            Notification.showMessage('Something wrong', 'error');
            return;
        }
        if ($scope.mode === 'create') {
            RequestEmulator.saveUser($scope.selectedUser).then((response) => {
                $scope.users.push(response);
                Notification.showMessage('User saved successfully', 'success');
            }, (error) => {
                Notification.showMessage('Save user failed', 'error');
            });
        } else if ($scope.mode === 'edit') {
            RequestEmulator.updateUser($scope.selectedUser).then((response) => {
                let index = $scope.users.findIndex(user => user.id === $scope.selectedUser.id);
                if (index !== -1) {
                    $scope.users[index] = response;
                }
                Notification.showMessage('User updated successfully', 'success');
            }, (error) => {
                Notification.showMessage('Update user failed', 'error');
            });
        }
        
        $scope.closeEdit();
    }
    // $scope.saveUser = async function() {
    //     try {
    //         if ($scope.userForm.$invalid) {
    //             throw Error('Form is invalid');
    //         }
    //         let result, message;

    //         if ($scope.mode === 'create') {
    //             result = await RequestEmulator.saveUser($scope.selectedUser).then((response) => response, (error) => {
    //                 throw Error('Save user failed');
    //             });
    //             $scope.users.push(result);
    //             message = 'User saved successfully';
    //         } else if ($scope.mode === 'edit') {
    //             result = await RequestEmulator.updateUser($scope.selectedUser).then((response) => response, (error) => {
    //                 throw Error('Update user failed');
    //             });
    //             let index = $scope.users.findIndex(user => user.id === result.id);
    //             if (index !== -1) {
    //                 $scope.users[index] = result;
    //             }
    //             message = 'User updated successfully';
    //         }
    //         Notification.showMessage(message, 'success');
    //         $scope.closeEdit();
    //     } catch ({ name, message }) {
    //         Notification.showMessage(message, 'error');
    //     }
    // }

    $scope.deleteUser = function(event) {
        // Delete the user from the server or perform any other action
        RequestEmulator.deleteUser($scope.selectedUser.id).then((deletedId) => {
            let index = $scope.users.findIndex(user => user.id === deletedId);
            if (index !== -1) {
                $scope.users.splice(index, 1); // Remove the user from the array
            }
            Notification.showMessage('User deleted', 'success');
        }, (error) => {
            Notification.showMessage('Operation failed', 'error');
        });

        $scope.closeEdit();
    }

}