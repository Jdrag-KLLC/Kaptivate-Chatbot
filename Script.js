const askButton = document.getElementById('askButton');
const userQuestionInput = document.getElementById('userQuestion');
const answerText = document.getElementById('answerText');
const basicQuestionButtons = document.querySelectorAll('.basic-q-btn');
const loadingIndicator = document.getElementById('loadingIndicator');

// IMPORTANT: Replace with your DEPLOYED backend API endpoint URL
const BACKEND_API_URL = 'https://andrestest-307401118000.europe-west1.run.app'; // Or your Netlify, AWS, etc. URL

async function getAnswer(question) {
    if (!question.trim()) {
        answerText.textContent = "Please enter a question.";
        return;
    }

    loadingIndicator.style.display = 'block';
    answerText.textContent = ""; // Clear previous answer

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        answerText.textContent = data.answer || "No answer received.";

    } catch (error) {
        console.error('Error fetching answer:', error);
        answerText.textContent = `Error: ${error.message}. Check the console for details. Is the backend server running and accessible?`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

askButton.addEventListener('click', () => {
    const question = userQuestionInput.value;
    getAnswer(question);
});

userQuestionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Allow Shift+Enter for new lines
        event.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
        const question = userQuestionInput.value;
        getAnswer(question);
    }
});

basicQuestionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        userQuestionInput.value = question; // Populate the textarea
        getAnswer(question);
    });
});
