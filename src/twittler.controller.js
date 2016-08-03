// used by data_generator to add new tweets.
let visitor = 'home';

$(document).ready(function twittler() {
  'use strict';
  // The element to which we attach the tweets to .
  let $tbody = $('.collection');

  // Holds the index of returned by setInterval
  let intervalHandle;

  // Handle for stroing the user name whose tweets are being shown .
  let currentUser;

  // Will contain all the tweets being shown.
  let currentUserTweets;

  // This will be used to keep an count of all the new tweets gets added
  // after the view finished loading.
  let totalNewTweetsCount = 0;

  // The count of the number tweets with which the page loads.
  let initialTweetsCount;

  let getTweets = (userName) => {
    return (userName === 'home') ? streams.home : streams.users[userName];
  };

  let hasNewTweets = (userName) => {
    return getTweets(userName).length > initialTweetsCount;
  };

  let updateBadge = (newCount) => {
    $('#new-tweet-count').text(totalNewTweetsCount);
  };

  let createTWeetTemplate = (tweet) => {
    let $tweetTemplate = $(
      '<div class="collection-item ">' +
      '<a href="#!">' +
      '<h5 id="user-name"></h5>' +
      '<span id ="time" class="right"> </span>' +
      '</a>' +
      '<h4 id="message" class="ligh-green-color"> </h4>' +
      '</div>');

    $tweetTemplate.find('#user-name').text(`@${tweet.user}:`);
    $tweetTemplate.find('#message').text(`${tweet.message}`);
    $tweetTemplate.find('#time').text(moment(`-${tweet.created_at}`).fromNow());

    return $tweetTemplate;
  };

  let addSingleTweet = (tweet, parent, methodName) => {
    if (typeof tweet.created_at === 'undefined') {
      tweet.created_at = new Date();
    }
    let $newTweet = createTWeetTemplate(tweet);
    $newTweet[methodName].apply($newTweet, parent);
  };

  let addAllTweets = (allTweets, parent, methodName) => {
    $tbody.empty();
    allTweets.forEach((tweet) => {
      addSingleTweet(tweet, parent, methodName);
    });
  };

  let getMoreTweets = (userName) => {
    if (hasNewTweets(userName)) {
      let tweets = getTweets(userName);

      totalNewTweetsCount = totalNewTweetsCount + (tweets.length - initialTweetsCount);
      updateBadge(totalNewTweetsCount);
      initialTweetsCount = tweets.length;
      addAllTweets(tweets, $tbody, 'prependTo');
    }
  };

  let init = (userName) => {

    currentUser = userName;
    $('#current-user').text(currentUser.toUpperCase());
    currentUserTweets = getTweets(userName);
    initialTweetsCount = currentUserTweets.length;
    totalNewTweetsCount = 0;

    updateBadge(totalNewTweetsCount);
    addAllTweets(currentUserTweets, $tbody, 'appendTo');

    if (typeof intervalHandle !== 'undefined') {
      clearInterval(intervalHandle);
    }

    intervalHandle = setInterval(() => {
      getMoreTweets(currentUser);
    }, 5000);
  };

  let notify = (message) => {
    let element = $('<div id="notification" class="card-panel  green accent-2"></div>');
    element.text(`${visitor} Said: :${message}`);
    element.prependTo($('#pageTop'));

    // Remove the notification after 3 seconds.
    setTimeout(() => {
      $('#notification').remove();
    }, 5000)
  };

  // handle click on user name
  $(document).on('click', '#user-name', function() {
    let userName = $(this).text().slice(1, -1);
    visitor = userName;
    $tbody.html('');
    init(userName);
  });

  // Enter New Tweet
  $(document).on('click', '#btn-submit', function() {
    let inputElement = $('.materialize-textarea');
    let message = inputElement.val();

    if (message.length > 0) {
      inputElement.val('');
      if (visitor === 'home') {
        visitor = users[Math.floor(Math.random() * users.length)];
      }
      writeTweet(message);
      let size = streams.users[visitor].length;
      addSingleTweet(streams.users[visitor][size - 1], $tbody, 'prependTo');
      notify(message);
    }
  });

  // Initial load of the view.
  init('home');
});
