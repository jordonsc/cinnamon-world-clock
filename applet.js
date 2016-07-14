const Applet = imports.ui.applet;
const Settings = imports.ui.settings;
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;

function WorldClock(metadata, orientation, panelHeight, instance_id) {
    this._init(metadata, orientation, panelHeight, instance_id);
}

WorldClock.prototype = {
    __proto__: Applet.TextApplet.prototype,

    _init: function (metadata, orientation, panelHeight, instance_id) {
        Applet.TextApplet.prototype._init.call(this, orientation, panelHeight, instance_id);

        try {
            // Grab the UUID from metadata for Settings
            this.settings = new Settings.AppletSettings(this, metadata.uuid, instance_id); 

            this.settings.bindProperty(
                Settings.BindingDirection.IN, // Setting type
                "label", // The setting key
                "label", // The property to manage (this.label)
                this.on_settings_changed, // Callback when value changes
                null // Optional callback data
            ); 

            this.settings.bindProperty(
                Settings.BindingDirection.IN, // Setting type
                "timezone", // The setting key
                "timezone", // The property to manage (this.timezone)
                this.on_settings_changed, // Callback when value changes
                null // Optional callback data
            );

            // Make metadata values available within applet for context menu.
            this.cssfile = metadata.path + "/stylesheet.css"; // No longer required
            this.changelog = metadata.path + "/changelog.txt";
            this.helpfile = metadata.path + "/help.txt";

            this.appletPath = metadata.path;
            this.UUID = metadata.uuid;

            this.refreshDelay = 5;

            // Create the context menu
            this.buildContextMenu();

            // Finally start the update loop for the applet display running
            this.updateLoop();
        } catch (e) {
            global.logError(e);
        }
    },

    // Settings have been updated
    on_settings_changed: function () {
        this.updateUI();
    },

    // Create context menu items
    buildContextMenu: function() {
        // this._applet_context_menu.removeAll();

        // let menuitem = new PopupMenu.PopupMenuItem("Refresh");
        // menuitem.connect('activate', Lang.bind(this, function (event) {
        //     this.updateUI();
        // }));
        // this._applet_context_menu.addMenuItem(menuitem);
    },

    on_applet_clicked: function (event) {
        GLib.spawn_command_line_async('cinnamon-settings applets ' + this.UUID);
    },

    // This updates the numerical display in the applet and in the tooltip and background colour of applet
    updateUI: function () {
        var offset = parseInt(this.timezone);
        var d = new Date();

        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offset));

        var txt = this.label + " " + this.formatTime(nd);

        this.set_applet_label(txt);
    },

    formatTime: function(d) {
        var t = "";

        if (d.getHours() < 10) {
            t = "0" + d.getHours() + ":";
        } else {
            t = d.getHours() + ":";
        }

        if (d.getMinutes() < 10) {
            t += "0" + d.getMinutes();
        } else {
            t += d.getMinutes();
        }

        return t;
    },

    // Update the UI every this.refreshInterval seconds
    updateLoop: function () {
        this.updateUI();
        Mainloop.timeout_add_seconds(this.refreshDelay, Lang.bind(this, this.updateLoop));
    },

    // Finalise the settings when the applet is removed from the panel
    on_applet_removed_from_panel: function () {
        // inhibit the update timer when applet removed from panel
        this.settings.finalize();
    }
};

function main(metadata, orientation, panelHeight, instance_id) {
    let clock = new WorldClock(metadata, orientation, panelHeight, instance_id);
    return clock;
}
