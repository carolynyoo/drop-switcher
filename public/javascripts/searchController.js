var app = angular.module('dropSwitcher', []); 

app.controller('Search', function($scope, SCAnalyzer) {
  $scope.searchResults = null;
  $scope.searching = false;
  $scope.doneAnalyzing = false;
  $scope.trackQuery = "";
  $scope.analyzedResults = null;
  $scope.tooGeneric = false;
  $scope.dropBar = null;

  SC.initialize({
    client_id: '153f9d01d4fb3470daf72b370f2cfe62'
  });

  $scope.searchSoundcloud = function () {
    $scope.loading = true;
    SC.get('/tracks', { q: $scope.trackQuery, duration: {to: 600000}}, function(tracks) {
      $scope.searchResults = tracks; 
      $scope.loading = false;
      $scope.searching = true;
      $scope.$digest();
    });
  }

  $scope.analyzeTrack = function (url) {
    $scope.doneAnalyzing = true;
    SCAnalyzer.analyze(url).then(function (data) {
      $scope.analyzedResults = data;
      if (data && parseInt(data.track.time_signature)!==4 || parseInt(data.track.tempo)!==128) {
        $scope.tooGeneric = true;
      } else {
        $scope.dropBar = data.bars[60];
      }
    })
    .catch(function (err) {
      console.log(err);
    });
    $scope.doneAnalyzing = true;
  }

  $scope.remixTrack = function (scURL, downloadURL) {
    $scope.doneAnalyzing = true;

    SCAnalyzer.analyze(scURL).then(function (data) {
      $scope.analyzedResults = {
      analysis: data,
      status: "complete"
      }

      var contextFunction = window.AudioContext || window.webkitAudioContext;
      var context = new contextFunction();
      // VCPXEMPPTK402WM6Y api key
      var remixer = createJRemixer(context, $, 'VCPXEMPPTK402WM6Y');
      var player = remixer.getPlayer();
      var trackURL = downloadURL + '?client_id=153f9d01d4fb3470daf72b370f2cfe62';

      remixer.remixTrack($scope.analyzedResults, trackURL, function (t, percent) {
        $scope.t = t;
        $scope.percent = percent;
        if (t && parseInt(t.track.time_signature)!==4 || parseInt(t.track.tempo)!==128) {
          $scope.tooGeneric = true;
        } else {
          if ($scope.track.status == 'ok') {
            $scope.dropBar = true;
            $scope.remixed = [];
            for (var i=0; i<$scope.track.bars.length; i++) {
              $scope.remixed.push($scope.track.bars[i]);
            }
          }
        }})

    })
    .catch(function (err) {
      console.log(err);
    });
  }

});

app.factory('SCAnalyzer', function ($http) {
  return {
    analyze: function (url) {
      var body = {
        url: url
      }
      return $http.post('/analyze', body).then(function (response) {
        console.log(JSON.parse(response.data));
        return JSON.parse(response.data);
      })
    }
  }
});