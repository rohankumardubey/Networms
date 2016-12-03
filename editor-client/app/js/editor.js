"use strict";
// these are the lines that don't work in the broswer yet becuase require is part of node
// we need to use broswerify or require js here and edit the gulpfile.js to add to the build pipeline
var Change = require('change');
var Insert = require('insert');
var Delete = require('delete');

(function() {
    var BACKSPACE_CODE = 8;
    var DELETE_CODE = 46;
    
    var PENDING_LIST = [];
    var SENT_ITEM = null;

    window.onload = function() {
        setupInputListeners();
        setupConnection();
        var button = $("#test");
        button.click(function(e) {
            var testInsert = new Insert("Hunter", 3);
            applyChange(testInsert);
        });

        button = $("#dTest");
        button.click(function(e) {
            var firstInsert = new Insert("Hunter", 10, 3, 5);
	        var secondInsert = new Insert("Andrew", 20, 4, 6);
            var secondChange = new Change(4, 5, 6);
            console.log("first insert index:", firstInsert.index);
            console.log("second change index:",  secondChange);
            console.log(firstInsert.toString());
            console.log(secondInsert.toString());
            console.log(secondInsert.index);
            firstInsert.transform(secondInsert);
            console.log(firstInsert.toString());
            console.log(secondInsert.toString());
        });

    };

    function setupInputListeners() {
        var textbox = $("#textbox");
        textbox.keypress(function(e) {
            var key = e.key;
            var position = e.target.selectionStart;
            /* TODO: We can potentially write the addition to the pending list so that it "merges"
               changes next to each other into one big change. That way we can get some bigger
               messages being sent */
            var change = new Insert(key, position);
            console.log(change.toString(), e);
            PENDING_LIST.push(change);
        });

        textbox.keydown(function(e) {
            // TODO: Handle copy and paste?
            var index = -1;
            var length = 1;
            if (e.keyCode === BACKSPACE_CODE || e.keyCode === DELETE_CODE) {
                if (e.target.selectionStart != e.target.selectionEnd) {
                    // Delete range
                    index = e.target.selectionStart;
                    length = e.target.selectionEnd - e.target.selectionStart;
                } else if (e.keyCode === BACKSPACE_CODE && e.target.selectionStart > 0) {
                    // Delete previous char
                    index = e.target.selectionStart - 1;
                } else if (e.keyCode === DELETE_CODE &&
                    e.target.selectionStart < this.val().length()) {
                        // Delete "this" char
                        index = e.target.selectionStart
                    }
            }

            if (index >= 0) {
                var change = new Delete(length, index);
                console.log(change.toString(), e);
                PENDING_LIST.push(change);
            }
        });
    }

    function setupConnection() {
        //var port = 8888;

        //var serverConnection = new net.Socket();
        //client.connect(port, 'attu1.cs.washington.edu', function() {
        //    client.write('CONNECT');
        //});

        //client.on('data', function(data) {
        //    console.log('Received', data);
        //    /**
        //     * Pseudocode
        //     *   Parse data into a change object
        //     *   for each change in PENDING_LIST
        //     *      OT 
        //     *   apply change to textbox
        //     */

        //});
    }

    function applyChange(change) {
        // before this point we have to parse the plain text from server 
        // into an insert or delete
        
        var textbox = $("#textbox");
        var resultText = change.apply(textbox[0].value);
        textbox[0].value = resultText;
    }

})();