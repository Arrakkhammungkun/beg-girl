document.addEventListener("DOMContentLoaded", () => {
  // กำหนดตัวแปรหน้าจอต่างๆ
  const loadingScreen = document.getElementById("loading-screen");
  const mainScreen = document.getElementById("main-screen");
  const letterScreen = document.getElementById("letter-screen");
  const fillLoveScreen = document.getElementById("fill-love-screen");
  const flowerScreen = document.getElementById("flower-screen");
  const forgiveScreen = document.getElementById("forgive-screen");
  const successModal = document.getElementById("success-modal");

  // กำหนดตัวแปรปุ่ม
  const nextScreenBtn = document.getElementById("next-screen-btn");
  const openLetterBtn = document.getElementById("open-letter-btn");
  const forgiveBtn = document.getElementById("forgive-btn");
  const nextToForgiveBtn = document.getElementById("next-to-forgive-btn");

  // 1. Loading -> Main
  setTimeout(() => {
    nextScreenBtn.classList.remove("hidden-btn");
    nextScreenBtn.classList.add("show-btn");
  }, 4000);

  nextScreenBtn.addEventListener("click", () => {
    switchScreen(loadingScreen, mainScreen);
  });

  const message = `ถึง... ดีดี๋แฟนของเค้า\n\nเค้าขอโทษจริงๆ เรื่องวันนั้น\nเค้ายอมรับว่ามันเกิดจากความไม่รอบคอบของเค้า\nเค้าเสียใจที่ทำให้เธอเสียความรู้สึก เค้ารู้สึกผิดจริงๆครับ\nจากใจเลยนะ\n\nต่อไปเค้าจะระวังให้มากกว่านี้ครับ\nและดูแลความรู้สึกของแฟนให้ดีกว่าเดิมนะะครับ...\n\n- รักดีดี๋ที่สุดเลยนะคั้บ -`;

  // 2. Main -> Letter (พร้อมพิมพ์ดีด)
  const typewriterText = document.getElementById("typewriter-text");

  openLetterBtn.addEventListener("click", () => {
    switchScreen(mainScreen, letterScreen, () => {
      typeWriterEffect(message, typewriterText, 40);
    });
  });

  // 3. Letter -> Fill Love
  forgiveBtn.addEventListener("click", () => {
    switchScreen(letterScreen, fillLoveScreen);
  });

  // ==========================================
  // ฟีเจอร์: กดค้างเติมรัก (รูปเลื่อนเข้าหากัน)
  // ==========================================
  const heartBtn = document.getElementById("heart-hold-btn");
  const avatarSpacer = document.getElementById("avatar-spacer");

  // ดึงรูปภาพ 2 ฝั่งมาขยับ
  const avatars = document.querySelectorAll(".avatar-track .avatar");
  const boyAvatar = avatars[0]; // รูปฝั่งซ้าย
  const girlAvatar = avatars[1]; // รูปฝั่งขวา

  let holdInterval;
  let movement = 0;
  // กำหนดระยะทางให้วิ่งมาชนกัน (สำหรับมือถือและคอม)
  const maxMoveDistance = window.innerWidth < 768 ? 85 : 130;

  function startHolding(e) {
    if (e) e.preventDefault();
    heartBtn.classList.add("active-press");
    avatarSpacer.style.opacity = "0"; // ซ่อนเส้นประ

    holdInterval = setInterval(() => {
      movement += 2; // ความเร็วในการเลื่อน

      // สั่งให้รูปขยับเข้าหากัน
      if (boyAvatar && girlAvatar) {
        boyAvatar.style.transform = `translateX(${movement}px)`;
        girlAvatar.style.transform = `translateX(-${movement}px)`;
      }

      if (movement >= maxMoveDistance) {
        movement = maxMoveDistance;
        clearInterval(holdInterval);

        heartBtn.removeEventListener("mousedown", startHolding);
        heartBtn.removeEventListener("touchstart", startHolding);

        setTimeout(() => {
          switchScreen(fillLoveScreen, flowerScreen);
        }, 800);
      }
    }, 30);
  }

  function stopHolding(e) {
    if (e) e.preventDefault();
    heartBtn.classList.remove("active-press");
    clearInterval(holdInterval);

    // ถ้าปล่อยมือก่อนชน ให้เด้งกลับที่เดิม
    if (movement < maxMoveDistance) {
      movement = 0;
      if (boyAvatar && girlAvatar) {
        boyAvatar.style.transform = `translateX(0px)`;
        girlAvatar.style.transform = `translateX(0px)`;
      }
      avatarSpacer.style.opacity = "1"; // โชว์เส้นประกลับมา
    }
  }

  heartBtn.addEventListener("mousedown", startHolding);
  heartBtn.addEventListener("mouseup", stopHolding);
  heartBtn.addEventListener("mouseleave", stopHolding);
  heartBtn.addEventListener("touchstart", startHolding, { passive: false });
  heartBtn.addEventListener("touchend", stopHolding, { passive: false });

  // 4. Flower -> Forgive Screen
  nextToForgiveBtn.addEventListener("click", () => {
    switchScreen(flowerScreen, forgiveScreen);
  });

  // ==========================================
  // ฟีเจอร์: ปุ่มหายโกรธนะ (บังคับกดเต็มจอ แก้บัคแล้ว!)
  // ==========================================
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const forgiveText = document.getElementById("forgive-text");

  // หาตัวการ์ดเพื่อปลดล็อกแอนิเมชัน
  const forgiveCardContainer =
    document.getElementById("forgive-card-container") ||
    yesBtn.closest(".card");

  let noClickCount = 0;
  const funnyTexts = [
    "หายโกรธเค้าเถอะนะคนดี เค้าจะทำตัวน่ารักๆ",
    "ไม่ดีกันจริงๆ หรอออ 🥺",
    "ดีกันน้าาา แฟนนค้าบบบบ",
    "รักนะก๊าบบ ยอมแล้วววว",
  ];

  noBtn.addEventListener("click", () => {
    noClickCount++;

    if (noClickCount < 3) {
      forgiveText.innerText = funnyTexts[noClickCount];
      let yesScale = 1 + noClickCount * 0.4;
      let noScale = 1 - noClickCount * 0.2;
      yesBtn.style.transform = `scale(${yesScale})`;
      noBtn.style.transform = `scale(${noScale})`;
    }

    // ถ้ายื้อกดครบ 3 ครั้ง บังคับกดเต็มหน้าจอ!
    if (noClickCount >= 3) {
      noBtn.style.display = "none";
      forgiveText.innerText = "บังคับกดแล้ว! ต้องดีกันแล้วแหละ ❤️";

      // 1. ปลดล็อกแอนิเมชันของการ์ด เพื่อให้ปุ่มขยายทะลุหน้าจอได้ 100%
      if (forgiveCardContainer) {
        forgiveCardContainer.style.transform = "none";
        forgiveCardContainer.style.animation = "none";
      }

      // 2. เอาคลาส btn ออก เพื่อลบเอฟเฟกต์ hover ที่ทำให้ปุ่มหด
      yesBtn.classList.remove("btn");

      // 3. บังคับสไตล์ให้เต็มหน้าจอด้วย JS ทับไปเลย
      yesBtn.style.position = "fixed";
      yesBtn.style.top = "0";
      yesBtn.style.left = "0";
      yesBtn.style.width = "100vw";
      yesBtn.style.height = "100vh";
      yesBtn.style.zIndex = "9999";
      yesBtn.style.borderRadius = "0";
      yesBtn.style.margin = "0";
      yesBtn.style.transform = "none"; // รีเซ็ตการขยายก่อนหน้า
      yesBtn.style.fontSize = "3rem";
      yesBtn.style.display = "flex";
      yesBtn.style.justifyContent = "center";
      yesBtn.style.alignItems = "center";
      yesBtn.style.background = "linear-gradient(135deg, #b06ab3, #4568dc)";
      yesBtn.style.color = "white";
      yesBtn.style.border = "none";
      yesBtn.style.cursor = "pointer";

      yesBtn.innerHTML = "หายโกรธแล้วคั้บบบ! ✨";
    }
  });

  // 5. กดปุ่ม "หายโกรธแล้ว" -> โชว์ Modal สำเร็จ!
  yesBtn.addEventListener("click", () => {
    if (noClickCount >= 3) {
      // ถ้าปุ่มมันเต็มจออยู่ ให้ซ่อนปุ่มทิ้งไปเลยตอนกดเสร็จ
      yesBtn.style.display = "none";
    }
    successModal.classList.remove("hidden");
  });

  // ==========================================
  // ฟังก์ชันเสริม (Helper Functions)
  // ==========================================

  function switchScreen(hideScreen, showScreen, callback = null) {
    hideScreen.style.opacity = "0";
    setTimeout(() => {
      hideScreen.style.display = "none";
      showScreen.classList.remove("hidden");
      if (callback) callback();
    }, 500);
  }

  function typeWriterEffect(text, element, speed) {
    element.innerHTML = "";
    let i = 0;
    function typing() {
      if (i < text.length) {
        if (text.charAt(i) === "\n") {
          element.innerHTML += "<br>";
        } else {
          element.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(typing, speed);
      }
    }
    setTimeout(typing, 800);
  }
});
