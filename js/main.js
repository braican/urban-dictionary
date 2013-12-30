//
// namespace - URBAN
//

(function(URBAN, $, undefined){

    URBAN.DEFS = {};

    function renderTheGame(){
        $.each(URBAN.DEFS, function(index, val) {
            var $words = $('#words li'),
                $defs = $('#defs li'),
                w_pos = Math.floor(($words.length + 1) * Math.random()),
                d_pos = Math.floor(($defs.length + 1) * Math.random());

            if($words.length === w_pos){
                $('#words').append('<li>' + index + '</li>');
            } else {
                $words.eq(w_pos).before('<li>' + index + '</li>');
            }
            
            if($defs.length === d_pos){
                $('#defs').append('<li>' + val + '</li>');
            } else {
                $defs.eq(d_pos).before('<li>' + val + '</li>');
            }
        });

    }

    function getDefs(x){
        $.get('util/proxy.php', function(data) {
            var link = data.substring(data.lastIndexOf("?term=")+6, data.lastIndexOf("\">"));

            $.get('http://api.urbandictionary.com/v0/define?term=' + link, function(data) {
                var word = data.list[0].word,
                    def = data.list[0].definition;
                URBAN.DEFS[word] = def.replace(/[\n\r]/g, ' ');

                if(x > 1){
                    getDefs(x - 1);
                } else {
                    renderTheGame();

                    $('#loading').fadeOut(function() {
                        $('#the-game').fadeIn();    
                    });
                    
                }
            });
        });
    }

    URBAN.init = function(){
        getDefs(12);

        $(document).on('click', 'ul li', function(event){
            event.preventDefault();
            
            $(this).parent().find('li.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#result > span').fadeOut();

            var $word = $('#words li.selected'),
                $defs = $('#defs li.selected');

            if($word.length && $defs.length){
                var word = $('#words li.selected').text(),
                    def = $('#defs li.selected').text();

                if(URBAN.DEFS[word] == def){
                    $('#result .gotit').fadeIn();
                    $('li.selected').removeClass('selected').addClass('correct');
                    if($('#words li').length === $('#words li.correct').length){
                        console.log("game over");
                    }
                } else {
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