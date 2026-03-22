(function ($) {
  "use strict";

    // Load components
    // Load components
    var componentsToLoad = 0;
    var loadedComponents = 0;

    function checkInit() {
        loadedComponents++;
        if (loadedComponents === componentsToLoad) {
            initializeSite();
        }
    }

    var headerPlaceholder = $('#header-placeholder');
    var mobileMenuPlaceholder = $('#mobile-menu-placeholder');
    var footerPlaceholder = $('#footer-placeholder');

    if (headerPlaceholder.length) {
        componentsToLoad++;
        var layout = headerPlaceholder.data('layout') || 1;
        headerPlaceholder.load('components/header-v' + layout + '.html', checkInit);
    }

    if (mobileMenuPlaceholder.length) {
        componentsToLoad++;
        mobileMenuPlaceholder.load('components/mobile-menu.html', checkInit);
    }

    if (footerPlaceholder.length) {
        // Footer doesn't need to block init strictly, but for consistency we can include it or just load it
        // If we want it to verify existence:
        footerPlaceholder.load('components/footer.html');
        // Note: I'm not adding footer to componentsToLoad to avoid blocking site init if footer is slow/optional,
        // or we can add it. Previous code didn't wait for footer. Let's keep it non-blocking.
    }

    if (componentsToLoad === 0) {
        initializeSite();
    }

    // Desktop Menu Click Support (using event delegation for dynamically loaded content)
    // This must be outside initializeSite() to ensure it's only attached once
    $(document).on('click', '.main-menu a, .main-menu3 a', function(e) {
        var $link = $(this);
        var $parent = $link.parent();
        var href = $link.attr('href');
        
        // ONLY handle parent menu items with placeholder hrefs (#, #!, empty)
        if ($parent.hasClass('menu-item-has-children') && (href === '#' || href === '#!' || href === '' || !href)) {
            e.preventDefault();
            
            var $submenu = $link.siblings('ul.sub-menu');
            if ($submenu.length) {
                $submenu.toggleClass('js-open');
                $submenu.stop(true, true).slideToggle(300);
            }
            return false;
        }
        
        // For real links - explicitly navigate
        if (href && href !== '#' && href !== '#!' && href !== '') {
            window.location.href = href;
            return false;
        }
    });

  // Function to initialize all the site scripts
  function initializeSite() {
    setActiveMenu();

    /*---------- Set Active Menu  ----------*/
    function setActiveMenu() {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if (page === "" || page === "index.html" || page === "index") {
            page = "index.html";
        }

        // Remove existing active classes from menu links
        $('.main-menu li a, .global-mobile-menu li a, .main-menu3 li a').removeClass('active');

        // Allow multiple matches
        var selector = '.main-menu li a[href="' + page + '"], .global-mobile-menu li a[href="' + page + '"], .main-menu3 li a[href="' + page + '"]';
        var $link = $(selector);

        $link.addClass('active');

        // Add active class to parent dropdowns
        $link.closest('.menu-item-has-children').children('a').addClass('active');
        $link.closest('.menu-item-has-children').parents('.menu-item-has-children').children('a').addClass('active');
    }

    /*---------- Mobile Menu  ----------*/
    $.fn.globalmobilemenu = function (options) {
      var opt = $.extend(
        {
          menuToggleBtn: ".global-menu-toggle",
          bodyToggleClass: "global-body-visible",
          subMenuClass: "global-submenu",
          subMenuParent: "menu-item-has-children",
          globalSubMenuParent: "menu-item-has-children",
          subMenuParentToggle: "global-active",
          meanExpandClass: "global-mean-expand",
          appendElement: '<span class="global-mean-expand"></span>',
          subMenuToggleClass: "global-open",
          toggleSpeed: 400,
        },
        options
      );

      return this.each(function () {
        var menu = $(this); // Select menu

        // Menu Show & Hide
        function menuToggle() {
          menu.toggleClass(opt.bodyToggleClass);

          // collapse submenu on menu hide or show
          var subMenu = "." + opt.subMenuClass;
          $(subMenu).each(function () {
            if ($(this).hasClass(opt.subMenuToggleClass)) {
              $(this).removeClass(opt.subMenuToggleClass);
              $(this).css("display", "none");
              $(this).parent().removeClass(opt.subMenuParentToggle);
            }
          });
        }

        // Class Set Up for every submenu
        menu.find("." + opt.subMenuParent).each(function () {
          var submenu = $(this).find("ul");
          submenu.addClass(opt.subMenuClass);
          submenu.css("display", "none");
          $(this).addClass(opt.subMenuParent);
          $(this).addClass(opt.globalSubMenuParent); // Add menu-item-has-children class
          $(this).children("a").append(opt.appendElement);
        });

        // Toggle Submenu
        function toggleDropDown($element) {
          var submenu = $element.children("ul");
          if (submenu.length > 0) {
            $element.toggleClass(opt.subMenuParentToggle);
            submenu.slideToggle(opt.toggleSpeed);
            submenu.toggleClass(opt.subMenuToggleClass);
          }
        }

        // Submenu toggle Button
        var itemHasChildren = "." + opt.globalSubMenuParent;
        $(itemHasChildren).off("click").on("click", function (e) {
            if ($(e.target).closest("." + opt.subMenuClass).length > 0) {
                return;
            }
            e.preventDefault();
            toggleDropDown($(this));
        });

        // Menu Show & Hide On Toggle Btn click
        $(opt.menuToggleBtn).off("click").on("click", function () {
          menuToggle();
        });

        // Hide Menu On outside click
        menu.on("click", function (e) {
          e.stopPropagation();
          menuToggle();
        });


        // Stop Hide full menu on menu click
        menu.on("click", function (e) {
          e.stopPropagation();
        });

        // Prevent submenu from hiding when clicking inside the menu
        menu.find("div").on("click", function (e) {
          e.stopPropagation();
        });
      });
    };

    $(".global-menu-wrapper").globalmobilemenu();



    /*---------- Sticky fix ----------*/
    $(window).scroll(function () {
      var topPos = $(this).scrollTop();
      if (topPos > 10) {
        $('.sticky-wrapper').addClass('sticky');
        $('.category-menu').addClass('close-category');
      } else {
        $('.sticky-wrapper').removeClass('sticky')
        $('.category-menu').removeClass('close-category');
      }
    })

    $(window).scroll(function () {
      var topPos = $(this).scrollTop();
      if (topPos > 10) {
        $('.sticky-wrapper2').addClass('sticky');
        $('.category-menu').addClass('close-category');
      } else {
        $('.sticky-wrapper2').removeClass('sticky')
        $('.category-menu').removeClass('close-category');
      }
    })

    // After
    $('.menu-expand').on('click', function (e) {
      e.preventDefault();
      $('.category-menu').toggleClass('open-category');
    });



    /*---------- Popup Sidemenu ----------*/
    function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {

      $($sideMunuOpen).on('click', function (e) {
        e.preventDefault();
        $($sideMenu).addClass($toggleCls);
      });
      $($sideMenu).on('click', function (e) {
        e.stopPropagation();
        $($sideMenu).removeClass($toggleCls)
      });
      var sideMenuChild = $sideMenu + ' > div';
      $(sideMenuChild).on('click', function (e) {
        e.stopPropagation();
        $($sideMenu).addClass($toggleCls)
      });

      $($sideMenuCls).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $($sideMenu).removeClass($toggleCls);
      });
    };


    popupSideMenu('.sidemenu-cart', '.sideMenuToggler', '.sideMenuCls', 'show');
    popupSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');


    /*-----------------------------------
           Wow Animation 
        -----------------------------------*/
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }


    /*-----------------------------------
           Set Background Image & Mask   
        -----------------------------------*/
    if ($("[data-bg-src]").length > 0) {
      $("[data-bg-src]").each(function () {
        var src = $(this).attr("data-bg-src");
        $(this).css("background-image", "url(" + src + ")");
        $(this).removeAttr("data-bg-src").addClass("background-image");
      });
    }

    if ($("[data-mask-src]").length > 0) {
      $("[data-mask-src]").each(function () {
        var mask = $(this).attr("data-mask-src");
        $(this).css({
          "mask-image": "url(" + mask + ")",
          "-webkit-mask-image": "url(" + mask + ")",
        });
        $(this).addClass("bg-mask");
        $(this).removeAttr("data-mask-src");
      });
    }


    /*-----------------------------------
           Back to top    
        -----------------------------------*/
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 20) {
        $("#back-top").addClass("show");
      } else {
        $("#back-top").removeClass("show");
      }
    });

    $(document).on("click", "#back-top", function () {
      $("html, body").animate({ scrollTop: 0 }, 800);
      return false;
    });



    /*-----------------------------------
            MagnificPopup  view    
    -----------------------------------*/
    if ($(".popup-video").length) {
      $(".popup-video").magnificPopup({
        type: "iframe",
        removalDelay: 260,
        mainClass: "mfp-zoom-in",
      });
    }

    if ($(".popup-img").length) {
      $(".popup-img").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });
    }



    /*-----------------------------------
             NiceSelect     
    -----------------------------------*/
    if ($(".nice-select").length) {
      $(".nice-select").niceSelect();
    }


    /*---------- Popup Sidemenu ----------*/
    // (Redundant call removed or kept if necessary logic differs, keeping consistent with original logic structure)
    popupSideMenu('.sidemenu-cart', '.sideMenuToggler', '.sideMenuCls', 'show');
    popupSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');


    /*-----------------------------------
           Mouse Cursor    
    -----------------------------------*/
    function mousecursor() {
      if ($("body")) {
        const e = document.querySelector(".cursor-inner"),
          t = document.querySelector(".cursor-outer");
        let n,
          i = 0,
          o = !1;
        
        if(e && t) {
            (window.onmousemove = function (s) {
            o ||
                (t.style.transform =
                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                (e.style.transform =
                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                (n = s.clientY),
                (i = s.clientX);
            }),
            $("body").on("mouseenter", "a, .cursor-pointer", function () {
                e.classList.add("cursor-hover");
                t.classList.add("cursor-hover");
            }),
            $("body").on("mouseleave", "a, .cursor-pointer", function () {
                ($(this).is("a") && $(this).closest(".cursor-pointer").length) ||
                (e.classList.remove("cursor-hover"),
                    t.classList.remove("cursor-hover"));
            }),
            (e.style.visibility = "visible"),
            (t.style.visibility = "visible");
        }
      }
    }
    $(function () {
      mousecursor();
    });


    /*-----------------------------------
        Progress Bar   
    -----------------------------------*/
    $('.progress-bar').each(function () {
      var $this = $(this);
      var progressWidth = $this.attr('style').match(/width:\s*(\d+)%/)[1] + '%';

      $this.waypoint(function () {
        $this.css({
          '--progress-width': progressWidth,
          'animation': 'animate-positive 1.8s forwards',
          'opacity': '1'
        });
      }, { offset: '75%' });
    });



    /*-----------------------------------
          Text Splitting
    -----------------------------------*/
    if (typeof Splitting !== 'undefined') {
        Splitting();
    }



    // Service Slider
    if ($('.service1-slider').length) {
        var swiper = new Swiper('.service1-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 60,
        autoplay: true,
        loop: false,
        });
    }



    // Brand Slider
    if ($('.brand1-slider').length) {
        var swiper = new Swiper('.brand1-slider', {
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        on: {
            init: function () {
            updateSlideClasses();
            },
            slideChangeTransitionStart: function () {
            updateSlideClasses();
            }
        },
        breakpoints: {
            // Small devices (up to 576px)
            0: {
            slidesPerView: 1,
            },
            // Medium devices (576px and up)
            576: {
            slidesPerView: 2,
            },
            // Large devices (768px and up)
            768: {
            slidesPerView: 3,
            },
            // Extra large devices (992px and up)
            992: {
            slidesPerView: 4,
            },
            // XXL devices (1200px and up)
            1200: {
            slidesPerView: 5,
            },
            // Ultra large screens (1400px and up)
            1400: {
            slidesPerView: 6,
            }
        }
        });
    }

    // Function to add 'odd' and 'even' classes based on slide index
    function updateSlideClasses() {
      document.querySelectorAll('.swiper-slide').forEach((slide, index) => {
        slide.classList.remove('odd', 'even');
        if (index % 2 === 0) {
          slide.classList.add('even');
        } else {
          slide.classList.add('odd');
        }
      });
    }

    // Brand Slider
    if ($('.brand2-slider').length) {
        var swiper = new Swiper('.brand2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: true,

        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 6,
            spaceBetween: 30,
            },
        },
        });
    }

    // Testimonial Slider
    if ($('.testimonial1-slider').length) {
        var swiper = new Swiper('.testimonial1-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.testimonial1-card-controls__arrowRight',
            prevEl: '.testimonial1-card-controls__arrowLeft',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        });
    }



    // wprocess-slider
    if ($('.wprocess-slider').length) {
        var swiper = new Swiper('.wprocess-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 1,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 1,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: '.element-controls__arrowRight',
            prevEl: '.element-controls__arrowLeft',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },

        });
    }


    // Brand-slider2
    if ($('.partner2-slider').length) {
        var swiper = new Swiper('.partner2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
            slidesPerView: 2,
            spaceBetween: 20,
            },
            640: {
            slidesPerView: 3,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 5,
            spaceBetween: 30,
            },
        },

        });
    }

    // Course-slider1
    if ($('.course1-slider').length) {
        var swiper = new Swiper('.course1-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        });
    }

    
    // Course-slider2
    if ($('.course2-slider').length) {
        var swiper = new Swiper('.course2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: ".course2-slider .swiper-next",
            prevEl: ".course2-slider .swiper-prev",
        }

        });
    }


    // Live Course2 Card Slider 
    if ($('.live-course2-card-slider').length) {
        var LiveCourseSlider = new Swiper(".live-course2-card-slider", {
        effect: "cards",
        grabCursor: true,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        });
    }


    if ($('.event-slider').length) {
        var swiper = new Swiper('.event-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            640: {
            slidesPerView: 2,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: ".event-details-slider .swiper-next",
            prevEl: ".event-details-slider .swiper-prev",
        }

        });
    }

    if ($('.team1-slider').length) {
        var swiper = new Swiper('.team1-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            640: {
            slidesPerView: 2,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: ".team1-slider .swiper-next",
            prevEl: ".team1-slider .swiper-prev",
        }

        });
    }

    if ($('.team2-slider').length) {
        var swiper = new Swiper('.team2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 1,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 1,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 1.5,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: ".team2-slider .swiper-next",
            prevEl: ".team2-slider .swiper-prev",
        }

        });
    }

    if ($('.testimonial2-slider').length) {
        var swiper = new Swiper('.testimonial2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 1,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
        },

        navigation: {
            nextEl: ".testimonial2 .swiper-next",
            prevEl: ".testimonial2 .swiper-prev",
        }

        });
    }

    if ($('.blog1-slider').length) {
        var swiper2 = new Swiper('.blog1-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        });
    }

    if ($('.blog2-slider').length) {
        var swiper = new Swiper('.blog2-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
            slidesPerView: 1,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1024: {
            slidesPerView: 2,
            spaceBetween: 30,
            },
            1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            },
            1400: {
            slidesPerView: 4,
            spaceBetween: 30,
            },
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

    });
    }

    // Load courses from JSON for course2 slider
    loadCourses2();

    function loadCourses2() {
        var $courseSlider = $('.course2-slider');
        if (!$courseSlider.length) return;

        var $swiperWrapper = $courseSlider.find('.swiper-wrapper');
        if (!$swiperWrapper.length) return;

        $.getJSON('assets/data/courses.json', function(data) {
            if (!data.courses || !data.courses.length) return;

            // Clear existing slides
            $swiperWrapper.empty();

            // SVG icons for meta items
            var studentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99992 3.29184C7.74738 2.8023 7.36499 2.3917 6.89463 2.10502C6.42427 1.81834 5.88409 1.66662 5.33325 1.6665C3.67759 1.6665 2.33325 3.01084 2.33325 4.6665C2.33325 6.32217 3.67759 7.6665 5.33325 7.6665C5.88409 7.66638 6.42427 7.51467 6.89463 7.22799C7.36499 6.94131 7.74738 6.53071 7.99992 6.04117C8.2524 6.53076 8.63478 6.9414 9.10515 7.22809C9.57552 7.51478 10.1157 7.66646 10.6666 7.6665C12.3223 7.6665 13.6666 6.32217 13.6666 4.6665C13.6666 3.01084 12.3223 1.6665 10.6666 1.6665C10.1157 1.66662 9.57556 1.81834 9.10521 2.10502C8.63485 2.3917 8.25246 2.8023 7.99992 3.29184ZM10.6666 2.33317C11.9543 2.33317 12.9999 3.37884 12.9999 4.6665C12.9999 5.95417 11.9543 6.99984 10.6666 6.99984C9.37892 6.99984 8.33325 5.95417 8.33325 4.6665C8.33325 3.37884 9.37892 2.33317 10.6666 2.33317ZM5.33325 2.33317C6.62092 2.33317 7.66659 3.37884 7.66659 4.6665C7.66659 5.95417 6.62092 6.99984 5.33325 6.99984C4.04559 6.99984 2.99992 5.95417 2.99992 4.6665C2.99992 3.37884 4.04559 2.33317 5.33325 2.33317ZM7.99992 8.58317C8.41325 8.42184 8.86292 8.33317 9.33325 8.33317H11.9999C14.0249 8.33317 15.6666 9.97484 15.6666 11.9998V13.3332C15.6666 13.5984 15.5612 13.8527 15.3737 14.0403C15.1862 14.2278 14.9318 14.3332 14.6666 14.3332H1.33325C1.06804 14.3332 0.813682 14.2278 0.626145 14.0403C0.438609 13.8527 0.333252 13.5984 0.333252 13.3332V11.9998C0.333252 9.97484 1.97492 8.33317 3.99992 8.33317H6.66659C7.13692 8.33317 7.58659 8.42184 7.99992 8.58317ZM9.66659 11.9998V13.3332C9.66659 13.4216 9.63147 13.5064 9.56895 13.5689C9.50644 13.6314 9.42166 13.6665 9.33325 13.6665H1.33325C1.24485 13.6665 1.16006 13.6314 1.09755 13.5689C1.03504 13.5064 0.999919 13.4216 0.999919 13.3332V11.9998C0.999919 11.2042 1.31599 10.4411 1.8786 9.87852C2.44121 9.31591 3.20427 8.99984 3.99992 8.99984H6.66659C7.46223 8.99984 8.2253 9.31591 8.78791 9.87852C9.35051 10.4411 9.66659 11.2042 9.66659 11.9998ZM10.2763 13.6665H14.6666C14.755 13.6665 14.8398 13.6314 14.9023 13.5689C14.9648 13.5064 14.9999 13.4216 14.9999 13.3332V11.9998C14.9999 11.2042 14.6838 10.4411 14.1212 9.87852C13.5586 9.31591 12.7956 8.99984 11.9999 8.99984H9.33325C9.16292 8.99984 8.99559 9.01417 8.83292 9.0415C9.29823 9.38169 9.67664 9.82693 9.93735 10.341C10.1981 10.8551 10.3337 11.4234 10.3333 11.9998V13.3332C10.3333 13.4502 10.3133 13.5622 10.2763 13.6665Z" fill="#4F536C" /></svg>';
            
            var lessonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.1515 15.7573H3.00607C2.32728 15.7573 1.79395 15.224 1.79395 14.5452V1.45431C1.79395 0.775521 2.32728 0.242188 3.00607 0.242188H12.9939C13.6727 0.242188 14.2061 0.775521 14.2061 1.45431V12.7755C14.2061 12.921 14.1091 13.0179 13.9636 13.0179C13.8182 13.0179 13.7212 12.921 13.7212 12.7755V1.45431C13.7212 1.04219 13.4061 0.727036 12.9939 0.727036H3.00607C2.59395 0.727036 2.27879 1.04219 2.27879 1.45431V14.5452C2.27879 14.9573 2.59395 15.2725 3.00607 15.2725H11.1515C11.297 15.2725 11.3939 15.3695 11.3939 15.5149C11.3939 15.6604 11.297 15.7573 11.1515 15.7573Z" fill="#4F536C" /><path d="M11.2001 15.7571H11.1758C11.0304 15.7571 10.9334 15.6601 10.9334 15.5147V13.6723C10.9334 13.042 11.4425 12.5329 12.0728 12.5329H13.9395C14.0364 12.5329 14.1334 12.5813 14.1576 12.6783C14.2061 12.7753 14.1819 12.8723 14.1092 12.945L11.3698 15.6844C11.3213 15.7329 11.2728 15.7571 11.2001 15.7571ZM12.0728 13.0177C11.7092 13.0177 11.4182 13.3086 11.4182 13.6723V14.9571L13.3576 13.0177H12.0728ZM8.0243 4.24195C8.00006 4.24195 7.97582 4.24195 7.95158 4.21771L4.55764 3.07831C4.46067 3.05407 4.38794 2.9571 4.38794 2.86013C4.38794 2.76316 4.46067 2.66619 4.55764 2.64195L7.95158 1.50256C8.00006 1.47831 8.04855 1.47831 8.09703 1.50256L11.394 2.64195C11.491 2.66619 11.5637 2.76316 11.5637 2.86013C11.5637 2.9571 11.491 3.05407 11.394 3.07831L8.09703 4.21771C8.07279 4.24195 8.04855 4.24195 8.0243 4.24195ZM5.38188 2.86013L8.0243 3.73286L10.5698 2.86013L8.0243 1.98741L5.38188 2.86013Z" fill="#4F536C" /></svg>';

            // Generate course cards
            data.courses.forEach(function(course) {
                var starsHtml = '';
                for (var i = 0; i < 5; i++) {
                    if (i < 4) {
                        starsHtml += '<li><i class="fa-solid fa-star-sharp"></i></li>';
                    } else {
                        starsHtml += '<li><i class="fa-regular fa-star-sharp-half-stroke"></i></li>';
                    }
                }

                var cardHtml = '<div class="swiper-slide">' +
                    '<div class="course2-card">' +
                        '<div class="course2-card__thumb">' +
                            '<img class="w-100" src="' + course.image + '" alt="' + course.title + '">' +
                        '</div>' +
                        '<div class="course2-card-content">' +
                            '<div class="course2-card-content-top">' +
                                '<ul class="course2-card-content-top__rating">' + starsHtml + '</ul>' +
                                '<div class="course2-card-content-top__text">(5.000)</div>' +
                            '</div>' +
                            '<a class="course2-card__title" href="course-detail.html?id=' + course.id + '">' + course.title + '</a>' +
                            '<div class="course2-card-meta">' +
                                '<div class="course2-card-meta-item">' +
                                    '<div class="course2-card-meta__icon">' + studentSvg + '</div>' +
                                    '<div class="course2-card-meta__text">' + course.students + ' Students</div>' +
                                '</div>' +
                                '<div class="course2-card-meta-item">' +
                                    '<div class="course2-card-meta__icon">' + lessonSvg + '</div>' +
                                    '<div class="course2-card-meta__text">' + course.lessons + ' Lessons</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

                $swiperWrapper.append(cardHtml);
            });

            // Reinitialize the swiper after loading courses
            if (typeof Swiper !== 'undefined') {
                new Swiper('.course2-slider', {
                    loop: true,
                    speed: 800,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: '.swiper-next',
                        prevEl: '.swiper-prev',
                    },
                    breakpoints: {
                        0: { slidesPerView: 1, spaceBetween: 15 },
                        576: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 30 },
                        1400: { slidesPerView: 4, spaceBetween: 30 },
                    },
                });
            }
        }).fail(function() {
            console.log('Failed to load courses from JSON');
        });
    }

    // Load courses for course grid page
    loadCoursesGrid();

    function loadCoursesGrid() {
        var $coursesContainer = $('#courses-grid-container');
        if (!$coursesContainer.length) return;

        $.getJSON('assets/data/courses.json', function(data) {
            if (!data.courses || !data.courses.length) return;

            $coursesContainer.empty();

            var studentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99992 3.29184C7.74738 2.8023 7.36499 2.3917 6.89463 2.10502C6.42427 1.81834 5.88409 1.66662 5.33325 1.6665C3.67759 1.6665 2.33325 3.01084 2.33325 4.6665C2.33325 6.32217 3.67759 7.6665 5.33325 7.6665C5.88409 7.66638 6.42427 7.51467 6.89463 7.22799C7.36499 6.94131 7.74738 6.53071 7.99992 6.04117C8.2524 6.53076 8.63478 6.9414 9.10515 7.22809C9.57552 7.51478 10.1157 7.66646 10.6666 7.6665C12.3223 7.6665 13.6666 6.32217 13.6666 4.6665C13.6666 3.01084 12.3223 1.6665 10.6666 1.6665C10.1157 1.66662 9.57556 1.81834 9.10521 2.10502C8.63485 2.3917 8.25246 2.8023 7.99992 3.29184ZM10.6666 2.33317C11.9543 2.33317 12.9999 3.37884 12.9999 4.6665C12.9999 5.95417 11.9543 6.99984 10.6666 6.99984C9.37892 6.99984 8.33325 5.95417 8.33325 4.6665C8.33325 3.37884 9.37892 2.33317 10.6666 2.33317ZM5.33325 2.33317C6.62092 2.33317 7.66659 3.37884 7.66659 4.6665C7.66659 5.95417 6.62092 6.99984 5.33325 6.99984C4.04559 6.99984 2.99992 5.95417 2.99992 4.6665C2.99992 3.37884 4.04559 2.33317 5.33325 2.33317ZM7.99992 8.58317C8.41325 8.42184 8.86292 8.33317 9.33325 8.33317H11.9999C14.0249 8.33317 15.6666 9.97484 15.6666 11.9998V13.3332C15.6666 13.5984 15.5612 13.8527 15.3737 14.0403C15.1862 14.2278 14.9318 14.3332 14.6666 14.3332H1.33325C1.06804 14.3332 0.813682 14.2278 0.626145 14.0403C0.438609 13.8527 0.333252 13.5984 0.333252 13.3332V11.9998C0.333252 9.97484 1.97492 8.33317 3.99992 8.33317H6.66659C7.13692 8.33317 7.58659 8.42184 7.99992 8.58317ZM9.66659 11.9998V13.3332C9.66659 13.4216 9.63147 13.5064 9.56895 13.5689C9.50644 13.6314 9.42166 13.6665 9.33325 13.6665H1.33325C1.24485 13.6665 1.16006 13.6314 1.09755 13.5689C1.03504 13.5064 0.999919 13.4216 0.999919 13.3332V11.9998C0.999919 11.2042 1.31599 10.4411 1.8786 9.87852C2.44121 9.31591 3.20427 8.99984 3.99992 8.99984H6.66659C7.46223 8.99984 8.2253 9.31591 8.78791 9.87852C9.35051 10.4411 9.66659 11.2042 9.66659 11.9998ZM10.2763 13.6665H14.6666C14.755 13.6665 14.8398 13.6314 14.9023 13.5689C14.9648 13.5064 14.9999 13.4216 14.9999 13.3332V11.9998C14.9999 11.2042 14.6838 10.4411 14.1212 9.87852C13.5586 9.31591 12.7956 8.99984 11.9999 8.99984H9.33325C9.16292 8.99984 8.99559 9.01417 8.83292 9.0415C9.29823 9.38169 9.67664 9.82693 9.93735 10.341C10.1981 10.8551 10.3337 11.4234 10.3333 11.9998V13.3332C10.3333 13.4502 10.3133 13.5622 10.2763 13.6665Z" fill="#4F536C" /></svg>';
            var lessonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.1515 15.7573H3.00607C2.32728 15.7573 1.79395 15.224 1.79395 14.5452V1.45431C1.79395 0.775521 2.32728 0.242188 3.00607 0.242188H12.9939C13.6727 0.242188 14.2061 0.775521 14.2061 1.45431V12.7755C14.2061 12.921 14.1091 13.0179 13.9636 13.0179C13.8182 13.0179 13.7212 12.921 13.7212 12.7755V1.45431C13.7212 1.04219 13.4061 0.727036 12.9939 0.727036H3.00607C2.59395 0.727036 2.27879 1.04219 2.27879 1.45431V14.5452C2.27879 14.9573 2.59395 15.2725 3.00607 15.2725H11.1515C11.297 15.2725 11.3939 15.3695 11.3939 15.5149C11.3939 15.6604 11.297 15.7573 11.1515 15.7573Z" fill="#4F536C" /><path d="M11.2001 15.7571H11.1758C11.0304 15.7571 10.9334 15.6601 10.9334 15.5147V13.6723C10.9334 13.042 11.4425 12.5329 12.0728 12.5329H13.9395C14.0364 12.5329 14.1334 12.5813 14.1576 12.6783C14.2061 12.7753 14.1819 12.8723 14.1092 12.945L11.3698 15.6844C11.3213 15.7329 11.2728 15.7571 11.2001 15.7571ZM12.0728 13.0177C11.7092 13.0177 11.4182 13.3086 11.4182 13.6723V14.9571L13.3576 13.0177H12.0728ZM8.0243 4.24195C8.00006 4.24195 7.97582 4.24195 7.95158 4.21771L4.55764 3.07831C4.46067 3.05407 4.38794 2.9571 4.38794 2.86013C4.38794 2.76316 4.46067 2.66619 4.55764 2.64195L7.95158 1.50256C8.00006 1.47831 8.04855 1.47831 8.09703 1.50256L11.394 2.64195C11.491 2.66619 11.5637 2.76316 11.5637 2.86013C11.5637 2.9571 11.491 3.05407 11.394 3.07831L8.09703 4.21771C8.07279 4.24195 8.04855 4.24195 8.0243 4.24195ZM5.38188 2.86013L8.0243 3.73286L10.5698 2.86013L8.0243 1.98741L5.38188 2.86013Z" fill="#4F536C" /><path d="M8.00002 5.59972C7.22426 5.59972 6.42426 5.55123 5.60002 5.45426C5.47881 5.43002 5.38184 5.33305 5.38184 5.21184V3.22396C5.38184 3.07851 5.47881 2.98154 5.62426 2.98154C5.76971 2.98154 5.86668 3.07851 5.86668 3.22396V4.99366C7.29699 5.13911 8.70305 5.16336 10.0364 4.99366V3.22396C10.0364 3.07851 10.1334 2.98154 10.2788 2.98154C10.4243 2.98154 10.5212 3.07851 10.5212 3.22396V5.21184C10.5212 5.33305 10.4243 5.43002 10.303 5.45426C9.57578 5.55123 8.80002 5.59972 8.00002 5.59972ZM11.2 5.09063C11.0546 5.09063 10.9576 4.99366 10.9576 4.8482V3.03002C10.9576 2.88457 11.0546 2.7876 11.2 2.7876C11.3455 2.7876 11.4424 2.88457 11.4424 3.03002V4.8482C11.4424 4.99366 11.3455 5.09063 11.2 5.09063Z" fill="#4F536C" /><path d="M11.3697 5.18749H11.0545C10.9091 5.18749 10.8121 5.09052 10.8121 4.94506C10.8121 4.79961 10.9091 4.70264 11.0545 4.70264H11.3697C11.5151 4.70264 11.6121 4.79961 11.6121 4.94506C11.6121 5.09052 11.5151 5.18749 11.3697 5.18749ZM11.8303 7.539H6.86058C6.71512 7.539 6.61816 7.44203 6.61816 7.29658C6.61816 7.15112 6.71512 7.05415 6.86058 7.05415H11.8303C11.9757 7.05415 12.0727 7.15112 12.0727 7.29658C12.0727 7.44203 11.9757 7.539 11.8303 7.539ZM11.8303 9.55112H6.86058C6.71512 9.55112 6.61816 9.45415 6.61816 9.3087C6.61816 9.16324 6.71512 9.06627 6.86058 9.06627H11.8303C11.9757 9.06627 12.0727 9.16324 12.0727 9.3087C12.0727 9.45415 11.9757 9.55112 11.8303 9.55112ZM11.8303 11.5632H6.86058C6.71512 11.5632 6.61816 11.4663 6.61816 11.3208C6.61816 11.1754 6.71512 11.0784 6.86058 11.0784H11.8303C11.9757 11.0784 12.0727 11.1754 12.0727 11.3208C12.0727 11.4663 11.9757 11.5632 11.8303 11.5632ZM9.35755 13.5754H6.86058C6.71512 13.5754 6.61816 13.4784 6.61816 13.3329C6.61816 13.1875 6.71512 13.0905 6.86058 13.0905H9.35755C9.503 13.0905 9.59997 13.1875 9.59997 13.3329C9.59997 13.4784 9.503 13.5754 9.35755 13.5754ZM5.06664 7.97536H4.16967C4.02422 7.97536 3.92725 7.87839 3.92725 7.73294V6.83597C3.92725 6.69052 4.02422 6.59355 4.16967 6.59355H5.06664C5.21209 6.59355 5.30906 6.69052 5.30906 6.83597V7.73294C5.30906 7.87839 5.21209 7.97536 5.06664 7.97536ZM4.41209 7.49052H4.82422V7.07839H4.41209V7.49052ZM5.06664 9.98749H4.16967C4.02422 9.98749 3.92725 9.89052 3.92725 9.74506V8.84809C3.92725 8.70264 4.02422 8.60567 4.16967 8.60567H5.06664C5.21209 8.60567 5.30906 8.70264 5.30906 8.84809V9.74506C5.30906 9.89052 5.21209 9.98749 5.06664 9.98749ZM4.41209 9.50264H4.82422V9.09052H4.41209V9.50264ZM5.06664 11.9996H4.16967C4.02422 11.9996 3.92725 11.9026 3.92725 11.7572V10.8602C3.92725 10.7148 4.02422 10.6178 4.16967 10.6178H5.06664C5.21209 10.6178 5.30906 10.7148 5.30906 10.8602V11.7572C5.30906 11.9026 5.21209 11.9996 5.06664 11.9996ZM4.41209 11.5148H4.82422V11.1026H4.41209V11.5148ZM5.06664 14.0117H4.16967C4.02422 14.0117 3.92725 13.9148 3.92725 13.7693V12.8723C3.92725 12.7269 4.02422 12.6299 4.16967 12.6299H5.06664C5.21209 12.6299 5.30906 12.7269 5.30906 12.8723V13.7693C5.30906 13.9148 5.21209 14.0117 5.06664 14.0117ZM4.41209 13.5269H4.82422V13.1148H4.41209V13.5269Z" fill="#4F536C" /></svg>';

            data.courses.forEach(function(course) {
                var cardHtml = '<div class="col-xl-4 col-md-6">' +
                    '<div class="course1-card">' +
                        '<div class="course1-card__thumb">' +
                            '<img class="w-100" src="' + course.image + '" alt="' + course.title + '">' +
                        '</div>' +
                        '<div class="course1-card-content">' +
                            '<a class="course1-card__title" href="course-detail.html?id=' + course.id + '">' + course.title + '</a>' +
                            '<div class="course1-card-meta">' +
                                '<div class="course1-card-meta-item">' +
                                    '<div class="course1-card-meta__icon">' + studentSvg + '</div>' +
                                    '<div class="course1-card-meta__text">' + course.students + ' Students</div>' +
                                '</div>' +
                                '<div class="course1-card-meta-item">' +
                                    '<div class="course1-card-meta__icon">' + lessonSvg + '</div>' +
                                    '<div class="course1-card-meta__text">' + course.lessons + ' Lessons</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
                
                $coursesContainer.append(cardHtml);
            });
        }).fail(function() {
            console.log('Failed to load courses from JSON');
        });
    }

  }
})(jQuery);
