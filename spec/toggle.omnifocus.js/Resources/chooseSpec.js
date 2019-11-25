describe('choose', () => {

    var action = null;

    beforeEach(function() {
        require('../../mocks/PlugIn');
        require('../../../toggle.omnifocusjs/Resources/choose.js');
        action = lastPlugInAction;
    });

    it('can create action', () => {
        expect(action).toBeTruthy();
        expect(action.fn).toBeTruthy();
        expect(action.validate).toBeTruthy();
    });
});
