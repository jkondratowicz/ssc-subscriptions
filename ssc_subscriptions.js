// ==UserScript==
// @name        SSC Subscriptions
// @description Adds a button on "Following" page to open all watched threads with new posts in new tabs
// @namespace   https://www.skyscrapercity.com/watched/
// @icon        https://images.platforum.cloud/icons/skyscrapercity_comx32.ico
// @include     https://www.skyscrapercity.com/watched/*
// @include     https://www.skyscrapercity.com/whats-new/posts/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM.openInTab
// @version     1.1.5
// @author      toonczyk
// @downloadURL https://raw.githubusercontent.com/jkondratowicz/ssc-subscriptions/master/ssc_subscriptions.js
// ==/UserScript==

const NEW_TAB_DELAY_MS = 500;

(function() {
    'use strict';

    const newNode = document.createElement('span');
    newNode.setAttribute ('class', 'unreadContainer');

    function recalculateElCount() {
        const elCount = $('div.structItem.is-unread').size();
        if (elCount > 0) {
            newNode.innerHTML = '<button class="unreadButton button california-following-normal button" type="button">Open unread (<strong>' + elCount +'</strong>) in new tabs 💬</button>';
        } else {
            newNode.innerHTML = '<span>No new posts.</span>';
        }
    }

    const queue = [];

    function addToQueue(div, href) {
        queue.push({
            div,
            href
        });
    }

    function processQueue() {
        let interval;
        interval = window.setInterval(() => {
            if(queue.length === 0) {
                window.clearInterval(interval);
                return;
            }

            openInNewTab(queue.pop());
        }, NEW_TAB_DELAY_MS);
    }

    function openInNewTab(obj) {
        GM.openInTab(obj.href);
        obj.div.removeClass('is-unread');
    }

    recalculateElCount();

    $('div.california-outer-upper-nav').append(newNode);

    const newPostNavDiv = $('div.california-upper-page-nav');
    if (newPostNavDiv.size()) {
        $(newNode).insertBefore(newPostNavDiv);
    }

    $('.unreadButton').click(function(e) {
        e.preventDefault();
        $('div.structItem.is-unread').each(function(idx, el) {
            const div = $(el);
            const href = div.find('.structItem-title a').prop('href');
            if (href.match(/\/unread$/)) {
                addToQueue(div, href);
            }
        });
        processQueue();
        recalculateElCount();
    });
})();
