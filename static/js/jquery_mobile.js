$(document).on("pagecreate", function() {
    // Inicialize o carrossel de opiniões como um swipe
    $(".carousel-opinioes").on("swipeleft", function() {
        // Lógica para mover para a próxima opinião
        var currentOpiniao = $(this).find(".opiniao:visible");
        var nextOpiniao = currentOpiniao.next(".opiniao");
        if (nextOpiniao.length === 0) {
            nextOpiniao = $(this).find(".opiniao:first");
        }
        currentOpiniao.hide();
        nextOpiniao.show();
    });

    $(".carousel-opinioes").on("swiperight", function() {
        // Lógica para mover para a opinião anterior
        var currentOpiniao = $(this).find(".opiniao:visible");
        var prevOpiniao = currentOpiniao.prev(".opiniao");
        if (prevOpiniao.length === 0) {
            prevOpiniao = $(this).find(".opiniao:last");
        }
        currentOpiniao.hide();
        prevOpiniao.show();
    });

    // Ajuste a altura do mapa para ser responsiva
    function adjustMapHeight() {
        var mapWidth = $(".mapa-container").width();
        $(".mapa-container iframe").height(mapWidth * 0.75);
    }
    
    $(window).on("resize", adjustMapHeight);
    adjustMapHeight();
});