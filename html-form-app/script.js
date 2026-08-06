document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted with data:', data);

        form.style.display = 'none';
        successMessage.classList.remove('hidden');

        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            successMessage.classList.add('hidden');
        }, 5000);
    });

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.target.style.borderColor = '#f56565';
        });

        input.addEventListener('input', function(e) {
            if (e.target.checkValidity()) {
                e.target.style.borderColor = '#e2e8f0';
            }
        });
    });
});
