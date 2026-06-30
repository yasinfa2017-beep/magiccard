const firebaseConfig = {
    apiKey: "AIzaSyAMCMUTDGcBbiM_z64ddx7KWauL9VxTrqs",
    authDomain: "my-aesthetic-site.firebaseapp.com",
    projectId: "my-aesthetic-site",
    storageBucket: "my-aesthetic-site.firebasestorage.app",
    messagingSenderId: "352991997974",
    appId: "1:352991997974:web:924488db53956ddb278537",
    measurementId: "G-XN1SYN7Z7Y"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let localPhotoBase64 = "";
let currentBgColor = "#ffccd5";

function changeTheme(color) {
    currentBgColor = color;
    const card = document.getElementById('resultCard');
    card.style.backgroundColor = color;

    if (color === '#121212') {
        card.style.color = '#ffffff';
        document.querySelector('.card-header').style.color = '#ff9ebb';
        document.getElementById('resInsta').style.color = '#ff9ebb';
    } else {
        card.style.color = '#4a3e43';
        document.querySelector('.card-header').style.color = '#d6336c';
        document.getElementById('resInsta').style.color = '#736269';
    }
}

document.getElementById('userPhoto').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            localPhotoBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector('.submit-btn').addEventListener('click', function () {

    let name = document.getElementById('userName').value;
    let insta = document.getElementById('userInsta').value || '';
    let age = document.getElementById('userAge').value;
    let hobby = document.getElementById('userHobby').value || 'لا يوجد';
    let food = document.getElementById('favFood').value || 'لا يوجد';
    let drink = document.getElementById('favDrink').value || 'لا يوجد';
    let hated = document.getElementById('mostHated').value || 'الروتين';
    let friend = document.getElementById('bestFriend').value || 'الجميع';
    let customId = document.getElementById('cardCustomId').value;

    let photoInput = document.getElementById('userPhoto');
    let photoFile = photoInput.files[0];

    if (name === "" || age === "" || customId === "" || !photoFile) {
        alert("لطفاً، املئي حقول الاسم، العمر، الرقم التعريفي، وارفعي صورتكِ الشخصية! ✨");
        return;
    }

    document.querySelector('.submit-btn').innerText = "جاري رفع الصورة السحرية... ⏳";
    document.querySelector('.submit-btn').disabled = true;

    document.getElementById('resPhoto').src = localPhotoBase64;
    document.getElementById('resInsta').innerText = insta;
    document.getElementById('resName').innerText = name;
    document.getElementById('resAge').innerText = age;
    document.getElementById('resHobby').innerText = hobby;
    document.getElementById('resFood').innerText = food;
    document.getElementById('resDrink').innerText = drink;
    document.getElementById('resHated').innerText = hated;
    document.getElementById('resFriend').innerText = friend;

    document.getElementById('resultCard').style.animation = "fadeIn 0.5s ease-in-out";
    document.getElementById('bioForm').style.display = 'none';
    document.getElementById('resultWrapper').style.display = 'block';

    triggerSparkles();

    let formData = new FormData();
    formData.append("image", photoFile);

    let imgbbApiKey = "00ffc5cb565e8af7fb4bc8724d673d04";

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let photoUrl = data.data.url;

                db.collection("users_bios").add({
                    card_id: customId,
                    username: name,
                    instagram: insta,
                    user_age: age,
                    user_hobby: hobby,
                    favorite_food: food,
                    favorite_drink: drink,
                    hated_thing: hated,
                    best_friend: friend,
                    photo_url: photoUrl,
                    submitted_at: firebase.firestore.FieldValue.serverTimestamp()
                })
                    .then(() => console.log("تم حفظ البيانات بنجاح!"))
                    .catch(error => console.error("حدث خطأ في Firestore:", error));
            } else {
                console.error("فشل الرفع السحابي للصورة ولكن تم العرض محلياً بنجاح.");
            }
            resetButton();
        })
        .catch(error => {
            console.error("عذراً، حدثت مشكلة في الرفع السحابي:", error);
            resetButton();
        });
});

function resetButton() {
    document.querySelector('.submit-btn').innerText = "توليد البطاقة السحرية 🪄";
    document.querySelector('.submit-btn').disabled = false;
}

// 🔄 دالة إعادة المحاولة بعد التعديل لتنظيف الحقول بالكامل والذاكرة المؤقتة للصور
function goBack() {
    document.getElementById('bioForm').style.display = 'block';
    document.getElementById('resultWrapper').style.display = 'none';

    // تفريغ كافة المدخلات والذاكرة المخزنة
    document.getElementById('bioForm').reset();
    localPhotoBase64 = "";

    // تفريغ قيم العرض في البطاقة
    document.getElementById('resPhoto').src = "";
    document.getElementById('resInsta').innerText = "";
    document.getElementById('userPhoto').value = "";
}

function triggerSparkles() {
    const emojis = ['✨', '🌸', '💖', '👑', '💫'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.setAttribute('style', `
                position: fixed;
                font-size: 20px;
                pointer-events: none;
                left: ${Math.random() * window.innerWidth}px;
                top: ${(window.innerHeight / 2) + (Math.random() * 200 - 100)}px;
                animation: fadeIn 1.5s forwards;
            `);
            sparkle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            document.body.appendChild(sparkle);
            setTimeout(() => { sparkle.remove(); }, 1500);
        }, i * 50);
    }
}

function shareToInstagramStory() {
    const myWebsiteUrl = "https://generatingthemagiccard.online";

    navigator.clipboard.writeText(myWebsiteUrl).then(() => {
        const card = document.getElementById('resultCard');
        card.style.animation = "none";
        card.style.opacity = "1";

        html2canvas(card, {
            scale: 3,
            useCORS: true,
            backgroundColor: currentBgColor,
            logging: false
        }).then(canvas => {
            const imageLink = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = `Aesthetic_Bio.png`;
            link.href = imageLink;
            link.click();

            card.style.animation = "fadeIn 0.5s ease-in-out";

            alert("✨ تم حفظ بطاقتكِ في الاستوديو ونسخ رابط الموقع تلقائياً! \n\n سيفتح إنستغرام الآن: اختر البطاقة، واعملِ 'لصق' (Paste) داخل ملصق الروابط (Link Sticker) ليتمكن أصدقاؤكِ من صنع بطاقتهم الخاصة ! 💖");

            window.location.href = "instagram://story-camera";

        }).catch(error => {
            alert("عذراً، حدث خطأ أثناء إعداد الصورة.");
            console.error(error);
        });

    }).catch(err => {
        alert("لطفاً، قومي بحفظ الصورة ومشاركتها يدوياً مع صديقاتكِ! ✨");
    });
}