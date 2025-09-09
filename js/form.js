document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulation-form');
    const formParts = document.querySelectorAll('.form-part');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    
    // Elementos para controle do campo de valor de entrada
    const entradaSimRadio = document.getElementById('entrada-sim');
    const entradaNaoRadio = document.getElementById('entrada-nao');
    const valorEntradaContainer = document.getElementById('valor-entrada-container');
    const valorEntradaInput = document.getElementById('valor-entrada');
    
    let currentPart = 1;
    
    // Configurar evento para mostrar/ocultar campo de valor de entrada
    if (entradaSimRadio && entradaNaoRadio && valorEntradaContainer) {
        entradaSimRadio.addEventListener('change', function() {
            if (this.checked) {
                valorEntradaContainer.style.display = 'block';
                valorEntradaInput.setAttribute('required', 'true');
            }
        });
        
        entradaNaoRadio.addEventListener('change', function() {
            if (this.checked) {
                valorEntradaContainer.style.display = 'none';
                valorEntradaInput.removeAttribute('required');
                valorEntradaInput.value = '';
            }
        });
    }
    
    // Máscara para telefone
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            }
            if (value.length > 10) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Navegar para a próxima parte do formulário
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentFormPart = this.closest('.form-part');
            if (validateFormPart(currentFormPart)) {
                goToPart(currentPart + 1);
            }
        });
    });
    
    // Navegar para a parte anterior do formulário
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            goToPart(currentPart - 1);
        });
    });
    
   
    // Validar a parte atual do formulário
    function validateFormPart(formPart) {
        const inputs = formPart.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        // Esconder todas as mensagens de erro primeiro
        formPart.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Validação especial para a parte 4 (contatos)
        if (formPart.dataset.part === '4') {
            isValid = validateContactPart(formPart);
            if (!isValid) return false;
        }
        
        inputs.forEach(input => {
            // Pular validação se o campo estiver oculto
            if (input.offsetParent === null) return;
            
             // Validação para campo nome vazio
            if (input.id === 'full-name' && input.hasAttribute('required')) {
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input);
                    // Mostrar mensagem de erro específica para nome vazio
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.textContent = 'Por favor, informe seu nome completo';
                        errorMsg.style.display = 'block';
                    }
                    return;
                }
            }

            // Validar campo de nome com regex melhorado
            if (input.id === 'full-name' && input.value) {
                const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
                if (!nameRegex.test(input.value)) {
                    isValid = false;
                    showFieldError(input);
                    // Mostrar mensagem de erro específica
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                         errorMsg.textContent = 'Por favor, digite apenas letras e espaços';
                        errorMsg.style.display = 'block';
                    }
                    return;
                }
            }
            
            // Validação para campos vazios
            if (!input.value.trim() && input.hasAttribute('required')) {
                isValid = false;
                showFieldError(input);
                return;
            }
            
            // Validação específica para email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showFieldError(input);
                    // Mostrar mensagem de erro específica para email
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.textContent = 'Email inválido. Use o formato seu@email.com';
                        errorMsg.style.display = 'block';
                    }
                    return;
                }
            }
            
            // Validação específica para telefone
            if (input.id === 'phone-number' && input.value) {
                const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    showFieldError(input);
                    // Mostrar mensagem de erro específica para telefone
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.textContent = 'Formato inválido. Use (XX) XXXXX-XXXX';
                        errorMsg.style.display = 'block';
                    }
                    return;
                }
            }
        });
        
        return isValid;
    }

    // Validação especial para a parte de contatos
    function validateContactPart(formPart) {
        const phoneInput = document.getElementById('phone-number');
        const emailInput = document.getElementById('email');
        const whatsappCheckbox = document.getElementById('WhatsApp');
        const telefoneCheckbox = document.getElementById('telefone');
        const smsCheckbox = document.getElementById('SMS');
        const emailCheckbox = document.getElementById('email-contact');
        
        const hasPhone = phoneInput.value.trim() !== '';
        const hasEmail = emailInput.value.trim() !== '';
        const hasPhoneContact = whatsappCheckbox?.checked || telefoneCheckbox?.checked || smsCheckbox?.checked;
        const hasEmailContact = emailCheckbox?.checked;
        
        // Verificar se tem pelo menos um contato válido completo
        const hasValidPhoneContact = hasPhone && hasPhoneContact;
        const hasValidEmailContact = hasEmail && hasEmailContact;
        const hasValidContact = hasValidPhoneContact || hasValidEmailContact;
        
        // Caso 1: Não tem nenhum contato válido completo
        if (!hasValidContact) {
            // Verificar qual é o problema específico
            if (!hasPhone && !hasEmail && !hasPhoneContact && !hasEmailContact) {
                showContactError('Por favor, informe pelo menos um telefone ou email para contato');
            } 
            else if (hasPhone && !hasPhoneContact && !hasEmailContact) {
                showContactError('Por favor, selecione pelo menos uma forma de contato de telefone');
            }
            else if (hasEmail && !hasEmailContact && !hasPhoneContact) {
                showContactError('Por favor, selecione para podemos entrar em contato pelo e-mail');
            }
            else if (hasPhoneContact && !hasPhone) {
                showContactError('Você selecionou contato por telefone, mas não informou um número de telefone');
            }
            else if (hasEmailContact && !hasEmail) {
                showContactError('Você selecionou contato por email, mas não informou um endereço de email');
            }
            else if (hasPhone && hasEmail && !hasPhoneContact && !hasEmailContact) {
                showContactError('Por favor, selecione pelo menos uma forma de contato');
            }
            else {
                showContactError('Por favor, complete suas informações de contato');
            }
            
            goToPart(3);
            return false;
        }
        
        // Validações de formato (apenas para os campos preenchidos)
        if (hasPhone) {
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                showFieldError(phoneInput);
                showContactError('Formato de telefone inválido. Use (XX) XXXXX-XXXX');
                goToPart(3);
                return false;
            }
        }
        
        if (hasEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showFieldError(emailInput);
                showContactError('Formato de email inválido. Use exemplo@email.com');
                goToPart(3);
                return false;
            }
        }
        
        // Se chegou até aqui, tem pelo menos um contato válido
        return true;
    }

