"use strict";

(function() {
    //console.log(GUESTS, '>>>>>>>>>>>>>>>');   
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
    initializeClock('clockdiv', deadline);

    function getGuestList(file) {
        $.getJSON(file, (guests) =>{
            console.log('Guests', guests);
        });
    }

    function getUserDetails(guests) {
        document.getElementById('submit-name').addEventListener('click', (e) => {
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
                weddingInfo(guest);
            }
        });
    }

    function getGuestDetails(user, guests) {
        let userDetails = guests.filter((guest) => {
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
        let className = guest.FullDay ==='1'? 'breakfast':'evening';
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
        $('#submit-rsvp').on('click', () => {
            let form = document.getElementById('RSVP')
            let fullName = $('input[name=full-name]').val();
            let rsvp = $('select option:selected').val();
            let mealOption = $('input[name=meal-option]').val();
            let furtherDetails = $('textarea[name=further-details]').val();
            let guestName = $('input[name=guest-name]').val();

            let body = encodeURIComponent('Hi Zahra & Tormod, ' + mealOption + '\n\n' + furtherDetails + '\n\nComing with: ' + guestName + '\n\nfrom ' + '\n\n' + fullName);
            console.log('bbb', body, mealOption, furtherDetails, guestName);
            
            window.open('mailto:tormodsmith@gmail.com?subject=RSVP%20' + rsvp + '%20Wedding&body=' + body, '_blank');
        })
    }

    $('#giftButton').on('click',()=>{
        $('#gift').toggle();
    });
    
    //getGuestList('guests.json');  cross origin requests only supported ....
    getUserDetails(GUESTS);
    sendRSVP();



}());
