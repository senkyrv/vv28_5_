document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const popupOverlay = document.getElementById('popupOverlay');
    const winnerText = document.getElementById('winner-text');
    const randomMessage = document.getElementById('random-message');
    const winnerImage = document.getElementById('winner-image');
    
    const rewards = [
        { name: 'Brýle Prada', image: 'img/prada1.jpg', color: '#FF69B4' },  // Hot pink
        { name: 'Kabelka Karl Lagerfeld', image: 'img/kl.png', color: '#FF1493' },  // Deep pink
        { name: 'Brýle Prada v2', image: 'img/prada2.png', color: '#DC143C' }  // Crimson red
    ];

    const messages = [
        'Ty budeš ale kočka!',
        'Tohle ti bude určitě slušet! ✨',
        'Skvělá volba pro tebe! 💫',
        'To je přesně pro tebe! 🌟',
        'Nemohla sis vytočit lépe! 🎯',
        'Tohle ti udělá radost! 🎁'
    ];

    let currentRotation = 0;
    let isSpinning = false;
    const images = rewards.map(reward => {
        const img = new Image();
        img.src = reward.image;
        return img;
    });

    // Funkce pro náhodný výběr hlášky
    function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    // Nakreslí šipku
    function drawArrow() {
        const arrowX = canvas.width / 2;
        const arrowY = 20;
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(arrowX - 20, arrowY);
        ctx.lineTo(arrowX + 20, arrowY);
        ctx.lineTo(arrowX, arrowY + 30);
        ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    // Nakreslí kolo
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Pro každou odměnu vytvoří výseč
        rewards.forEach((reward, index) => {
            const startAngle = (index * 2 * Math.PI) / rewards.length + currentRotation;
            const endAngle = ((index + 1) * 2 * Math.PI) / rewards.length + currentRotation;
            
            // Nakreslí výseč
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Použije barvu z konfigurace odměny
            ctx.fillStyle = reward.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Přidá obrázek
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + (endAngle - startAngle) / 2);
            
            // Zvětšené obrázky
            const imgSize = radius * 0.5; // Zvětšili jsme velikost obrázku
            ctx.drawImage(images[index], radius * 0.3, -imgSize/2, imgSize, imgSize);
            
            ctx.restore();
        });
        
        // Nakreslí středový bod
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        
        // Nakreslí šipku
        drawArrow();
    }

    // Funkce pro roztočení kola
    function spinWheel() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        
        // Náhodný počet otáček (5-10) plus náhodná část pro konečnou pozici
        const totalRotation = Math.random() * 10 + 5;
        const animationDuration = 5000; // 5 sekund
        const startTime = Date.now();
        
        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            
            if (elapsed < animationDuration) {
                // Easing funkce pro zpomalení
                const progress = elapsed / animationDuration;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                currentRotation = easeOut * totalRotation * Math.PI * 2;
                drawWheel();
                
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                spinButton.disabled = false;
                
                // Vypočítá výherní odměnu
                const finalRotation = currentRotation % (Math.PI * 2);
                const winningIndex = Math.floor((finalRotation / (Math.PI * 2)) * rewards.length);
                const winner = rewards[winningIndex];
                
                // Zobrazí popup s výhrou a náhodnou hláškou
                winnerText.textContent = winner.name;
                winnerImage.src = winner.image;
                randomMessage.textContent = getRandomMessage();
                popupOverlay.style.display = 'flex';
            }
        }
        
        animate();
    }

    // Funkce pro zavření popupu
    window.closePopup = function() {
        popupOverlay.style.display = 'none';
    };

    // Počkáme na načtení všech obrázků před prvním vykreslením
    Promise.all(images.map(img => new Promise(resolve => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = resolve;
        }
    }))).then(() => {
        // První vykreslení kola
        drawWheel();
    });
    
    // Přidání event listeneru na tlačítko
    spinButton.addEventListener('click', spinWheel);
}); 