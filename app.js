document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const emojiCount = document.getElementById('emojiCount');
    const emojiContainer = document.getElementById('emojiContainer');

    async function fetchEmojis() {
        try {
            const response = await fetch('emojis.json');
            if (!response.ok) throw new Error('Failed to fetch emojis');
            return await response.json();
        } catch (error) {
            console.error('Error loading emojis:', error);
            alert('Failed to load emojis. Please try again later.');
            return null;
        }
    }

    function getRandomEmojis(emojis, count) {
        const emojiArray = Object.keys(emojis);
        const shuffled = emojiArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function createEmojiCard(emoji, data) {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        
        const emojiElement = document.createElement('span');
        emojiElement.className = 'emoji';
        emojiElement.textContent = emoji;
        
        const nameElement = document.createElement('span');
        nameElement.className = 'emoji-name';
        nameElement.textContent = data[emoji].name;
        
        card.appendChild(emojiElement);
        card.appendChild(nameElement);

        // Add click event to copy emoji to clipboard
        card.addEventListener('click', (e) => {
            // Add click animation
            card.classList.add('click-animation');
            setTimeout(() => {
                card.classList.remove('click-animation');
            }, 300);

            copyToClipboard(emoji);
        });

        return card;
    }

    async function generateEmojis() {
        const count = Math.min(parseInt(emojiCount.value) || 3, 100);
        emojiCount.value = count; // Ensure valid value
        
        const emojis = await fetchEmojis();
        if (!emojis) return;

        const randomEmojis = getRandomEmojis(emojis, count);
        emojiContainer.innerHTML = '';
        
        randomEmojis.forEach(emoji => {
            const card = createEmojiCard(emoji, emojis);
            emojiContainer.appendChild(card);
        });
    }

    generateBtn.addEventListener('click', generateEmojis);
    // Generate initial emojis on load
    generateEmojis();
});

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification(text); // Pass the emoji to the notification function
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Show in-app notification with the emoji
function showCopyNotification(emoji) {
    const notification = document.getElementById('copyNotification');
    notification.textContent = `${emoji} Copied to Clipboard!`; // Prepend the emoji to the message
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Play Sound When Clicking Button
const buttonSound = new Audio('click.mp3'); // Create an Audio object

// Function to play the sound
function playButtonSound() {
    buttonSound.play();
}

// Add event listeners to buttons
document.getElementById('generateBtn').addEventListener('click', playButtonSound);
document.getElementById('emojiContainer').addEventListener('click', playButtonSound);