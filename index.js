/*!
 * cliz - command-line interface zork
 *
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

var fs = require("fs"),
    sudo = require("sudo"),
    join = require("path").join,
    spawn = require("child_process").spawn,
    exec = require("child_process").execSync,
    user = require('username'),
    base = require("path").basename,
    util = require("./util");

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    option: function () {
        var params = [];

        params.push("--verify");
        params.push(sketch.entrypoint);

        return this.arduino(sketch, params, opts, callback);
    }

};
