$(document).ready(function () {
    headerFixed();
    tabsInit();
    dynamicAppendInit();
    accordion();

    $(".header__burger").on("click", function () {
        $(".header-mobile").toggleClass("active");
        if ($(".header-mobile").hasClass("active")) {
            $("body").addClass("locked");
        } else {
            $("body").removeClass("locked");
        }
    });

    // Form Validation ***************************
    $(".form-ajax-submit").on("submit", function (e) {
        e.preventDefault();

        let form = $(this);
        let url = $(this).attr("data-url");
        let isValid = true;
        // let email = $(this).find(".email-validation");
        // let errorHtml = `<div class="form-field__message error">Wrong email, please set correct email address</div>`;

        // $(this).find(".form-field__message.error").remove();
        // $(this).find(".form-field.invalid").removeClass("invalid");

        // if (email.length) {
        //     if (!isEmailValid(email.val())) {
        //         form.find(".email-validation").closest(".form-field").addClass("invalid").append(errorHtml);
        //         isValid = false;
        //     }
        // }

        if (isValid) {
            form.addClass("fetching");

            $.post(url, $(this).serializeArray(), function (data) {
                if (data.hasOwnProperty("success")) {
                    const { csrf_name, csrf_name_key, csrf_value, csrf_value_key } = data.success;

                    $(".csrf-name").each(function () {
                        $(this).val(csrf_name);
                    });
                    $(".csrf-value").each(function () {
                        $(this).val(csrf_value);
                    });

                    form.removeClass("fetching");
                    if (form.closest(".modal").length) {
                        form.closest(".modal").addClass("success");
                    } else {
                        toastMessage(data.message, "success");
                    }
                    form.find("select[required], input[required]").val("");
                    form.find("input[type='checkbox'][required]").prop("checked", false);
                    form.find(".form-item").removeClass("filled focused");
                    form.find(".combo-box-selected").html("<span></span>");
                } else {
                    form.removeClass("fetching");
                    const { csrf_name, csrf_name_key, csrf_value, csrf_value_key } = data.csrf;

                    $(".csrf-name").each(function () {
                        $(this).val(csrf_name);
                    });
                    $(".csrf-value").each(function () {
                        $(this).val(csrf_value);
                    });

                    if (data.message) {
                        toastMessage(data.message, "error");
                    } else if (data["g-recaptcha-response"]) {
                        toastMessage(data["g-recaptcha-response"], "error");
                    } else {
                        toastMessage("Something went wrong, try again later", "error");
                    }
                }
            });
        }
    });

    function validateFields() {
        let allValid = true;

        $(".form-validate")
            .find(".form-item select[required], .form-item input[required], input[type='checkbox'][required]")
            .each(function () {
                let isValid;

                if ($(this).is("input[type='checkbox']")) {
                    isValid = $(this).is(":checked");
                } else {
                    isValid = $(this).val() !== "";
                }

                if (!isValid) {
                    allValid = false;
                    return false;
                }
            });

        if (allValid) {
            $(".form-validate").find(".btn").removeClass("disabled");
        } else {
            $(".form-validate").find(".btn").addClass("disabled");
        }
    }

    $(".form-validate").find(".form-item select[required], .form-item input[required], input[type='checkbox'][required]").on("change input", validateFields);

    $(".combo-option").on("click", function () {
        let all_selected_elements = [];
        $(".filtred-column").each(function () {
            if ($(this).attr("data-combo-value") != "all") {
                all_selected_elements.push($(this));
            }
        });
        if (all_selected_elements.length) {
            if ($(".filtred-data-content").hasClass("games")) {
                $.map($(".filtred-data-content a"), function (element, i) {
                    let all_options = [];

                    $(all_selected_elements).each(function () {
                        let search = $(this).attr("data-combo-value").toLowerCase();
                        let type = $(this).attr("data-combo-type");
                        all_options.push(findSearchData($(element), search, type));
                    });

                    if ($(element).hasClass("game-large")) {
                        $(element).removeClass("game--lg");
                    }

                    if (all_options.includes(false)) {
                        $(element).addClass("hide");
                    } else {
                        $(element).removeClass("hide");
                    }
                });
            }
        } else {
            if ($(".filtred-data-content").hasClass("games")) {
                $.map($(".filtred-data-content a"), function (element, i) {
                    if ($(element).hasClass("game-large")) {
                        $(element).addClass("game--lg");
                    }
                    $(element).removeClass("hide");
                });
            }
        }
    });

    $("select[name='type'], select[name='category']").change(function () {
        var typeSelect = $("select[name='type']").val();
        var categorySelect = $("select[name='category']").val();
        if ((typeSelect === "all" || typeSelect === "") && (categorySelect === "all" || categorySelect === "")) {
            $(".games").removeClass("search-data");
        } else {
            $(".games").addClass("search-data");
        }
    });

    if ($(".features-accordions").length) {
        let imageUrl = $(".features-accordions").find(".accordion__wrap:first .accordion__toggle").data("image");
        $(".features__img img").attr("src", imageUrl);
        $(".features-accordions").find($(".accordion__wrap:first").addClass("open").find(".accordion__toggle").addClass("active").next(".accordion__content").slideDown(300));
    }

    //Swipers

    $(".testimonials__slider").slick({
        slidesToShow: 2,
        infinite: false,
        speed: 300,
        prevArrow: $(".testimonials__prev"),
        nextArrow: $(".testimonials__next"),
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });
    //

    //Our Partners Swiper
    $(".our-partners__slider").slick({
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 3000,
        pauseOnHover: false,
        cssEase: "linear",
        variableWidth: true,
        arrows: false,
        dots: false,
        draggable: false,
        swipe: false,
        touchMove: false,
    });
    //

    //Games Swiper

    $(".offer-games__slider").slick({
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 3000,
        pauseOnHover: false,
        cssEase: "linear",
        variableWidth: true,
        arrows: false,
        dots: false,
        draggable: false,
        swipe: false,
        touchMove: false,
    });
    //
    let promoSliderConfig = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        prevArrow: $(".promo__prev"),
        nextArrow: $(".promo__next"),
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                    variableWidth: false,
                },
            },
        ],
    };

    // Check if .promo__slider-info exists
    if ($(".promo__slider-info").length) {
        promoSliderConfig.asNavFor = ".promo__slider-info";
    }

    // Initialize the slider with the config
    $(".promo__slider").slick(promoSliderConfig);

    $(".promo__slider-info").slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: false,
        prevArrow: $(".promo__prev"),
        nextArrow: $(".promo__next"),
        asNavFor: ".promo__slider",
        dots: false,
    });
    //

    $(".game-find__slider").slick({
        slidesToShow: 3,
        infinite: true,
        speed: 300,
        autoplay: false,
        asNavFor: ".game-find__slider-second",
        dots: false,
        prevArrow: $(".game-find__prev"),
        nextArrow: $(".game-find__next"),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    variableWidth: true,
                },
            },
        ],
    });

    $(".game-find__slider-second").slick({
        slidesToShow: 4,
        infinite: true,
        speed: 300,
        autoplay: false,
        asNavFor: ".game-find__slider",
        rtl: true,
        dots: false,
        prevArrow: $(".game-find__prev"),
        nextArrow: $(".game-find__next"),
    });

    $(".game-find__slider-mobile").slick({
        slidesToShow: 3,
        infinite: true,
        speed: 300,
        autoplay: false,
        dots: false,
        variableWidth: true,
    });

    $(".client__slider").slick({
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        prevArrow: $(".client__prev"),
        nextArrow: $(".client__next"),
        dots: true,
        infinite: false,
        draggable: false,
        swipe: false,
        touchMove: false,
        appendDots: $(".client__dots"),
        customPaging: function (slick, index) {
            return '<div class="client__progress swiper-dots__progress"></div>';
        },
    });

    $(".recap__slider").slick({
        slidesToScroll: 1,
        dots: true,
        variableWidth: true,
        infinite: true,
        autoplay: true,
        speed: 100,
        draggable: false,
        swipe: false,
        touchMove: false,
        prevArrow: $(".recap__prev"),
        nextArrow: $(".recap__next"),
        appendDots: $(".recap__dots"),
        customPaging: function (slick, index) {
            return '<div class="recap__progress swiper-dots__progress"></div>';
        },
    });

    //

    $(".features-accordion__toggle").click(function (e) {
        $(".features__img img").attr("src", $(this).data("image"));
    });

    // MODAL ***************************
    $("[data-modal]").on("click", function () {
        let targetModal = $(`.${$(this).attr("data-modal")}`);
        targetModal.addClass("active");

        ScrollNone();
    });

    $(".modal-close").on("click", function () {
        $(this).closest(".modal").removeClass("active");

        ScrollNone();
    });

    // TOAST ****************************
    $(".toast-trigger").on("click", function () {
        toastMessage("Toast Message", "default");
    });

    // SWITCHER *************************
    $(".switcher__item").on("click", function () {
        if (!$(this).closest(".switcher").hasClass("switcher_multiple")) {
            $(this).closest(".switcher").find(".switcher__item").removeClass("active");
            $(this).addClass("active");
        } else {
            $(this).toggleClass("active");
        }
    });

    // FORM ITEMS *********************
    $(".form-item__input").each(function () {
        if ($(this).val().trim().length) {
            $(this).closest(".form-item").addClass("filled");
        }
    });

    $(".form-item__input").on("keyup", function () {
        let val = $(this).val().trim();

        if (val.length) {
            $(this).closest(".form-item").addClass("filled");
        } else {
            $(this).closest(".form-item").removeClass("filled");
        }
    });

    $(".form-item__input").on("focus", function () {
        $(this).closest(".form-item").addClass("focused");
    });

    $(".form-item__input").on("focusout", function () {
        $(this).closest(".form-item").removeClass("focused");
    });

    $(".form-item select").on("change", function () {
        $(this).closest(".form-item").addClass("focused");
    });

    $("#show-all-partners").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(".our-partners__block").removeClass("show");
        } else {
            $(this).addClass("active");
            $(".our-partners__block").addClass("show");
        }
    });

    function homeSlider() {
        $(".home-swiper__info").slick({
            slidesToShow: 1,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            asNavFor: ".home-swiper__img, .home-swiper__btn",
            prevArrow: $(".home-swiper__prev"),
            nextArrow: $(".home-swiper__next"),
            dots: true,
            appendDots: $(".home-swiper__dots"),
            draggable: false,
            swipe: false,
            touchMove: false,
            customPaging: function (slick, index) {
                return '<div class="home-swiper__index swiper-dots__index">' + "0" + (index + 1) + "</div>" + '<div class="home-swiper__progress swiper-dots__progress"></div>';
            },
        });
        $(".home-swiper__img").slick({
            slidesToShow: 1,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            asNavFor: ".home-swiper__info, .home-swiper__btn",
            prevArrow: $(".home-swiper__prev"),
            nextArrow: $(".home-swiper__next"),
            rtl: true,
            draggable: false,
            swipe: false,
            touchMove: false,
        });
        $(".home-swiper__btn").slick({
            slidesToShow: 1,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            asNavFor: ".home-swiper__info, .home-swiper__img",
            prevArrow: $(".home-swiper__prev"),
            nextArrow: $(".home-swiper__next"),
            draggable: false,
            swipe: false,
            touchMove: false,
        });
    }

    if ($("#home").length) {
        if ($(window).width() <= 1023) {
            homeSlider();
        } else {
            function checkScreenSize() {
                let screenWidth = $(window).width();

                if (screenWidth > 1600) {
                    imgWidth = rem(1000);
                    imgHeight = rem(562);
                    logoScale = 1.61538461538;
                } else if (screenWidth > 1439) {
                    imgWidth = rem(1000);
                    imgHeight = rem(562);
                    logoScale = 1.4;
                } else if (screenWidth > 1200) {
                    imgWidth = rem(712);
                    imgHeight = rem(400);
                    logoScale = 1.2;
                } else {
                    imgWidth = rem(712);
                    imgHeight = rem(400);
                    logoScale = 1.1;
                }

                return { imgHeight, imgWidth, logoScale };
            }

            let dimensions = checkScreenSize();

            checkScreenSize();

            setTimeout(() => {
                $(".animation, .animation-bg").css("transform", "translateY(100%)");
            }, 500);

            $(".home-top").css("z-index", "1");
            $(".home-swiper__nav").css("opacity", "1");
            $(".home-swiper__img").css({
                width: dimensions.imgWidth,
                height: dimensions.imgHeight,
                right: 0,
                left: "initial",
                borderRadius: `${rem(40)} 0 0 ${rem(40)}`,
                transform: "none",
            });
            $(".home-swiper__img img, .home-swiper__img video").css({
                width: "100%",
                height: "100%",
                top: 0,
                left: "initial",
                borderRadius: `${rem(40)} 0 0 ${rem(40)}`,
            });
            $(".home-swiper__title").css("text-align", "left");
            $(".home-swiper__title div span").css("transform", "none");
            $(".home-swiper__info").css({ position: "static", "margin-top": "0" });
            homeSlider();

            // if (!sessionStorage.getItem("animationPlayed")) {
            //     window.scrollTo(0, 0);

            //     $("body").css("overflow", "hidden");

            //     const defaultDelay = 1.5;
            //     const defaultDuration = 1;

            //     let numberOfItems = $(".home-swiper__info").children().length;

            //     let $sliderDots = $('<ul class="slick-dots"></ul>');
            //     for (let i = 1; i <= numberOfItems; i++) {
            //         let index = i.toString().padStart(2, "0");
            //         $sliderDots.append("<li>" + '<div class="home-swiper__index swiper-dots__index">' + index + "</div>" + '<div class="home-swiper__progress swiper-dots__progress"></div>' + "</li>");
            //     }

            //     $("#dots-container").append($sliderDots);

            //     gsap.timeline({
            //         onComplete: function () {
            //             sessionStorage.setItem("animationPlayed", "true");
            //             $("body").css("overflow", "initial");
            //             $(".home-swiper__dots").attr("id", "").children().remove();
            //             homeSlider();
            //         },
            //     })

            //         .from(".animation__line--light", { height: 0, duration: 1.2, delay: 0.5 }, "first-step")
            //         .from(".animation__line--dark", { height: 0, duration: 1.5, delay: 0.7 }, "first-step")
            //         .to(".animation__logo svg path", { transform: "translateY(0)", duration: 0.5, delay: 1.5, stagger: { from: "edges", amount: 0.3 } }, "first-step")
            //         .to(".animation__line--dark", { duration: 1.5, backgroundColor: "#88DCFA" }, "second-step")
            //         .to(".animation__logo", { opacity: 0, scale: dimensions.logoScale, duration: 2 }, "second-step")
            //         .to(".animation__video", { scale: dimensions.logoScale, duration: 2 }, "second-step")
            //         .from(".animation__video", { opacity: 0, duration: 1.5 }, "second-step")
            //         .to(".animation__video", { opacity: 0, scale: 0.7, duration: 1.5 }, "third-step")
            //         .to(".animation", { opacity: 0, duration: 1.5 }, "third-step")
            //         .to(".animation", { display: "none" }, "fourth-step")
            //         .to(".home-swiper__img", { width: dimensions.imgWidth, height: dimensions.imgHeight, top: 0, duration: 1.5, borderRadius: rem(40) }, "fourth-step")
            //         .to(".home-swiper__title div span", { transform: "translateY(0)", duration: 1.5 }, "fourth-step")
            //         .to(".home-swiper__img img, video", { width: "100%", height: "100%", top: 0, duration: 1.5 }, "fourth-step")
            //         .from(".home-top", { paddingTop: 0, duration: 1.5 }, "fourth-step")
            //         .to(".home-swiper__img img, video", { borderRadius: rem(40), duration: 1.5 }, "fourth-step")
            //         .to(".home-swiper__img", { left: "initial", transform: "none", right: "0", duration: 1.5 }, "fifth-step")
            //         .fromTo(".animation-bg", { "--top": "0", opacity: 1, duration: 1.5 }, { "--top": "100%", opacity: 1, duration: 1.5 }, "fifth-step")
            //         .fromTo(".home-top", { "--opacity": "0", duration: 0.5 }, { "--opacity": "1", duration: 0.5 }, "fifth-step")
            //         .to(".home-swiper__img", { borderRadius: `${rem(40)} 0 0 ${rem(40)}`, duration: 1.5 }, "fifth-step")
            //         .to(".home-swiper__img img, video", { borderRadius: `${rem(40)} 0 0 ${rem(40)}`, duration: 1.5 }, "fifth-step")
            //         .from(".home-swiper__nav", { opacity: 0, duration: 1.5 }, "fifth-step")
            //         .to(".home-swiper__info", { left: rem(12), marginTop: 0, duration: 1.5 }, "fifth-step")
            //         .to(".home-swiper__title", { textAlign: "left", duration: 1.5 }, "fifth-step")
            //         .from(".home-swiper__subtitle", { opacity: 0, yPercent: 10, xPercent: 10, duration: 1.5 }, "fifth-step")
            //         .from(".home-swiper__dots", { opacity: 0, y: -100, x: 200, duration: 1.5 }, "fifth-step")
            //         .from(".home-swiper__btn", { opacity: 0, scale: 0, yPercent: 10, xPercent: 10, duration: 1.5 }, "fifth-step")
            //         .to(".home-top", { zIndex: 1 }, "fifth-step")
            //         .from(".what-we-do__img, .what-we-do__info", { opacity: 0, duration: 1.5 }, "fifth-step")
            //         .to(".animation-bg", { display: "none" }, "sixth-step")
            //         .to(".home-swiper__info", { position: "static" }, "sixth-step");
            // } else {
            //     setTimeout(() => {
            //         $(".animation, .animation-bg").css("transform", "translateY(100%)");
            //     }, 500);

            //     $(".home-top").css("z-index", "1");
            //     $(".home-swiper__nav").css("opacity", "1");
            //     $(".home-swiper__img").css({
            //         width: dimensions.imgWidth,
            //         height: dimensions.imgHeight,
            //         right: 0,
            //         left: "initial",
            //         borderRadius: `${rem(40)} 0 0 ${rem(40)}`,
            //         transform: "none",
            //     });
            //     $(".home-swiper__img img, .home-swiper__img video").css({
            //         width: "100%",
            //         height: "100%",
            //         top: 0,
            //         left: "initial",
            //         borderRadius: `${rem(40)} 0 0 ${rem(40)}`,
            //     });
            //     $(".home-swiper__title").css("text-align", "left");
            //     $(".home-swiper__title div span").css("transform", "none");
            //     $(".home-swiper__info").css({ position: "static", "margin-top": "0" });
            //     homeSlider();
            // }
        }
    }

    // sessionStorage.removeItem('userSettings');

    if ($("#ice").length) {
        let $window = $(window),
            $header = $("header"),
            headerHeight = $(".header").outerHeight();

        function toggleStickyHeader() {
            let scroll = $window.scrollTop();
            $header.toggleClass("sticky", scroll >= headerHeight);
        }
        toggleStickyHeader();
        $window.scroll(toggleStickyHeader);
    }

    $(".btn-scroll").click(function () {
        let target = $(this).data("link");
        if (target === "book") {
            $("html, body").animate(
                {
                    scrollTop: $("#" + target).offset().top - $(".header").outerHeight() - 20,
                },
                100
            );
        } else {
            $("html, body").animate(
                {
                    scrollTop: $("#" + target).offset().top - 20,
                },
                100
            );
        }
    });

    $(".copy-link").click(function (e) {
        e.preventDefault();
        var copyText = window.location.href;
        document.addEventListener(
            "copy",
            function (e) {
                e.clipboardData.setData("text/plain", copyText);
                e.preventDefault();
            },
            true
        );
        document.execCommand("copy");
        successToast($(this).data("success"));
    });

    // REMOVE ACTIVE CLASSES *******************************
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".modal-trigger, .modal__wrapper").length) {
            $(".modal").removeClass("active");

            // ScrollNone();
        }

        if ($(e.target).closest(".toast-close").length) {
            removeToast($(e.target));
        }

        e.stopPropagation();
    });
});

// Scroll
$(window).scroll(function () {
    headerFixed();
});

function findSearchData(element, search, type) {
    if (
        element.attr("data-" + type) != "" &&
        element.attr("data-" + type) != undefined &&
        element
            .attr("data-" + type)
            .toLowerCase()
            .search(search) != -1
    ) {
        return true;
    }

    return false;
}
