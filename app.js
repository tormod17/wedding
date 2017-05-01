"use strict";

(function() {
    "use strict";
    //console.log(GUESTS, '>>>>>>>>>>>>>>>');
    (function getWeddingPhotos() {
        var url = 'https://api.flickr.com/services/rest/';
        var query ='?method=flickr.photosets.getPhotos&api_key=8d779e2ab6bce146731dc0bb3dc373eb&photoset_id=72157683234143205&user_id=149536636%40N03&format=json&nojsoncallback=1&auth_token=72157683187455356-ebf274d7c3395d83&api_sig=f4bd179c86b8a5ffe38c0bb24043b84d'
        $.get(url + query , function(data, status){
            if (status === 'success') {
                var photos = getPhotoURLs(data.photoset.photo).reverse();
                createGallery(photos);
            } else {
                console.log('Error with flickr talk to Mr T', status);
            }
        });
    }())


    function getPhotoURLs(photos) {
        var photoURLs = photos.map(function(obj) {
            var host = 'https://c1.staticflickr.com/';
            var photoSize = 'b.jpg';
            var photo = obj.id + '_' + obj.secret + '_' + photoSize;
            return host + obj.farm + '/' + obj.server + '/' + photo;
        })
        return photoURLs
    }
    var controls = $('<div class="controls"></div>');
    var backSvg = '<svg width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M70,20, 20,50, 70,80"></path></svg>';
    var divider = '<div class="divider"><svg width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="50" y1="10" x2="50" y2="90"></svg></div>';
    var nextSvg = '<svg width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M20,20, 70,50, 20,80"></path></svg>';

    function makeSlideMagnify(ele){
        ele
        .on('mouseover', function(){
            ele.css({'transform': 'scale(1.6)'})
        })
        .on('mouseout', function(){
            ele.css({'transform': 'scale(1)'})
        })
        .on('mousemove', function(e){
            var target = $('#slides').offset();
            var x = ((e.pageX - target.left) / $('.showing').width())* 100 +'%';
            var y = ((e.pageY - target.top) / $('.showing').height() )* 100 + '%';
            ele.css({'transform-origin': x +  y });
        })
    }
    function createGallery(photos) {
        var slides = photos.map(function(photo, i) {
            var slideClass = i === 0 ? 'slide showing' : 'slide';
            var slide = $('<li></li>').addClass(slideClass).css({
                'background-image': 'url(' + photo + ')',
            });
            makeSlideMagnify(slide)
            return slide;
        })
        var list = $('<ul id="slides"></ul>');
        list.append(slides);

        var currentSlide = 0;

        var nextSlide = function() {
            goToSlide(currentSlide + 1);
        }

        var backSlide = function() {
            goToSlide(currentSlide - 1);
        }

        function goToSlide(n) {
            var l = slides.length;
            slides[currentSlide].attr('class', 'slide');
            $('.slide.showing').attr('class','slide');
            currentSlide = (n + l) % l;
            slides[currentSlide].attr('class', 'slide showing');
        }

        var backButton = $('<div class="scroll back"></div>');
        backButton.on('click', function() {
            backSlide();
        })
        backButton.append(backSvg);

        var forwardButton = $('<div class="scroll forward"></div>');
        forwardButton.on('click', function() {
            nextSlide();
        })
        forwardButton.append(nextSvg);

        function selectSlide(i) {
            $('.slide.showing').attr('class', 'slide');
            slides[i].attr('class', 'slide showing');
        }
        function showReel(photos) {
            var previewSlides = photos.map(function(photo, i) {
                var previewClass = i === 0 ? 'preview showing' : 'preview';
                var previewSlide = $('<li></li>').addClass(previewClass).css({
                    'background-image': 'url(' + photo.replace('_b.jpg','_s.jpg') + ')'
                }).on('click', function(e) {
                    selectSlide(i)
                });
                return previewSlide;
            });
            var list = $('<ul id="previewSlides"></ul>');
            list.append(previewSlides);
            return list
        }

        controls.append(backButton, divider, forwardButton);
        var sideReel = showReel(photos);
        $('#gallery').append(list, controls, sideReel);

    }


    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

    var source = GUESTS.map((guest) => {
        return guest.GuestName
    })

    $("#autocomplete").autocomplete({
        source: source
    });

    var deadline = 'August 24 2016 13:30:00 GMT+0200'
        // initializeClock('clockdiv', deadline);

/*    function getGuestList(file) {
        $.getJSON(file, (guests) => {
            console.log('Guests', guests);
        });
    }

    function getUserDetails(guests) {
        document.getElementById('submit-name').addEventListener('click', function(e) {
            e.preventDefault();
            var user = document.getElementById('autocomplete').value
            var guest = getGuestDetails(user, guests);
            console.log(guest);
            if (!guest) {
                $('#contactUs').toggle();
                $('#contactMessage').toggle();
                scrollTo('#contactUs')
            } else {
                scrollTo("#wedding");
                var evening = 'Look forward to seeing you in the Evening at 18:30'
                var breakfast = 'Look forward to seeing you at 13:00'
                guest.Evening === 1 ? alert(evening) : alert(breakfast);
                //weddingInfo(guest);
            }
        });
    }

    function getGuestDetails(user, guests) {
        var userDetails = guests.filter(function(guest) {
            return guest.GuestName === user
        });
        return userDetails[0]
    }*/

    function scrollTo(location) {
        $('html,body').animate({
                scrollTop: $(location).offset().top
            },
            'slow');
    }

    function weddingInfo(guest) {
        var className = guest.FullDay === '1' ? 'breakfast' : 'evening';
        $('#wrapper').toggle();
        $('#contactUs').toggle();

        $('input[name=full-name]').val(guest.GuestName);

        $('.' + className).toggle();
        if (guest.FullDay === '1') {
            $('input[name=meal-option]').attr('type', 'text');
            $('label[for=meal-option]').toggle();
        }

    }

    function sendRSVP() {

        $('#submit-rsvp').on('click', function() {
            var form = document.getElementById('RSVP')
            var fullName = $('input[name=full-name]').val();
            var rsvp = $('select option:selected').val();
            var mealOption = $('input[name=meal-option]').val();
            var furtherDetails = $('textarea[name=further-details]').val();
            var guestName = $('input[name=guest-name]').val();

            var body = encodeURIComponent('Hi Zahra & Tormod, ' + mealOption + '\n\n' + furtherDetails + '\n\nComing with: ' + guestName + '\n\nfrom ' + '\n\n' + fullName);
            window.open('mailto:tormodsmith@gmail.com?subject=RSVP%20' + rsvp + '%20Wedding&body=' + body, '_blank');
        })
    }

    $('#giftButton').on('click', function() {
        $('#gift').toggle();
    });

    var source = GUESTS.map(function(guest) {
        return guest.GuestName
    });

    $('.fa.fa-angle-down.fa-5x').on('click', function() {
        scrollTo("#wedding");
    })

    $("#autocomplete").autocomplete({
        source: source
    });

    var deadline = 'August 24 2016 13:30:00 GMT+0200';

    initializeClock('clockdiv', deadline);
  //  getUserDetails(GUESTS);
    sendRSVP();
}());
