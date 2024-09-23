$(document).ready(function() {
    var $menuMobile = $('.menu-mobile');
    var $menuIconAberto = $('.menu-mobile-icon-abrir');
    var $menuIconFechado = $('.menu-mobile-icon-fechar');
    var tempoAnimacao = 200;

    function toggleMenu() {
        $menuMobile.slideToggle(tempoAnimacao);
        $menuIconAberto.toggle();
        $menuIconFechado.toggle();
    }

    $menuIconAberto.on('click touchstart', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    $menuIconFechado.on('click touchstart', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Função para rolagem suave
    function scrollToSection(targetSelector) {
        var $target = $(targetSelector);
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top
            }, 800);
        }
    }

    // Rolagem suave para links do menu principal e mobile

    $('.menu-principal .contato a, .menu-mobile ul li:nth-child(2) a').on('click', function(e) {
        e.preventDefault();
        scrollToSection('footer');
        if ($menuMobile.is(':visible')) {
            toggleMenu();
        }
    });

    // Fechar o menu ao clicar fora dele
    $(document).on('click touchstart', function(e) {
        if (!$(e.target).closest('.menu-mobile, .menu-mobile-icon-abrir, .menu-mobile-icon-fechar').length) {
            if ($menuMobile.is(':visible')) {
                toggleMenu();
            }
        }
    });

    // Barra de progresso
    var $progressBar = $('.progress-bar');

    function updateProgressBar() {
        var scrollPosition = $(window).scrollTop();
        var totalHeight = $(document).height() - $(window).height();
        var scrollPercentage = (scrollPosition / totalHeight) * 100;
        
        $progressBar.css('width', scrollPercentage + '%');

        // Verifica se o scroll passou da metade da página
        if (scrollPercentage >= 50) {
            $progressBar.css('background-color', 'black');
        } else {
            $progressBar.css('background-color', '#b52828'); // Cor original
        }
    }

    $(window).on('scroll resize', updateProgressBar);

    // Inicializa a barra de progresso
    updateProgressBar();

    // Adiciona efeito de toque para o botão "Fale Conosco"
    $('.btn-fale-conosco').on('touchstart', function() {
        $(this).css('transform', 'scale(0.95)');
    }).on('touchend', function() {
        $(this).css('transform', 'scale(1)');
    });

    // Rastreamento de cliques no botão "Fale Conosco"
    $('.btn-fale-conosco').on('click', function() {
        fbq('track', 'Lead');
        gtag('event', 'click', {
            'event_category': 'Button',
            'event_label': 'Fale Conosco'
        });
    });

    // Adiciona efeito de toque para o botão "btn-chamada"
    $('.btn-chamada a').on('touchstart', function() {
        $(this).css({
            'transform': 'translateY(2px) scale(0.98)',
            'box-shadow': '0 5px 15px rgba(181, 40, 40, 0.5)'
        });
    }).on('touchend', function() {
        $(this).css({
            'transform': '',
            'box-shadow': ''
        });
    });

    // Adiciona efeito de toque para o botão "btn-localizacao"
    $('.btn-localizacao').on('touchstart', function() {
        $(this).css({
            'background-color': '#b52828',
            'color': '#ffffff',
            'transform': 'translateY(2px)',
            'box-shadow': '0 2px 10px rgba(181, 40, 40, 0.3)'
        });
    }).on('touchend', function() {
        $(this).css({
            'background-color': '',
            'color': '',
            'transform': '',
            'box-shadow': ''
        });
    });
});