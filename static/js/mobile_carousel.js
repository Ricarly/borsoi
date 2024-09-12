$(document).ready(function() {
    var $carousel = $('.carousel-opinioes');
    var $opinioes = $carousel.find('.opiniao');
    var opinionCount = $opinioes.length;
    var currentIndex = 0;
    var interval;
    var touchStartX = 0;
    var touchEndX = 0;

    // Configuração inicial
    function setupCarousel() {
        $opinioes.each(function(index) {
            $(this).css({
                'position': 'absolute',
                'left': (index * 100) + '%'
            });
        });
        updateCarousel();
    }

    // Atualiza a posição do carrossel
    function updateCarousel() {
        $carousel.css('transform', 'translateX(' + (-currentIndex * 100) + '%)');
    }

    // Próxima opinião
    function nextOpinion() {
        currentIndex = (currentIndex + 1) % opinionCount;
        updateCarousel();
    }

    // Opinião anterior
    function prevOpinion() {
        currentIndex = (currentIndex - 1 + opinionCount) % opinionCount;
        updateCarousel();
    }

    // Inicia o carrossel automático
    function startCarousel() {
        interval = setInterval(nextOpinion, 5000);
    }

    // Para o carrossel automático
    function stopCarousel() {
        clearInterval(interval);
    }

    // Manipuladores de eventos para desktop
    $('.nav-button#prev-opiniao').click(function() {
        stopCarousel();
        prevOpinion();
        startCarousel();
    });

    $('.nav-button#next-opiniao').click(function() {
        stopCarousel();
        nextOpinion();
        startCarousel();
    });

    // Manipuladores de eventos para dispositivos móveis
    $carousel.on('touchstart', function(e) {
        touchStartX = e.originalEvent.touches[0].pageX;
        stopCarousel();
    });

    $carousel.on('touchmove', function(e) {
        touchEndX = e.originalEvent.touches[0].pageX;
    });

    $carousel.on('touchend', function(e) {
        var swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextOpinion();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevOpinion();
        }
        startCarousel();
    });

    // Pausa o carrossel quando o mouse está sobre ele (para desktop)
    $carousel.hover(stopCarousel, startCarousel);

    // Inicialização
    setupCarousel();
    startCarousel();

    // Ajusta o carrossel quando a janela é redimensionada
    $(window).resize(function() {
        updateCarousel();
    });
});
