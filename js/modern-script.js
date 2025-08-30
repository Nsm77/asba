/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu');
    });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*=============== FAQ ACCORDION ===============*/
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach((item) =>{
    const faqHeader = item.querySelector('.faq__header');

    faqHeader.addEventListener('click', () =>{
        const openItem = document.querySelector('.faq-open');

        toggleItem(item);

        if(openItem && openItem!== item){
            toggleItem(openItem);
        }
    });
});

const toggleItem = (item) =>{
    const faqContent = item.querySelector('.faq__content');

    if(item.classList.contains('faq-open')){
        faqContent.removeAttribute('style');
        item.classList.remove('faq-open');
    } else {
        faqContent.style.height = faqContent.scrollHeight + 'px';
        item.classList.add('faq-open');
    }
}

/*=============== DEVIS CALCULATOR ===============*/
const calculateDevis = document.getElementById('calculate-devis');

if(calculateDevis) {
    calculateDevis.addEventListener('click', (e) => {
        e.preventDefault();

        const birthdate = new Date(document.getElementById('birthdate').value);
        const numPeople = parseInt(document.getElementById('num-people').value);
        const dental = parseInt(document.getElementById('dental-coverage').value);
        const optical = parseInt(document.getElementById('optical-coverage').value);

        const age = new Date().getFullYear() - birthdate.getFullYear();

        let price = 30; // Base price
        price += age > 40 ? (age - 40) * 1.5 : 0;
        price += (numPeople - 1) * 20;
        price += dental * 15;
        price += optical * 10;

        document.getElementById('devis-price').textContent = price.toFixed(2);
    });
}