// Mostrar erro de contato
function showContactError(message) {
    // Remover mensagens de erro anteriores
    const existingError = document.getElementById('contact-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Criar novo elemento de erro
    const errorDiv = document.createElement('div');
    errorDiv.id = 'contact-error-message';
    errorDiv.className = 'contact-error-message';
    errorDiv.textContent = message;
    
    // Inserir a mensagem de erro no formulário
    const formPart = document.querySelector('.form-part[data-part="3"]');
    if (formPart) {
        const firstFormGroup = formPart.querySelector('.form-group');
        if (firstFormGroup) {
            formPart.insertBefore(errorDiv, firstFormGroup);
        } else {
            formPart.prepend(errorDiv);
        }
    }
    
    // Rolagem suave para mostrar o erro
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remover o erro após 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Mostrar erro em campo específico
function showFieldError(input) {
    // Adicionar estilo de erro
    input.classList.add('field-error');
    
    // Remover o estilo após 2 segundos
    setTimeout(() => {
        input.classList.remove('field-error');
    }, 2000);
}

    // Mostrar erro de contato
    function showContactError(message) {
        // Remover mensagens de erro anteriores
        const existingError = document.getElementById('contact-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Criar novo elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.id = 'contact-error-message';
        errorDiv.className = 'contact-error-message';
        errorDiv.textContent = message;
        
        // Inserir a mensagem de erro no formulário
        const formPart = document.querySelector('.form-part[data-part="3"]');
        if (formPart) {
            const firstFormGroup = formPart.querySelector('.form-group');
            if (firstFormGroup) {
                formPart.insertBefore(errorDiv, firstFormGroup);
            } else {
                formPart.prepend(errorDiv);
            }
        }
        
        // Rolagem suave para mostrar o erro
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remover o erro após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Mostrar erro no campo
    function showFieldError(input) {
        input.style.borderColor = 'red';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    }

    
    // Navegar para uma parte específica do formulário
    function goToPart(partNumber) {
        if (partNumber < 1 || partNumber > formParts.length) return;

        // Esconder todas as partes
        formParts.forEach(part => {
            part.classList.remove('active');
        });

        // Mostrar a parte atual
        const currentPartElement = document.querySelector(`.form-part[data-part="${partNumber}"]`);
        if (currentPartElement) {
            currentPartElement.classList.add('active');
            
            // 👇 Forçar foco sem scroll no primeiro campo da nova parte
            const nextInput = currentPartElement.querySelector('input, select, textarea');
            if (nextInput) {
                nextInput.focus({ preventScroll: true });
            }
        }

        // Atualizar indicador de progresso
        progressSteps.forEach(step => {
            step.classList.remove('active');
        });
        for (let i = 1; i <= partNumber; i++) {
            const step = document.querySelector(`.progress-step[data-step="${i}"]`);
            if (step) step.classList.add('active');
        }

        currentPart = partNumber;

        // Rolar para o topo do formulário
        document.querySelector('header').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    
    // Enviar formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateFormPart(document.querySelector('.form-part.active'))) {
            // Coletar todos os dados do formulário
            const formData = {
                region: document.getElementById('property-type').value,
                name: document.getElementById('full-name').value,
                phone: document.getElementById('phone-number').value,
                email: document.getElementById('email').value,
                fgts: document.querySelector('input[name="fgts"]:checked')?.value,
                hasEntryValue: document.querySelector('input[name="entrada-valor"]:checked')?.value,
                entryValue: document.getElementById('valor-entrada')?.value || 0
            };
            
            console.log('Dados do formulário:', formData);
            
            // Mostrar mensagem de sucesso
            showSuccessMessage();
            
            // Limpar formulário
            form.reset();
            
            // Esconder campo de valor de entrada após reset
            if (valorEntradaContainer) {
                valorEntradaContainer.style.display = 'none';
            }
            
            // Voltar para o início após 3 segundos
            setTimeout(() => {
                goToPart(1);
                // Remover a mensagem de sucesso
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.remove();
                }
            }, 3000);
        }
    });
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        // Remover mensagem anterior se existir
        const existingMessage = document.getElementById('success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Criar elemento para a mensagem
        const successMessage = document.createElement('div');
        successMessage.id = 'success-message';
        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        successMessage.innerHTML = `
            <div style="
                background-color: white;
                padding: 40px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <i class="fas fa-check-circle" style="font-size: 60px; color: #2ecc71; margin-bottom: 20px;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 24px;">Sucesso!</h3>
                <p style="color: #7f8c8d; line-height: 1.5;">Simulação solicitada com sucesso. Em breve um Corretor entrará em contato com sua simulação.</p>
            </div>
        `;
        
        // Adicionar ao documento
        document.body.appendChild(successMessage);
        
        // Animar a entrada
        setTimeout(() => {
            successMessage.style.opacity = '1';
        }, 10);
        console.log('Formulário enviado com sucesso!');
    }
});