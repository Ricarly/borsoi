$(document).ready(function() {
    const slides = $('.depoimento-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function showSlide(index) {
        slides.removeClass('active').fadeOut(300);
        slides.eq(index).addClass('active').fadeIn(300);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    $('.btn-proximo').on('click touchend', function(e) {
        e.preventDefault();
        nextSlide();
    });

    $('.btn-anterior').on('click touchend', function(e) {
        e.preventDefault();
        prevSlide();
    });

    // Iniciar o carrossel
    showSlide(currentSlide);

    // Transição automática
    let autoSlideInterval = setInterval(nextSlide, 7000);

    // Parar a transição automática quando o mouse estiver sobre o carrossel
    $('.carrossel-depoimentos').on('mouseenter touchstart', function() {
        clearInterval(autoSlideInterval);
    }).on('mouseleave touchend', function() {
        autoSlideInterval = setInterval(nextSlide, 7000);
    });

    // Suporte a gestos de swipe
    $('.carrossel-depoimentos').on('touchstart', function(e) {
        touchStartX = e.originalEvent.touches[0].clientX;
    });

    $('.carrossel-depoimentos').on('touchend', function(e) {
        touchEndX = e.originalEvent.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }
});
