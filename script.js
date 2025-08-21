document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.getElementById('menu');
    
    function toggleMenu() {
        menu.classList.toggle('show');
        menuBtn.innerHTML = menu.classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
    
    menuBtn.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (menu.classList.contains('show')) {
                    toggleMenu();
                }
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.classList.remove('show');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const feedbackDiv = document.getElementById('formFeedback');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
            feedbackDiv.style.display = 'none';
            
            try {
                const response = await fetch('https://formspree.io/f/xanbvple', {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    feedbackDiv.className = 'form-feedback success';
                    feedbackDiv.textContent = 'Mensagem enviada com sucesso!';
                    feedbackDiv.style.display = 'block';
                    
                    this.reset();
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                console.error('Error:', error);
                feedbackDiv.className = 'form-feedback error';
                feedbackDiv.textContent = 'Erro ao enviar. Tente novamente.';
                feedbackDiv.style.display = 'block';
                
                setTimeout(() => {
                    feedbackDiv.style.display = 'none';
                }, 5000);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
});