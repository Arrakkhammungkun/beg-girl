document.addEventListener("DOMContentLoaded", () => {
  // กำหนดตัวแปรหน้าจอต่างๆ
  const loadingScreen = document.getElementById("loading-screen");
  const mainScreen = document.getElementById("main-screen");
  const letterScreen = document.getElementById("letter-screen");
  const fillLoveScreen = document.getElementById("fill-love-screen");
  const flowerScreen = document.getElementById("flower-screen");
  const forgiveScreen = document.getElementById("forgive-screen");
  const successModal = document.getElementById("success-modal");

  // กำหนดตัวแปรปุ่มและเพลง
  const nextScreenBtn = document.getElementById("next-screen-btn");
  const openLetterBtn = document.getElementById("open-letter-btn");
  const forgiveBtn = document.getElementById("forgive-btn");
  const nextToForgiveBtn = document.getElementById("next-to-forgive-btn");

  const bgMusic = document.getElementById("bg-music");
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  let isMusicPlaying = false;

  // 1. Loading -> Main
  setTimeout(() => {
    nextScreenBtn.classList.remove("hidden-btn");
    nextScreenBtn.classList.add("show-btn");
  }, 4000);

  nextScreenBtn.addEventListener("click", () => {
    switchScreen(loadingScreen, mainScreen);

    // เริ่มเล่นเพลงเมื่อผู้ใช้กดคลิกครั้งแรก
    bgMusic
      .play()
      .then(() => {
        isMusicPlaying = true;
        soundToggleBtn.classList.remove("hidden"); // โชว์ปุ่มเสียง
      })
      .catch((e) => console.log("เบราว์เซอร์บล็อกการเล่นเพลงอัตโนมัติ"));
  });

  // ระบบปุ่มเปิด-ปิดเสียง
  soundToggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      soundToggleBtn.innerText = "🔇";
    } else {
      bgMusic.play();
      soundToggleBtn.innerText = "🔊";
    }
    isMusicPlaying = !isMusicPlaying;
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
  // ฟีเจอร์: กดค้างเติมรัก (Responsive เลื่อนเข้าหากัน)
  // ==========================================
  const heartBtn = document.getElementById("heart-hold-btn");
  const avatarSpacer = document.getElementById("avatar-spacer");
  const avatars = document.querySelectorAll(".avatar-track .avatar");
  const boyAvatar = avatars[0];
  const girlAvatar = avatars[1];

  let holdInterval;
  let movement = 0;
  // ตั้งค่าระยะทางการวิ่งใหม่ให้สอดคล้องกับขนาดรูปที่เล็กลงในมือถือ
  const maxMoveDistance = window.innerWidth < 768 ? 75 : 140;

  function startHolding(e) {
    if (e) e.preventDefault();
    heartBtn.classList.add("active-press");
    avatarSpacer.style.opacity = "0";

    holdInterval = setInterval(() => {
      movement += 2.5;

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

    if (movement < maxMoveDistance) {
      movement = 0;
      if (boyAvatar && girlAvatar) {
        boyAvatar.style.transform = `translateX(0px)`;
        girlAvatar.style.transform = `translateX(0px)`;
      }
      avatarSpacer.style.opacity = "1";
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
  // ฟีเจอร์: ปุ่มหายโกรธนะ (ดึงปุ่มออกมาเพื่อให้เต็มจอได้จริง)
  // ==========================================
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const forgiveText = document.getElementById("forgive-text");
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

      if (forgiveCardContainer) {
        forgiveCardContainer.style.transform = "none";
        forgiveCardContainer.style.animation = "none";
      }

      yesBtn.classList.remove("btn");
      yesBtn.classList.add("fullscreen-btn");

      yesBtn.style.position = "fixed";
      yesBtn.style.top = "0";
      yesBtn.style.left = "0";
      yesBtn.style.width = "100vw";
      yesBtn.style.height = "100vh";
      yesBtn.style.zIndex = "99999";
      yesBtn.style.borderRadius = "0";
      yesBtn.style.margin = "0";
      yesBtn.style.transform = "none";
      yesBtn.style.fontSize = "3rem";
      yesBtn.style.display = "flex";
      yesBtn.style.justifyContent = "center";
      yesBtn.style.alignItems = "center";
      yesBtn.style.background = "linear-gradient(135deg, #b06ab3, #4568dc)";
      yesBtn.style.color = "white";
      yesBtn.style.border = "none";
      yesBtn.style.cursor = "pointer";

      yesBtn.innerHTML = "หายโกรธแล้ว";

      // ดึงปุ่มออกมาไว้นอกการ์ด เพื่อไม่ให้โดนกรอบบัง
      document.body.appendChild(yesBtn);
    }
  });

  // 5. กดปุ่ม "หายโกรธแล้ว" -> โชว์ Modal สำเร็จ!
  yesBtn.addEventListener("click", () => {
    if (noClickCount >= 3) {
      yesBtn.style.display = "none";
    }
    successModal.classList.remove("hidden");
  });

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
