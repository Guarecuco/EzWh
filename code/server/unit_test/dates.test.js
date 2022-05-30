const {isValid} = require("../utilities/dates");


function testDates(date, expectedOutcome) {
    test('test validation of dates', () => {
        const outcome = isValid(date);
        expect(outcome).toStrictEqual(expectedOutcome);
    });
}

describe('Test dates validation function', function(){
    testDates('2020/10/10 03:44', true);

    testDates('2020', false);

    testDates('2020/10/10', false);

});

