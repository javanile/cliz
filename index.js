/*!
 * cliz - command-line interface zork
 *
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , join = require('path').join
    , basename = require('path').basename
    , colors = require('colors')
    , spawn = require('child_process').spawn
    , exec = require('child_process').execSync
    , yaml = require('js-yaml')
    , merge = require('deepmerge')

require('dotenv').config({path: '.env'})

module.exports = {

    /**
     *
     */
    debugTag: '<<debug>>',

    /**
     *
     */
    errorTag: '<<error>>',

    /**
     *
     */
    fatalTag: '<<fatal>>',

    /**
     * Get option value from command-line argument.
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
     *
     * @param file
     * @param schema
     */
    config: function(file, schema) {
        var code = this.parseVariables(fu.readFile(file))
        var data = yaml.safeLoad(code)

        return merge(schema || {}, data)
    },

    /**
     *
     * @param file
     * @param schema
     */
    configRaw: function(file, schema) {
        return merge(schema || {}, yaml.safeLoad(fu.readFile(file)))
    },

    /**
     *
     * @param file
     * @param schema
     */
    configSave: function(file, config) {
        return fu.writeFile(file, yaml.safeDump(config))
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

        if (!fu.fileExists(file)) { file = join(path, 'help.txt') }

        return this.write(fu.readFile(file), cb)
    },

    /**
     *
     *
     */
    version: function (path, cb) {
        var info = JSON.parse(fu.readFile(path), "utf8");
        var version = info.name + "@" + info.version

        return this.write(version, cb);
    },

    /**
     * Print console error.
     *
     * @param error
     * @param cb
     * @returns {*}
     */
    error: function (error, cb) {
        if (this.isFunction(cb)) { cb(error) }
        return this.write(colors.red.bold(this.errorTag) + ' ' + error)
    },

    /**
     * Print console error and exit.
     *
     * @param error
     * @param cb
     * @returns {*}
     */
    fatal: function (error, cb) {
        if (this.isFunction(cb)) { cb(error) }
        this.write(colors.red.bold(this.fatalTag) + ' ' + error)
        process.exit(1)
    },

    /**
     * Print console error and exit.
     *
     * @param error
     * @param cb
     * @returns {*}
     */
    debug: function (error, cb) {
        if (this.isFunction(cb)) { cb(error) }
        this.write(colors.yellow.bold(this.debugTag) + ' ' + error)
    },

    /**
     * Check if argument is a function.
     *
     * @param f
     * @returns {boolean}
     */
    isFunction: function(f) {
        return typeof f === 'function'
    },

    /**
     *
     */
    parseVariables: function (code) {
        return code.replace(/\$\{([A-Z_]+)\}/gm, function (token, variable) {
            return process.env[variable] || ''
        });
    }
}
