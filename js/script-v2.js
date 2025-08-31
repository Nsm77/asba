/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the shadow-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== FAQ ACCORDION ===============*/
const faqItems = document.querySelectorAll('.faq__item')

faqItems.forEach((item) =>{
    const faqQuestion = item.querySelector('.faq__question')

    faqQuestion.addEventListener('click', () =>{
        const openItem = document.querySelector('.faq__item.active')

        toggleItem(item)

        if(openItem && openItem!== item){
            toggleItem(openItem)
        }
    })
})

const toggleItem = (item) =>{
    const faqAnswer = item.querySelector('.faq__answer')

    if(item.classList.contains('active')){
        faqAnswer.removeAttribute('style')
        item.classList.remove('active')
    }else{
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px'
        item.classList.add('active')
    }
}

/*=============== ESPACE CLIENT ===============*/
document.addEventListener('DOMContentLoaded', () => {
    // Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');

            // Mock credentials
            if (email === 'user@test.com' && password === 'password') {
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('userName', 'Jean Dupont');
                sessionStorage.setItem('planName', 'Formule Famille');
                window.location.href = 'dashboard.html';
            } else {
                errorElement.style.display = 'block';
            }
        });
    }

    // Dashboard Page Logic
    const userNameElement = document.getElementById('user-name');
    const planNameElement = document.getElementById('plan-name');
    const logoutBtn = document.getElementById('logout-btn');
    const reimbursementsBody = document.getElementById('reimbursements-body');
    const messageList = document.getElementById('message-list');

    if (userNameElement) { // Check if we are on the dashboard page
        if (sessionStorage.getItem('loggedIn') === 'true') {
            // Populate user info
            userNameElement.textContent = sessionStorage.getItem('userName');
            planNameElement.textContent = sessionStorage.getItem('planName');

            // Populate mock reimbursements
            const mockReimbursements = [
                { date: '2025-08-28', type: 'Consultation Généraliste', amount: '25,00 €' },
                { date: '2025-08-20', type: 'Pharmacie', amount: '12,50 €' },
                { date: '2025-08-15', type: 'Soins Dentaires', amount: '85,00 €' }
            ];

            mockReimbursements.forEach(r => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${r.date}</td><td>${r.type}</td><td>${r.amount}</td>`;
                reimbursementsBody.appendChild(row);
            });

            // Populate mock messages
            const mockMessages = [
                { subject: 'Votre nouveau tableau de garanties est disponible', unread: true },
                { subject: 'Information importante concernant votre contrat', unread: false }
            ];

            mockMessages.forEach(m => {
                const item = document.createElement('li');
                item.textContent = m.subject;
                if (m.unread) {
                    item.style.fontWeight = 'bold';
                }
                messageList.appendChild(item);
            });

        } else {
            // If not logged in, redirect to login page
            window.location.href = 'espace-client.html';
        }
    }

    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('planName');
            window.location.href = 'espace-client.html';
        });
    }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Animations repeat
})

sr.reveal(`.home__data, .footer__container, .footer__copy`)
sr.reveal(`.home__image`, {origin: 'bottom'})
sr.reveal(`.services__card, .faq__item`, {interval: 100})
sr.reveal(`.about__data`, {origin: 'right'})
sr.reveal(`.about__image`, {origin: 'left'})
sr.reveal(`.contact__container`, {origin: 'bottom'})

/*=============== DEVIS FORM ===============*/
document.addEventListener('DOMContentLoaded', () => {
    const devisForm = document.getElementById('devis-form');
    if (devisForm) {
        let currentStep = 1;
        const totalSteps = 3;
        const progressFill = document.getElementById('progress-fill');

        window.nextStep = function() {
            if (currentStep < totalSteps) {
                document.getElementById(`form-step-${currentStep}`).classList.remove('active');
                document.getElementById(`step-${currentStep}`).classList.remove('active');
                currentStep++;
                document.getElementById(`form-step-${currentStep}`).classList.add('active');
                document.getElementById(`step-${currentStep}`).classList.add('active');
                progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
            }
        }

        window.prevStep = function() {
            if (currentStep > 1) {
                document.getElementById(`form-step-${currentStep}`).classList.remove('active');
                document.getElementById(`step-${currentStep}`).classList.remove('active');
                currentStep--;
                document.getElementById(`form-step-${currentStep}`).classList.add('active');
                document.getElementById(`step-${currentStep}`).classList.add('active');
                progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
            }
        }

        devisForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Mock price calculation
            const price = Math.floor(Math.random() * (150 - 30 + 1)) + 30;
            document.getElementById('estimated-price').textContent = `${price} €`;
            devisForm.style.display = 'none';
            document.getElementById('results-section').style.display = 'block';
        });
    }
});
