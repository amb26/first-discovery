/*

Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*
     * The nav icon
     */
    fluid.defaults("gpii.firstDiscovery.icon", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        position: null,  // must be supplied by integrators
        selectors: {
            confirmedIndicator: ".gpiic-fd-confirmedIndicator"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        modelListeners: {
            "isActive": {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.active", "{change}.value"]
            },
            "isConfirmed": {
                listener: "gpii.firstDiscovery.icon.setConfirmedState",
                args: ["{that}", "{change}.value"]
            }
        }
    });

    gpii.firstDiscovery.icon.setConfirmedState = function (that, isConfirmed) {
        if (isConfirmed) {
            that.locate("confirmedIndicator").addClass(that.options.styles.show);
        }
    };

    /*
     * The navigation icons: the wrapper component to help determine the position of each nav icon.
     */
    fluid.defaults("gpii.firstDiscovery.navIcons", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        dynamicComponents: {
            icon: {
                createOnEvent: "onCreateIcon",
                type: "gpii.firstDiscovery.icon",
                container: "{arguments}.0",
                options: {
                    position: "{arguments}.1",
                    styles: "{navIcons}.options.styles",
                    modelListeners: {
                        "{navIcons}.model.currentPanelNum": {
                            listener: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{change}.value", "{change}.oldValue"]
                        }
                    }
                }
            }
        },
        selectors: {
            icon: ".gpiic-fd-navIcon"
        },
        events: {
            onCreateIcon: null
        },
        listeners: {
            "onCreate.createIcons": "gpii.firstDiscovery.navIcons.createIcons"
        }
    });

    gpii.firstDiscovery.navIcons.createIcons = function (that) {
        var icons = that.locate("icon");
        fluid.each(icons, function (element, index) {
            that.events.onCreateIcon.fire(element, index + 1);
        });
    };

    gpii.firstDiscovery.navIcons.updateIconModel = function (icon, currentPanelNum, prevPanelNum) {
        var position = icon.options.position;
        icon.applier.change("isActive", currentPanelNum === position);
        icon.applier.change("isConfirmed", prevPanelNum === position && currentPanelNum > prevPanelNum);
    };

})(jQuery, fluid);
