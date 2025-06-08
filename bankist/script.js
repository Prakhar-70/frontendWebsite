'use strict';

let modal = document.querySelector('.modal');
let overlay = document.querySelector('.overlay');
let btnClosemodal = document.querySelector('.btn--close-modal');
let btnShowmodal = document.querySelectorAll('.btn--show-modal');

let openModal = function(e){
    e.preventDefault();
        modal.classList.remove('hidden')
        overlay.classList.remove('hidden')
        }

let closeModal = function(){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnShowmodal.forEach(btn => btn.addEventListener('click',openModal));

btnClosemodal.addEventListener('click',closeModal);
overlay.addEventListener('click',closeModal);

// Escape key function
document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//Scrolling 
 let btnScrollTo = document.querySelector('.btn--scroll-to');
 let section1 = document.querySelector('#section--1');
 
 btnScrollTo.addEventListener('click',function(e) {
    let s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

    console.log(
        'height/width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );


    // window.scrollTo({
    //    left : s1coords.left + window.pageXOffset,
    //     top :s1coords.top + window.pageYOffset,
    //     behavior : "smooth",
    // })

    section1.scrollIntoView({behavior:"smooth"});
 });


// 1. Add eventlistner to common parent element
// 2. Determine what element originated the event
 
 document.querySelector('.nav__links').addEventListener('click',function(e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        let id = e.target.getAttribute('href');
        console.log(id);
        document.querySelector(id).scrollIntoView({
            behavior : "smooth" });
    }
 });
 
 // Tabbed components
 let tabs = document.querySelectorAll('.operations__tab');
 let tabsContainer = document.querySelector('.operations__tab-container');
 let tabsContent = document.querySelectorAll('.operations__content');

 tabsContainer.addEventListener('click',function(e) {
    let clicked = e.target.closest('.operations__tab');

    // Guard clause
    if(!clicked) return;

    // Remove active tab
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
        
    // Acitvate tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

 });

 // Menu fade animation
 let nav = document.querySelector('.nav');
 let handleHover = function(e,opacity) {
    if(e.target.classList.contains('nav__link')){
        let link = e.target;
        let siblings = link.closest('.nav').querySelectorAll('.nav__link');
        let logo = link.closest('.nav').querySelectorAll('img');

        siblings.forEach(el => {
            if(el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
 };

 // Passing "argument" into handler
 nav.addEventListener('mouseover', handleHover.bind(0.5));
 nav.addEventListener('mouseout', handleHover.bind(1));

 // Sticky navigation
let header = document.querySelector('.header');
let navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

let stickyNav = function(entries) {
    let [entry] = entries;

    if(!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

let headerObserver = new IntersectionObserver
(stickyNav,{
    root : null,
    threshold : 0,
    rootMargin : `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal section
let allSections = document.querySelectorAll('.section');
let revealSection = function(entries,observer) {
    let [entry] = entries;

    if(!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

let sectionObserver = new IntersectionObserver
(revealSection,{
    root : null,
    threshold : 0.15,
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// Lazing loading images
let imgTargets = document.querySelectorAll('img[data-src]');

let loading = function (entries, observer) {
    let [entry] = entries;

    if(!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load',function (){
        entry.target.classList.remove('lazy-img');
    });
     
    observer.unobserve(entry.target);
}

let imgObserver = new IntersectionObserver(loading, {
    root : null,
    threshold : 0 ,
    rootMargin : '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
  
    let curSlide = 0;
    const maxSlide = slides.length;
  
    // Functions
    const createDots = function () {
      slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };
  
    const activateDot = function (slide) {
      document
        .querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));
  
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    };
  
    const goToSlide = function (slide) {
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };
  
    // Next slide
    const nextSlide = function () {
      if (curSlide === maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }
  
      goToSlide(curSlide);
      activateDot(curSlide);
    };
  
    const prevSlide = function () {
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
      activateDot(curSlide);
    };
  
    const init = function () {
      goToSlide(0);
      createDots();
  
      activateDot(0);
    };
    init();
  
    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
  
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prevSlide();
      e.key === 'ArrowRight' && nextSlide();
    });
  
    dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
      }
    });
  };
  slider();
  