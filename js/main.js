//
// namespace - URBAN
//

(function(URBAN, $, undefined){

    var DEFS = {};

    function renderTheGame(){
        $.each(DEFS, function(index, val) {
            var $words = $('#words li'),
                $defs = $('#defs li');
            if($words.length === 0){
                $('#words').append('<li>' + index + '</li>');
            } else {
                $words.eq(Math.floor(Math.random()*$words.length)).before('<li>' + index + '</li>');    
            }
            
            if($defs.length === 0){
                $('#defs').append('<li>' + val + '</li>');
            } else {
                $defs.eq(Math.floor(Math.random()*$defs.length)).before('<li>' + val + '</li>');
            }
        });
    }

    function getDefs(x){
        $.get('util/proxy.php', function(data) {
            var link = data.substring(data.lastIndexOf("?term=")+6, data.lastIndexOf("\">"));

            $.get('http://api.urbandictionary.com/v0/define?term=' + link, function(data) {
                var word = data.list[0].word,
                    def = data.list[0].definition;
                console.log(data);                
                DEFS[word] = def;

                if(x > 1){
                    getDefs(x - 1);
                } else {
                    renderTheGame();
                }
            });
        });
    }

    URBAN.init = function(){
        getDefs(4);

        $(document).on('click', 'ul li', function(event){
            event.preventDefault();
            
            $(this).parent().find('li.selected').removeClass('selected');
            $(this).addClass('selected');

            var $word = $('#words li.selected'),
                $defs = $('#defs li.selected');

            if($word.length && $defs.length){
                var word = $('#words li.selected').text(),
                    def = $('#defs li.selected').text();

                if(DEFS[word] == def){
                    console.log("got it");
                    $('#result .gotit').fadeIn();
                    $('li.selected').removeClass('selected').addClass('correct');
                } else {
                    console.log("nope");
                    setTimeout(function(){
                        $('li.selected').removeClass('selected');
                    }, 600);
                    
                    $('#result .wrong').fadeIn();
                }

                setTimeout(function(){
                    $('#result > span').fadeOut();
                }, 3000);
            }
        });
    };
    
    $(document).ready(function() {
        URBAN.init();
    });
})(window.URBAN = window.URBAN || {}, jQuery);