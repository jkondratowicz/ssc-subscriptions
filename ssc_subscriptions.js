// ==UserScript==
// @name        SSC Subscriptions
// @description Adds a button on "Following" page to open all watched threads with new posts in new tabs
// @namespace   https://www.skyscrapercity.com/watched/
// @icon        https://images.platforum.cloud/icons/skyscrapercity_comx32.ico
// @include     https://www.skyscrapercity.com/watched/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM.openInTab
// @version     1.1.0
// @author      toonczyk
// @downloadURL ---
// ==/UserScript==

(function() {
    'use strict';


    const newNode = document.createElement('span');
    newNode.setAttribute ('class', 'unreadContainer');

    function reaclculateElCount() {
        const elCount = $('div.structItem.is-unread').size();
        if (elCount > 0) {
            newNode.innerHTML = '<button class="unreadButton button california-following-normal button" type="button">Open unread (<strong>' + elCount +'</strong>) in new tabs 💬</button>';
        } else {
            newNode.innerHTML = '<span>No new posts.</span>';
        }
    }

    reaclculateElCount();


    $('div.california-outer-upper-nav').append(newNode);

    $('.unreadButton').click(function(e) {
        e.preventDefault();
        $('div.structItem.is-unread').each(function(idx, el) {
            const div = $(el);
            const href = div.find('.structItem-title a').prop('href');
            if (href.match(/\/unread$/)) {
                GM.openInTab(href);
                div.removeClass('is-unread');
            }
        });
        reaclculateElCount();
    });

})();