document.addEventListener("DOMContentLoaded", function() {
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current item
            question.classList.toggle('active');
            answer.classList.toggle('active');
        });
    });

    // Search functionality with highlighting
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
        const faqItems = document.querySelectorAll('.faq-item');
        const originalContents = new Map();

        faqItems.forEach(item => {
            const questionSpan = item.querySelector('.faq-question span');
            const answerDiv = item.querySelector('.faq-answer');
            originalContents.set(item, {
                question: questionSpan.innerHTML,
                answer: answerDiv.innerHTML
            });
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            faqItems.forEach(item => {
                const { question, answer } = originalContents.get(item);
                const questionSpan = item.querySelector('.faq-question span');
                const answerDiv = item.querySelector('.faq-answer');

                const questionText = question.toLowerCase();
                const answerText = answer.toLowerCase();

                // Reset content
                questionSpan.innerHTML = question;
                answerDiv.innerHTML = answer;
                
                if (searchTerm.length > 0 && (questionText.includes(searchTerm) || answerText.includes(searchTerm))) {
                    item.style.display = 'block';

                    const highlight = (text, term) => {
                        const regex = new RegExp(`(${term})`, 'gi');
                        return text.replace(regex, '<mark>$1</mark>');
                    };

                    questionSpan.innerHTML = highlight(question, searchTerm);
                    answerDiv.innerHTML = highlight(answer, searchTerm);
                } else if (searchTerm.length === 0) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqSections = document.querySelectorAll('.faq-section');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide sections
            faqSections.forEach(section => {
                if (category === 'all' || section.getAttribute('data-category') === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});
