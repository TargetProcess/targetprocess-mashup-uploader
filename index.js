#!/usr/bin/env node
'use strict';

var fs = require('fs');

var optionator = require('optionator');
var chokidar = require('chokidar');
var request = require('request-promise');

var options = optionator({
    prepend: 'targetprocess-mashup-uploader [options] file.js',
    options: [{
        heading: 'Options'
    }, {
        option: 'help',
        alias: 'h',
        type: 'Boolean',
        description: 'Show help',
        overrideRequired: true
    }, {
        option: 'name',
        alias: 'n',
        type: 'String',
        description: 'Name to save mashup'
    }, {
        option: 'host',
        type: 'String',
        description: 'Host to upload mashup',
        required: true
    }, {
        option: 'login',
        alias: 'l',
        type: 'String',
        description: 'Auth login',
        require: true,
        default: 'admin'
    }, {
        option: 'password',
        alias: 'p',
        type: 'String',
        description: 'Auth password',
        require: true,
        default: 'admin'
    }, {
        option: 'watch',
        alias: 'w',
        type: 'Boolean',
        description: 'Watch file and upload on changes'
    }]
});

var createMashup = function(filename, options) {

    var fileData = fs.readFileSync(filename).toString();

    return request({
            method: 'POST',
            baseUrl: options.host,
            url: '/api/v1/Plugins.asmx/Mashup%20Manager/Commands/AddMashup',
            json: true,
            body: {
                Name: options.name,
                Placeholders: 'restui_board',
                Files: [{
                    FileName: 'foobar.js',
                    Content: fileData
                }]
            },
            auth: {
                username: options.login,
                password: options.password
            }
        })
        .catch(function(err) {

            if (err.error && err.error[0] && err.error[0].Message) {

                console.error(err.error[0].Message);

            }

            console.error(err.stack);

        });

};

var removeMashup = function(options) {

    return request({
            method: 'POST',
            baseUrl: options.host,
            url: '/api/v1/Plugins.asmx/Mashup%20Manager/Commands/DeleteMashup',
            json: true,
            body: {
                Name: options.name
            },
            auth: {
                username: options.login,
                password: options.password
            }
        })
        .catch(function() {

        });

};

var updateMashup = function(filename, options) {

    var fileData = fs.readFileSync(filename).toString();

    return request({
            method: 'POST',
            baseUrl: options.host,
            url: '/api/v1/Plugins.asmx/Mashup%20Manager/Commands/UpdateMashup',
            json: true,
            body: {
                Name: options.name,
                OldName: options.name,
                Placeholders: 'restui_board',
                Files: [{
                    FileName: 'foobar.js',
                    Content: fileData
                }]
            },
            auth: {
                username: options.login,
                password: options.password
            }
        })
        .catch(function(err) {

            if (err.error && err.error[0] && err.error[0].Message) {

                console.error(err.error[0].Message);

            }

            console.error(err.stack);

        });

};

var args = process.argv;
var currentOptions = options.parse(args);

if (currentOptions.help) {

    console.log(options.generateHelp());

} else {

    var file = currentOptions._[0];

    removeMashup(currentOptions)
        .then(createMashup.bind(this, file, currentOptions))
        .then(function() {

            console.log('Mashup ' + currentOptions.name + ' is created');
            if (currentOptions.watch) {

                chokidar.watch(file)
                    .on('change', function() {

                        updateMashup(file, currentOptions)
                            .then(function() {

                                console.log('Mashup ' + currentOptions.name + ' is updated');

                            });

                    });

            }

        });

}
