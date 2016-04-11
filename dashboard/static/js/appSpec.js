describe('ReportingRateController', function() {
    var scope, createController, httpBackend;
    beforeEach(function() {
        module('dashboard');
    });
    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        createController = function() {
            return $controller('ReportingRateController', {
                '$scope': scope
            });
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch values when startCycle changes', function() {
        var controller = createController();
        httpBackend.expect('GET', '/api/test/submittedOrder?start=Jan+Feb+2013')
            .respond({
                "values": []
            });
        scope.startCycle = "Jan Feb 2013";
        httpBackend.flush();
    });
});