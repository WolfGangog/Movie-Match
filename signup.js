document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('.signup-form');
  
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;
    const selectedPlan = signupForm.querySelector('input[name="plan"]:checked').value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Simulate successful signup
    window.location.href = 'movies.html';
  });
});