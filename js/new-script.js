// New JavaScript file for the modernized website.
document.addEventListener("DOMContentLoaded", function() {
    console.log("New website loaded!");

    // AOS Initialization
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // Services Page Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const content = item.querySelector('.accordion-content');

                // Close other open items
                document.querySelectorAll('.accordion-item.active').forEach(openItem => {
                    if(openItem !== item) {
                        openItem.classList.remove('active');
                        openItem.querySelector('.accordion-content').style.maxHeight = 0;
                        openItem.querySelector('.accordion-content').style.padding = "0 20px";
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.style.padding = "0 20px 20px";
                } else {
                    content.style.maxHeight = 0;
                    content.style.padding = "0 20px";
                }
            });
        });
    }

    // Client Prototype Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const clientId = document.getElementById('client-id').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clientId, password })
                });
                const result = await response.json();
                if (result.success) {
                    sessionStorage.setItem('authToken', result.token);
                    sessionStorage.setItem('clientData', JSON.stringify(result.clientData));
                    window.location.href = 'dashboard.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Erreur de connexion au serveur.');
            }
        });
    }

    // Dashboard Population
    if (window.location.pathname.endsWith('dashboard.html')) {
        const token = sessionStorage.getItem('authToken');
        const clientData = JSON.parse(sessionStorage.getItem('clientData'));

        if (!token || !clientData) {
            window.location.href = 'espace-client.html';
        } else {
            document.getElementById('client-name').textContent = clientData.name;
            document.getElementById('plan-name').textContent = clientData.plan;
            document.getElementById('contract-id').textContent = clientData.contractId;
            document.getElementById('days-left-value').textContent = clientData.daysLeft;
            document.getElementById('info-name').textContent = clientData.name;
            document.getElementById('info-address').textContent = clientData.address;
            document.getElementById('info-phone').textContent = clientData.phone;
            document.getElementById('notification-count').textContent = clientData.notifications;

            const alertsContainer = document.getElementById('dashboard-alerts');
            if(clientData.alerts && clientData.alerts.length > 0) {
                clientData.alerts.forEach(alert => {
                    const alertEl = document.createElement('div');
                    alertEl.className = `dashboard-alert alert-${alert.type}`;
                    alertEl.innerHTML = `<i class="fas fa-info-circle"></i> <p>${alert.message}</p>`;
                    alertsContainer.appendChild(alertEl);
                });
            }

            const recentActsBody = document.getElementById('recent-acts-body');
            const profileSwitcher = document.getElementById('profile-switcher');

            const updateDashboardForProfile = (memberId) => {
                const member = clientData.family.find(m => m.id == memberId);
                if(!member) return;

                // Update personal info
                document.getElementById('info-name').textContent = member.name;

                // Update recent acts
                recentActsBody.innerHTML = '';
                member.recentActs.forEach(act => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${act.date}</td>
                        <td>${act.description}</td>
                        <td><span class="status-${act.status === 'Remboursé' ? 'reimbursed' : 'pending'}">${act.status}</span></td>
                        <td>${act.amount}</td>
                    `;
                    recentActsBody.appendChild(row);
                });
            };

            if(clientData.family && clientData.family.length > 0) {
                clientData.family.forEach(member => {
                    const option = document.createElement('option');
                    option.value = member.id;
                    option.textContent = member.name + (member.isPrimary ? ' (Principal)' : '');
                    profileSwitcher.appendChild(option);
                });

                profileSwitcher.addEventListener('change', (e) => {
                    updateDashboardForProfile(e.target.value);
                });

                // Initial load for primary profile
                updateDashboardForProfile(clientData.family.find(m => m.isPrimary).id);
            } else {
                 clientData.recentActs.forEach(act => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${act.date}</td>
                        <td>${act.description}</td>
                        <td><span class="status-${act.status === 'Remboursé' ? 'reimbursed' : 'pending'}">${act.status}</span></td>
                        <td>${act.amount}</td>
                    `;
                    recentActsBody.appendChild(row);
                });
            }

            // Chart.js
            const ctx = document.getElementById('reimbursement-chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
                    datasets: [{
                        label: 'Remboursements (€)',
                        data: [65, 59, 80, 81, 56, 120],
                        backgroundColor: 'rgba(190, 146, 86, 0.6)',
                        borderColor: 'rgba(190, 146, 86, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Logout
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('clientData');
            window.location.href = 'espace-client.html';
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                alert(result.message);
                if(result.success) {
                    contactForm.reset();
                }
            } catch (error) {
                alert('Erreur lors de l\'envoi du message.');
            }
        });
    }

    // Dark Mode Logic
    const darkModeToggle = document.getElementById('dark-mode-checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            darkModeToggle.checked = true;
        }
    }

    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Find a Doctor Map Logic
    const mapContainer = document.getElementById('map');
    if(mapContainer) {
        const map = L.map('map').setView([48.8566, 2.3522], 13); // Centered on Paris

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const doctors = [
            { name: 'Dr. Alain Martin', specialty: 'generalist', lat: 48.858, lng: 2.34, address: '10 Rue de Rivoli, 75001 Paris' },
            { name: 'Dr. Sophie Dubois', specialty: 'dentist', lat: 48.86, lng: 2.35, address: '25 Rue du Louvre, 75001 Paris' },
            { name: 'Dr. Michel Bernard', specialty: 'ophthalmologist', lat: 48.85, lng: 2.36, address: '5 Avenue de l\'Opéra, 75001 Paris' },
            { name: 'Dr. Isabelle Petit', specialty: 'generalist', lat: 48.865, lng: 2.33, address: '30 Rue Saint-Honoré, 75001 Paris' },
        ];

        let markers = [];

        const addMarkers = (filteredDoctors) => {
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            filteredDoctors.forEach(doctor => {
                const marker = L.marker([doctor.lat, doctor.lng]).addTo(map)
                    .bindPopup(`<b>${doctor.name}</b><br>${doctor.address}`);
                markers.push(marker);
            });
        };

        const filterDoctors = () => {
            const specialty = document.getElementById('specialty-filter').value;
            const filtered = doctors.filter(doctor => {
                return !specialty || doctor.specialty === specialty;
            });
            addMarkers(filtered);
        };

        document.getElementById('specialty-filter').addEventListener('change', filterDoctors);

        // Initial load
        addMarkers(doctors);
    }

    // Document Uploader
    const uploadForm = document.getElementById('upload-form');
    if(uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('document-file');
            if (fileInput.files.length === 0) {
                alert('Veuillez sélectionner un fichier.');
                return;
            }

            const formData = new FormData();
            formData.append('document', fileInput.files[0]);

            try {
                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                alert(result.message);
                if(result.success) {
                    uploadForm.reset();
                }
            } catch (error) {
                alert('Erreur lors de l\'envoi du fichier.');
            }
        });
    }

    // Quote Calculator Logic
    const quoteForm = document.getElementById('quote-form');
    if(quoteForm) {
        let currentStep = 1;
        const steps = quoteForm.querySelectorAll('.form-step');
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressBarFill = document.querySelector('.progress-bar-fill');

        const updateProgress = () => {
            progressBarFill.style.width = `${(currentStep - 1) * 50}%`;
            progressSteps.forEach(step => {
                step.classList.remove('active');
                if(parseInt(step.dataset.step) === currentStep) {
                    step.classList.add('active');
                }
            });
        };

        const showStep = (stepNumber) => {
            steps.forEach(step => step.classList.remove('active'));
            quoteForm.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
            currentStep = stepNumber;
            updateProgress();
        };

        quoteForm.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < 3) {
                    if(currentStep === 2) calculateQuote();
                    showStep(currentStep + 1);
                }
            });
        });

        quoteForm.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            });
        });

        const calculateQuote = () => {
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

            document.getElementById('quote-price').textContent = price.toFixed(2);
        };
    }
});
