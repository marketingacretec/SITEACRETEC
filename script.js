document.addEventListener('DOMContentLoaded', function() {
    // Função para validar se todos os campos obrigatórios em uma aba estão preenchidos
    function validateTab(tabId) {
        const tab = document.getElementById(tabId);
        const requiredFields = tab.querySelectorAll('input[required], select[required], textarea[required]');
        let allFilled = true;

        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const groupName = field.name;
                const checked = tab.querySelector(`input[name="${groupName}"]:checked`);
                if (!checked) {
                    allFilled = false;
                }
            } else if (field.type === 'checkbox') {
                if (!field.checked) {
                    allFilled = false;
                }
            } else if (!field.value.trim()) {
                allFilled = false;
            }
        });

        return allFilled;
    }

    // Configurar os botões "Próximo"
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            const currentTab = this.closest('.tab-content').id;
            const nextTabId = this.getAttribute('data-tab');

            if (!validateTab(currentTab)) {
                alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
                return;
            }

            // Mostrar a próxima aba
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            document.getElementById(nextTabId).style.display = 'block';
        });
    });

    // Configurar o botão "Anterior"
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            const prevTabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            document.getElementById(prevTabId).style.display = 'block';
        });
    });

    // Configurar o envio do formulário
    const form = document.getElementById('trainingEvaluationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const allTabs = ['info', 'estrutura', 'organizacao', 'instrutores', 'participantes'];
        let allValid = true;

        allTabs.forEach(tabId => {
            if (!validateTab(tabId)) {
                allValid = false;
            }
        });

        if (!allValid) {
            alert('Por favor, preencha todos os campos obrigatórios em todas as abas antes de enviar.');
            return;
        }

        // Log FormData para depuração
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            console.log(`FormData: ${key} = ${value}`);
        }

        // Enviar para o Sheet Monkey
        fetch('https://api.sheetmonkey.io/form/idKcZD9u6rigDPsrkTjrjF', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                form.style.display = 'none';
                document.getElementById('thankYouMessage').style.display = 'block';
                form.reset();
                setTimeout(() => {
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.style.display = 'none';
                    });
                    document.getElementById('info').style.display = 'block';
                    form.style.display = 'block';
                    document.getElementById('thankYouMessage').style.display = 'none';
                }, 3000);
            } else {
                alert('Erro ao enviar o formulário. Tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao enviar o formulário. Verifique sua conexão.');
        });
    });
});