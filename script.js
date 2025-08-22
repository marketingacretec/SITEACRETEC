document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trainingEvaluationForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const tabs = document.querySelectorAll('.tab-content');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    // Função para alternar abas
    function switchTab(targetTabId) {
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.id === targetTabId) {
                tab.classList.add('active');
            }
        });
    }

    // Adicionar eventos aos botões "Próximo" e "Anterior"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Manipular envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('.submit-btn');
        const spinner = submitButton.querySelector('.fas.fa-spinner');
        
        // Exibir spinner
        spinner.style.display = 'inline-block';
        submitButton.disabled = true;

        const formData = new FormData(form);
        
        // Logar dados do formulário
        for (const [key, value] of formData.entries()) {
            console.log(`FormData: ${key} = ${value}`);
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Formulário enviado com sucesso!');
                form.style.display = 'none';
                thankYouMessage.style.display = 'block';
            } else {
                console.error('Erro ao enviar formulário:', response.status, response.statusText);
                alert('Erro ao enviar a avaliação. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao enviar a avaliação: ' + error.message);
        } finally {
            spinner.style.display = 'none';
            submitButton.disabled = false;
        }
    });
});