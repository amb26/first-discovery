/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    jqUnit.test("gpii.firstDiscovery.selfVoicing.setLabel", function () {
        var elm = $(".setLabel-test");
        var testStrings = {
            muted: "muted",
            unmuted: "unmuted"
        };

        gpii.firstDiscovery.selfVoicing.setLabel(elm, testStrings.unmuted, testStrings.muted, true);
        jqUnit.assertEquals("The mute label should be applied", testStrings.unmuted, elm.text());

        gpii.firstDiscovery.selfVoicing.setLabel(elm, testStrings.unmuted, testStrings.muted, false);
        jqUnit.assertEquals("The mute label should be applied", testStrings.muted, elm.text());
    });

    jqUnit.test("gpii.firstDiscovery.selfVoicing.setMuteStyle", function () {
        var elm = $(".setMuteStyle-test");
        var testStyles = {
            muted: ".muted",
            unmuted: ".unmuted"
        };

        gpii.firstDiscovery.selfVoicing.setMuteStyle(elm, testStyles, true);
        jqUnit.assertTrue("The unmuted class should be applied", elm.hasClass(testStyles.unmuted));
        jqUnit.assertFalse("The muted class should not be applied", elm.hasClass(testStyles.muted));

        gpii.firstDiscovery.selfVoicing.setMuteStyle(elm, testStyles, false);
        jqUnit.assertTrue("The muted class should be applied", elm.hasClass(testStyles.muted));
        jqUnit.assertFalse("The unmuted class should not be applied", elm.hasClass(testStyles.unmuted));
    });

    fluid.defaults("gpii.tests.firstDiscovery.selfVoicing", {
        gradeNames: ["gpii.firstDiscovery.selfVoicing", "autoInit"],
        utteranceOpts: {
            volume: 0
        }
    });

    fluid.defaults("gpii.tests.selfVoicingTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            selfVoicing: {
                type: "gpii.tests.firstDiscovery.selfVoicing",
                container: ".gpiic-fd-selfVoicing",
                options: {
                    model: {
                        enabled: true
                    },
                    messageBase: {
                        "unmuted": "turn voice OFF",
                        "unmutedTooltip": "Select to turn voice off",
                        "unmutedMsg": "voice is on",
                        "muted": "turn voice ON",
                        "mutedTooltip": "Select to turn voice on",
                        "mutedMsg": "voice is off"
                    }
                }
            },
            selfVoicingTester: {
                type: "gpii.tests.selfVoicingTester"
            }
        }
    });

    fluid.defaults("gpii.tests.selfVoicingTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            increasedStep: 1.1,
            decreasedStep: 1.0
        },
        invokers: {
            testRendering: {
                funcName: "gpii.tests.selfVoicingTester.testRendering",
                args: ["{selfVoicing}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        },
        modules: [{
            name: "Tests the selfVoicing component",
            tests: [{
                expect: 3,
                name: "Test Init",
                type: "test",
                func: "{that}.testRendering",
                args: ["{selfVoicing}.options.messageBase.unmuted", "{selfVoicing}.options.messageBase.unmutedTooltip", "{selfVoicing}.options.styles.unmuted"]
            }, {
                expect: 4,
                name: "Test interaction",
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{selfVoicing}.dom.mute"
                }, {
                    listener: "{that}.testRendering",
                    args: ["{selfVoicing}.options.messageBase.muted", "{selfVoicing}.options.messageBase.mutedTooltip", "{selfVoicing}.options.styles.muted"],
                    spec: {path: "enabled", priority: "last"},
                    changeEvent: "{selfVoicing}.applier.modelChanged"
                }, {
                    func: "{selfVoicing}.queueSpeech",
                    args: ["Test Text"]
                }, {
                    listener: "jqUnit.assert",
                    args: ["The speaking should have completed"],
                    event: "{selfVoicing}.events.onStop"
                }]
            }]
        }]
    });

    gpii.tests.selfVoicingTester.testRendering = function (that, label, tooltipContent, cssClass) {
        var muteId = that.locate("mute").attr("id");
        jqUnit.assertEquals("The label should be set correctly", label, that.locate("muteLabel").text());
        jqUnit.assertEquals("The tooltip text should be set correctly", tooltipContent, that.tooltip.model.idToContent[muteId]);
        jqUnit.assertTrue("The class should be applied to the container", that.container.hasClass(cssClass));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.selfVoicingTest"
        ]);
    });

})(jQuery, fluid);
