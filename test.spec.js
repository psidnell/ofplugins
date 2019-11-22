var findVariables = function(text, variablesFound) {
    substrings = text.match(/\$\{[^\}]*\}/gm);
    if (substrings != null) {
        for (var i = 0; i < substrings.length; i++) {
            var variable = substrings[i];
            if (!variablesFound.includes(variable)) {
                console.log("Found variable " + variable);
                variablesFound.push(variable);
            }
        }
    }
};

describe('Can find variables', () => {
    it('can find variable', () => {
        var text = "this is a ${variable1} ${variable2} ${variable2}";
        let variablesFound = [];
        findVariables(text, variablesFound);
        expect(variablesFound[0]).toEqual("${variable1}");
        expect(variablesFound[1]).toEqual("${variable2}");
        expect(variablesFound.length).toBe(2);
    });
});
