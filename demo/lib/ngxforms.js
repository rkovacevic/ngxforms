angular.module('ng.xforms', [])

.directive('ngXForm', [function () {
    return {
        restrict: 'EA',
        controller: function($scope, $element, $attrs) {
            this.propertySubmitted = function(property, successCallback, errorCallback) {
                var onSubmitFn = $scope.$eval($attrs.onSubmit.substring(0, $attrs.onSubmit.indexOf('(')));
                onSubmitFn(property, successCallback, errorCallback);
            };
        },
        link: function($scope, $element, $attrs) {
            $attrs.$observe('inplaceMode', function (inplaceMode) {
                $scope.ngxforms_inplaceMode = inplaceMode == 'true';
            });

            $attrs.$observe('editable', function (editable) {
                $scope.ngxforms_editable = editable == 'true';
            });            
        }
    };
}])
.directive('ngXInput', [function () {
    return {
        restrict: 'E',
        require: ['ngModel', '^ngXForm'], 
        template: '<a href="#"></a>',
        link: function($scope, $element, $attrs, controllers) {
            var ngModel = controllers[0];
            var form = controllers[1];

            var prefix = $attrs.prefix ? $attrs.prefix + ' ' : '';
            var suffix = $attrs.suffix ? ' ' + $attrs.suffix : '';

            var previousValue = null;

            $element.editable({
                type: 'text',
                mode: 'inline',
                showbuttons: false,
                onblur: 'submit',
                url: function(params) {
                    var deferred = new $.Deferred;
                    $scope.$apply(function () {
                        previousValue = ngModel.$viewValue;
                        ngModel.$setViewValue(params.value);
                        form.propertySubmitted($attrs.ngModel, function () {
                            deferred.resolve();
                        }, function () {
                            deferred.reject('err');
                        });
                    });
                    return deferred.promise();
               },
               display: function(value, sourceData) {
                    $(this).html(prefix + value + suffix);
               }
            });

            var inplaceMode = false;
            var editable = true;

            ngModel.$render = function() {
                $element.editable('setValue', ngModel.$viewValue || '', false);
            };
            
            $element.on('hidden', function(e, reason) {
                console.log(reason);
                if (reason === 'manual' && inplaceMode) {
                    if (previousValue != null) {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(previousValue);
                        });
                    }
                }
                if (reason === 'manual' && !inplaceMode) {
                    $element.editable('show', false);
                }
            });

            var updateOptions = function() {
                $element.editable('option', 'disabled', !editable);
                if (inplaceMode) {
                    $element.editable('option', 'onblur', 'submit');
                    $element.editable('option', 'toggle', 'click');
                    $element.editable('hide');
                } else {
                    $element.editable('option', 'onblur', 'ignore');
                    $element.editable('option', 'toggle', 'manual');
                    $element.editable('show', false);
                }
            }

            $scope.$watch('ngxforms_editable', function (e) {
                editable = e;
                updateOptions();
            });

            $scope.$watch('ngxforms_inplaceMode', function (i) {
                inplaceMode = i;
                updateOptions();
            });
        }
    };
}])
