/*!
 * cliz - command-line interface zork
 *
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fs = require('fs')
    , join = require('path').join
    , basename = require('path').basename
    , colors = require('colors')
    , spawn = require('child_process').spawn
    , exec = require('child_process').execSync

module.exports = {

    /**
     *
     */
    errorTag: '<<error>>',

    /**
     * Perform 'docker-compose up' base command.
     *
     * @param args
     */
    option: function (args, options, hasValue, notValue) {
        hasValue = hasValue || true
        notValue = notValue || false

        if (typeof options !== 'object') {
            var i = args.indexOf(options)
            if (i > -1) {
                args.splice(i, 1)
                return hasValue
            } else {
                return notValue
            }
        }

        for (var i in options) {
            if (this.option(args, options[i], true, false)) {
                return hasValue
            }
        }

        return notValue
    },

    /**
     *
     * @param args
     * @param defaults
     * @returns {*}
     */
    command: function (args, defaults) {
        var cmd = defaults || null;

        for (var i in args) {
            if (!args.hasOwnProperty(i)) {
                continue;
            }
            if (args[i].charAt(0) != "-") {
                cmd = args[i];
                args.splice(i, 1);
                break;
            }
        }

        return cmd;
    },

    /**
     * Check if argument contains value.
     *
     * @param args
     * @param value
     * @returns {boolean}
     */
    has: function(args, value) {
        return args.indexOf(value) > -1;
    },

    /**
     * Print console output.
     *
     * @param text
     */
    write: function(text, cb) {
        if (this.isFunction(cb)) { cb(text) }

        return console.log(text)
    },

    /**
     * Print help based on arguments.
     *
     * @param path
     * @param args
     * @param cb
     * @returns {*|void}
     */
    help: function (path, args, cb) {
        var cmd = this.command(args, 'help')
        var file = join(path, cmd + '.txt')

        if (!fs.existsSync(file)) { file = join(path, 'help.txt') }

        return this.write(fs.readFileSync(file).toString(), cb)
    },

    /**
     * Print console error.
     *
     * @param error
     * @param cb
     * @returns {*}
     */
    error: function (error, cb) {
        this.write(colors.red.bold(this.errorTag) + ' ' + colors.white(error))

        return cb(error)
    },

    /**
     * Check if argument is a function.
     *
     * @param f
     * @returns {boolean}
     */
    isFunction: function(f) {
        return typeof f === 'function'
    }
}
