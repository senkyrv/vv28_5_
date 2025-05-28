document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const popupOverlay = document.getElementById('popupOverlay');
    const winnerText = document.getElementById('winner-text');
    const randomMessage = document.getElementById('random-message');
    const winnerImage = document.getElementById('winner-image');
    
    const rewards = [
        { name: 'Brýle Prada', image: 'img/prada1.jpg', color: '#FF69B4' },
        { name: 'Kabelka Karl Lagerfeld', image: 'img/kl.png', color: '#FF1493' },
        { name: 'Brýle Prada v2', image: 'img/prada2.png', color: '#DC143C' }
    ];

    const messages = [
        'Ty budeš ale kočka!',
        'To je přesně pro tebe, kočičko! ✨',
        'Tohle ti bude slušet, kočičko! 💫',
        'Tohle je přesně pro tebe, kočičko! 🎯',
        'Kočičko, tohle ti udělá radost! 🎁'
    ];

    let currentRotation = 0;
    let isSpinning = false;
    const images = rewards.map(reward => {
        const img = new Image();
        img.src = reward.image;
        return img;
    });

    function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

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

    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        rewards.forEach((reward, index) => {
            const startAngle = (index * 2 * Math.PI) / rewards.length + currentRotation;
            const endAngle = ((index + 1) * 2 * Math.PI) / rewards.length + currentRotation;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = reward.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + (endAngle - startAngle) / 2);
            
            const imgSize = radius * 0.5;
            ctx.drawImage(images[index], radius * 0.3, -imgSize/2, imgSize, imgSize);
            
            ctx.restore();
        });
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        
        drawArrow();
    }

    function spinWheel() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        
        const totalRotation = Math.random() * 10 + 5;
        const animationDuration = 5000;
        const startTime = Date.now();
        
        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            
            if (elapsed < animationDuration) {
                const progress = elapsed / animationDuration;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                currentRotation = easeOut * totalRotation * Math.PI * 2;
                drawWheel();
                
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                spinButton.disabled = false;
                
                const finalRotation = currentRotation % (2 * Math.PI);
                const sectorAngle = (2 * Math.PI) / rewards.length;
                let pointerAngle = (3 * Math.PI / 2 - finalRotation + 2 * Math.PI) % (2 * Math.PI);
                let winningIndex = Math.floor(pointerAngle / sectorAngle) % rewards.length;
                const winner = rewards[winningIndex];
                
                winnerText.textContent = winner.name;
                winnerImage.src = winner.image;
                randomMessage.textContent = getRandomMessage();
                popupOverlay.style.display = 'flex';
                setTimeout(() => {
                    showSpicySection();
                    console.log('Spicy sekce zobrazena');
                }, 100);
            }
        }
        
        animate();
    }

    window.closePopup = function() {
        popupOverlay.style.display = 'none';
    };

    Promise.all(images.map(img => new Promise(resolve => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = resolve;
        }
    }))).then(() => {
        drawWheel();
    });
    
    spinButton.addEventListener('click', spinWheel);

    const spicySection = document.getElementById('spicy-section');
    const spicyButton = document.getElementById('spicy-button');
    const spicyWheelSection = document.getElementById('spicyWheelSection');
    const spicyWheelCanvas = document.getElementById('spicyWheel');
    const spicySpinButton = document.getElementById('spicySpinButton');
    const spicyPopupOverlay = document.getElementById('spicyPopupOverlay');

    // Spicy kolo: 9x A a 1x 1 000 000 Kč, náhodně zamíchané
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const spicyRewards = shuffle([
        ...Array(9).fill({ name: 'SEX', color: '#ff69b4' }),
        { name: 'Dovolená', color: '#dc143c' }
    ]);
    let spicyCurrentRotation = 0;
    let spicyIsSpinning = false;

    function drawSpicyWheel() {
        const ctx = spicyWheelCanvas.getContext('2d');
        const centerX = spicyWheelCanvas.width / 2;
        const centerY = spicyWheelCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        ctx.clearRect(0, 0, spicyWheelCanvas.width, spicyWheelCanvas.height);
        spicyRewards.forEach((reward, index) => {
            const startAngle = (index * 2 * Math.PI) / spicyRewards.length + spicyCurrentRotation;
            const endAngle = ((index + 1) * 2 * Math.PI) / spicyRewards.length + spicyCurrentRotation;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = reward.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + (endAngle - startAngle) / 2);
            ctx.font = 'bold 22px Segoe UI';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(reward.name, radius * 0.65, 0);
            ctx.restore();
        });
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        // Arrow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX - 20, 20);
        ctx.lineTo(centerX + 20, 20);
        ctx.lineTo(centerX, 20 + 30);
        ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    function spinSpicyWheel() {
        if (spicyIsSpinning) return;
        spicyIsSpinning = true;
        spicySpinButton.disabled = true;
        const totalRotation = Math.random() * 10 + 5;
        const animationDuration = 5000;
        const startTime = Date.now();
        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            if (elapsed < animationDuration) {
                const progress = elapsed / animationDuration;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                spicyCurrentRotation = easeOut * totalRotation * Math.PI * 2;
                drawSpicyWheel();
                requestAnimationFrame(animate);
            } else {
                spicyIsSpinning = false;
                spicySpinButton.disabled = false;
                const finalRotation = spicyCurrentRotation % (2 * Math.PI);
                const sectorAngle = (2 * Math.PI) / spicyRewards.length;
                let pointerAngle = (3 * Math.PI / 2 - finalRotation + 2 * Math.PI) % (2 * Math.PI);
                let winningIndex = Math.floor(pointerAngle / sectorAngle) % spicyRewards.length;
                const spicyWinner = spicyRewards[winningIndex];
                document.getElementById('spicy-winner-text').textContent = `Vyhrála jsi: ${spicyWinner.name}`;
                spicyWheelSection.style.display = 'none';
                spicyPopupOverlay.style.display = 'flex';
            }
        }
        animate();
    }

    window.closeSpicyPopup = function() {
        spicyPopupOverlay.style.display = 'none';
    };

    // Po výhře v hlavním kole zobrazím Spicy sekci
    function showSpicySection() {
        spicySection.style.display = 'block';
    }

    // Po kliknutí na Spicy Kolo zobrazím Spicy Wheel
    if (spicyButton) {
        spicyButton.onclick = function() {
            spicySection.style.display = 'none';
            popupOverlay.style.display = 'none';
            spicyWheelSection.style.display = 'flex';
            spicyCurrentRotation = 0;
            setTimeout(() => {
                drawSpicyWheel();
                console.log('Spicy kolo zobrazeno a vykresleno');
            }, 50);
        };
    }
    if (spicySpinButton) {
        spicySpinButton.onclick = spinSpicyWheel;
    }
}); 