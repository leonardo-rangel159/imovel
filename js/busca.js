// Adicionando interatividade às opções de busca
document.querySelectorAll('.search-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove a classe active de todas as opções
        document.querySelectorAll('.search-option').forEach(opt => {
            opt.classList.remove('active');
            const checkbox = opt.querySelector('.custom-checkbox');
            checkbox.classList.remove('checked');
        });
                
        // Adiciona a classe active à opção clicada
        this.classList.add('active');
        const checkbox = this.querySelector('.custom-checkbox');
        checkbox.classList.add('checked');
    });
});
    