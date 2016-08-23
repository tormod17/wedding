"use strict";

(function() {
   
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

    function getUserDetails(guests) {
        document.getElementById('submit-name').addEventListener('click', function(e){
            e.preventDefault();
            var user = document.getElementById('autocomplete').value
            var guest = getGuestDetails(user,guests);
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
        var userDetails = guests.filter(function(guest){
            return guest.GuestName === user
        });
        return userDetails[0]
    }

    function scrollTo(location) {
        $('html,body').animate({
                scrollTop: $(location).offset().top
            },
            'slow');
    }

    function weddingInfo(guest) {
        var className = guest.FullDay ==='1'? 'breakfast':'evening';
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
        $('#submit-rsvp').on('click', function(){
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

    $('#giftButton').on('click',function(){
        $('#gift').toggle();
    });
    
    var source = GUESTS.map(function(guest){
        return guest.GuestName 
    });

    $('.fa.fa-angle-down.fa-5x').on('click',function(){
           scrollTo("#wedding");
    })

    $("#autocomplete").autocomplete({
        source: source
    });
  
    var deadline = 'August 24 2016 13:30:00 GMT+0200';
    
    initializeClock('clockdiv', deadline);
    getUserDetails(GUESTS);
    sendRSVP();

}());
