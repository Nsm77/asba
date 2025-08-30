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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate login
            const clientData = {
                name: "Jean Dupont",
                contractId: document.getElementById('client-id').value,
                plan: "Famille",
                daysLeft: 24,
                address: "123 Rue de la République, 75001 Paris",
                phone: "06 12 34 56 78",
                notifications: 3,
                invoices: [
                    { id: "F2025-01", date: "01/08/2025", amount: "89.00€" },
                    { id: "F2025-02", date: "01/07/2025", amount: "89.00€" },
                    { id: "F2025-03", date: "01/06/2025", amount: "89.00€" },
                ],
                recentActs: [
                    { date: '15/08/2025', description: 'Consultation Généraliste', status: 'Remboursé', amount: '25.00€' },
                    { date: '12/08/2025', description: 'Achat Pharmacie', status: 'Remboursé', amount: '12.50€' },
                    { date: '05/08/2025', description: 'Soins Dentaires', status: 'En attente', amount: '120.00€' },
                ]
            };
            sessionStorage.setItem('clientData', JSON.stringify(clientData));
            window.location.href = 'dashboard.html';
        });
    }

    // Dashboard Population
    if (window.location.pathname.endsWith('dashboard.html')) {
        const clientData = JSON.parse(sessionStorage.getItem('clientData'));
        if (!clientData) {
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

            const recentActsBody = document.getElementById('recent-acts-body');
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
            sessionStorage.removeItem('clientData');
            window.location.href = 'espace-client.html';
        });
    }

});
