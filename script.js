// ✅ AOS Init (only once)
AOS.init({
  duration: 1000,
  once: true,
});

// ✅ Mobile Menu Toggle/////////////////////////////////////////////////////
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(
    ".home-slider-container .home-slide"
  );
  let slideIndex = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      const vid = slide.querySelector("video");
      if (vid && i !== index) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    const currentSlide = slides[index];
    const video = currentSlide.querySelector("video");

    clearTimeout(timer);

    if (video) {
      video.muted = true;
      video.play().catch(() => {
        /* autoplay blocked */
      });
      video.onended = () => {
        nextSlide();
      };
    } else {
      const duration =
        parseInt(currentSlide.getAttribute("data-duration")) || 4000;
      timer = setTimeout(nextSlide, duration);
    }
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  // start
  showSlide(slideIndex);
});

//slideshow only for gallery /////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slideshow-container .slide");
  let slideTimer;

  function showSlides(n = null) {
    // Hide all and reset videos
    slides.forEach((slide) => {
      slide.style.display = "none";
      const vid = slide.querySelector("video");
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    // Slide index logic
    if (n !== null) {
      slideIndex = n;
    } else {
      slideIndex++;
    }

    if (slideIndex > slides.length) slideIndex = 1;
    if (slideIndex < 1) slideIndex = slides.length;

    // Show current slide
    const currentSlide = slides[slideIndex - 1];
    currentSlide.style.display = "block";

    // Handle video vs image
    const video = currentSlide.querySelector("video");

    clearTimeout(slideTimer);

    if (video) {
      video.muted = true; // start muted
      video.play().catch((err) => console.log("Autoplay blocked:", err));

      // When video ends → go next slide
      video.onended = () => {
        showSlides();
      };
    } else {
      // If image → wait 3s
      slideTimer = setTimeout(showSlides, 3000);
    }
  }

  function plusSlides(n) {
    showSlides(slideIndex + n - 1);
  }

  // Start slideshow once DOM is ready
  showSlides();
});

// contect directory/////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("directorySearch");
  const contactList = document.getElementById("directoryList");
  const errorMsg = document.getElementById("directoryError");

  // Directory Data
  const contacts = [
    { name: "Rohit.J Dharajiya", number: "000000000" },
    { name: "Romin Sutariya", number: "6352946201" },
    { name: "Milan Shah", number: "9988776655" },
    { name: "Yug Thakor", number: "9090909090" },
    { name: "Jay v. Yadav", number: "7096970615" }, // duplicate test
    { name: "Rajubhai B. Sutariya", number: "9904818098" }, // duplicate test
    { name: "Divay Joshi", number: "8000000000" },
    { name: "Tushar Sutariya", number: "8780805275" },
    { name: "Khodidas Gopani", number: "9825776857" },
    { name: "Pragnesh Vallabhbhai Sutariya", number: "9924483782" },
    { name: "Kishan Sorathiya", number: "9558394296" },
    { name: "Rangpara Ankit Bhai", number: "7622939396" },
    { name: "Ranjit Samjibhai Solanki", number: "7096455843" },
    { name: "Pravinbhai Sarvaiya", number: "9924249804" },
    { name: "Thakarshibhai Gopani", number: "9925880060" },
    { name: "Jay Baraiya", number: "9099236428" },
    { name: "Gopal.R Mer", number: "7096584896" },
    { name: "Bharat.M Yadav", number: "9904367436" },
    { name: "Darshan.D Gohil", number: "9316021319" },
    { name: "Budhabhai Mer", number: "9904846410" },
    { name: "Rajubhai V. Solanki", number: "9737421120" },
  ];

  function renderContacts(list) {
    contactList.innerHTML = "";
    list.forEach((c) => {
      const li = document.createElement("li");
      li.className = "directory-item";
      li.innerHTML = `<span>${c.name} - ${c.number}</span>
                        <a href="tel:${c.number}">Call</a>`;
      contactList.appendChild(li);
    });
  }

  // On search input
  search.addEventListener("keyup", function () {
    const value = this.value.toLowerCase().trim();

    if (value === "") {
      // Show default contacts
      contactList.innerHTML = `
          <li class="directory-item default">
            <span>Default One - 9876543210</span>
            <a href="tel:9876543210">Call</a>
          </li>
          <li class="directory-item default">
            <span>Default Two - 9123456780</span>
            <a href="tel:9123456780">Call</a>
          </li>`;
      errorMsg.style.display = "none";
      return;
    }

    // Filter contacts
    const filtered = contacts.filter(
      (c) => c.name.toLowerCase().includes(value) || c.number.includes(value)
    );

    if (filtered.length > 0) {
      renderContacts(filtered);
      errorMsg.style.display = "none";
    } else {
      contactList.innerHTML = "";
      errorMsg.style.display = "block";
    }
  });
});

// ✅ Lightbox Image Popup/////////////////////////////////////////////////////////////////////
function openLightbox(img) {
  // Create lightbox container
  const lightbox = document.createElement("div");
  lightbox.style.position = "fixed";
  lightbox.style.top = 0;
  lightbox.style.left = 0;
  lightbox.style.width = "100%";
  lightbox.style.height = "100%";
  lightbox.style.background = "rgba(0, 0, 0, 0.9)";
  lightbox.style.display = "flex";
  lightbox.style.flexDirection = "column";
  lightbox.style.alignItems = "center";
  lightbox.style.justifyContent = "center";
  lightbox.style.zIndex = "9999";
  lightbox.style.cursor = "pointer";

  // Create image element
  const lightboxImg = document.createElement("img");
  lightboxImg.src = img.src;
  lightboxImg.style.maxWidth = "90%";
  lightboxImg.style.maxHeight = "80%";
  lightboxImg.style.borderRadius = "10px";

  // Create download button
  const downloadBtn = document.createElement("button");
  downloadBtn.innerText = "Download";
  downloadBtn.style.marginTop = "20px";
  downloadBtn.style.padding = "10px 20px";
  downloadBtn.style.fontSize = "1rem";
  downloadBtn.style.border = "none";
  downloadBtn.style.borderRadius = "5px";
  downloadBtn.style.backgroundColor = "#4CAF50";
  downloadBtn.style.color = "#fff";
  downloadBtn.style.cursor = "pointer";
  downloadBtn.style.transition = "0.3s";
  downloadBtn.addEventListener(
    "mouseenter",
    () => (downloadBtn.style.backgroundColor = "#45a049")
  );
  downloadBtn.addEventListener(
    "mouseleave",
    () => (downloadBtn.style.backgroundColor = "#4CAF50")
  );

  // Download image when button clicked
  downloadBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing lightbox
    const a = document.createElement("a");
    a.href = img.src;
    a.download = img.src.split("/").pop(); // File name from src
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(downloadBtn);
  document.body.appendChild(lightbox);

  // Click outside image or button to close lightbox
  lightbox.addEventListener("click", function () {
    document.body.removeChild(lightbox);
  });

  // Prevent click on image or button from closing
  lightboxImg.addEventListener("click", (e) => e.stopPropagation());
  downloadBtn.addEventListener("click", (e) => e.stopPropagation());
}

// ✅ Expand card functionality
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".attraction-read-more");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".attraction-card");
      card.classList.toggle("expanded");

      btn.textContent = card.classList.contains("expanded")
        ? "Read Less"
        : "Read More";
    });
  });
});

// ✅ Contact form submission
document
  .getElementById("contact-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for your feedback! We will get back to you soon.");
    this.reset();
  });

// ✅ Weather functionality with real API (simulated)
function loadWeather() {
  const currentWeather = document.getElementById("current-weather");
  const forecast = document.getElementById("forecast");

  currentWeather.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 1rem; animation: spin 2s linear infinite;">🌐</div>
    <div>Loading weather data...</div>
  `;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherData(position.coords.latitude, position.coords.longitude),
      () => fetchWeatherData(21.2107, 71.3397)
    );
  } else {
    fetchWeatherData(21.2107, 71.3397);
  }
}

function fetchWeatherData(lat, lon) {
  const currentWeather = document.getElementById("current-weather");
  const forecast = document.getElementById("forecast");

  setTimeout(() => {
    const weatherConditions = [
      {
        temp: 28,
        condition: "🌤️",
        desc: "Partly Cloudy",
        wind: 12,
        humidity: 65,
      },
      { temp: 32, condition: "☀️", desc: "Sunny", wind: 8, humidity: 45 },
      { temp: 26, condition: "🌦️", desc: "Light Rain", wind: 15, humidity: 80 },
      { temp: 30, condition: "🌅", desc: "Clear Sky", wind: 10, humidity: 55 },
    ];

    const currentCondition =
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    currentWeather.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem; animation: bounce 2s ease-in-out infinite;">${currentCondition.condition}</div>
      <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${currentCondition.temp}°C</div>
      <div style="font-size: 1.2rem; margin-bottom: 1rem;">${currentCondition.desc}</div>
      <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
        <span style="animation: fadeIn 3s ease-in-out;">💨 Wind: ${currentCondition.wind} km/h</span>
        <span style="animation: fadeIn 3s ease-in-out 0.5s both;">💧 Humidity: ${currentCondition.humidity}%</span>
      </div>
    `;

    const days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday"];
    forecast.innerHTML = days
      .map((day, i) => {
        const cond =
          weatherConditions[
            Math.floor(Math.random() * weatherConditions.length)
          ];
        const temp = cond.temp + Math.floor(Math.random() * 6) - 3;
        return `
        <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 15px; text-align: center; border: 2px solid rgba(255,255,255,0.2); animation: slideUp 0.6s ease-out ${
          i * 0.1
        }s both;">
          <div style="font-weight: bold; margin-bottom: 0.8rem; font-size: 1.1rem;">${day}</div>
          <div style="font-size: 2.5rem; margin: 1rem 0; animation: bounce 3s ease-in-out infinite ${
            i * 0.2
          }s;">${cond.condition}</div>
          <div style="font-size: 1.3rem; font-weight: bold;">${temp}°C</div>
        </div>
      `;
      })
      .join("");
  }, 1500);
}

// ✅ Map dot info cards
let currentActive = null;

function showPlaceInfo(place, dotElement) {
  hideAllInfo();
  const infoCard = document.getElementById(`info-${place}`);
  if (infoCard) {
    infoCard.classList.add("show");
    dotElement.classList.add("active");
    currentActive = place;
  }
}

function hideAllInfo() {
  document
    .querySelectorAll(".place-info")
    .forEach((el) => el.classList.remove("show"));
  document
    .querySelectorAll(".map-dot")
    .forEach((dot) => dot.classList.remove("active"));
  currentActive = null;
}

function initializeMap() {
  document.querySelectorAll(".map-dot").forEach((dot) => {
    dot.addEventListener("click", function (e) {
      e.stopPropagation();
      const place = this.getAttribute("data-place");
      showPlaceInfo(place, this);
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".place-info") && !e.target.closest(".map-dot")) {
      hideAllInfo();
    }
  });
}

// ✅ Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ✅ Add weather animations
const additionalStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ✅ Load weather and initialize map on page load
document.addEventListener("DOMContentLoaded", function () {
  loadWeather();
  initializeMap();
});

document.querySelectorAll(".read-more").forEach((button) => {
  button.addEventListener("click", function () {
    const card = this.closest(".card");
    card.classList.toggle("expanded");

    const moreText = card.querySelector(".more-text");
    if (moreText.style.display === "block") {
      moreText.style.display = "none";
      this.textContent = "Read More";
    } else {
      moreText.style.display = "block";
      this.textContent = "Read Less";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const readMoreButtons = document.querySelectorAll(".read-more-btn");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = button.closest(".event-card");
      const extraContent = card.querySelector(".extra-content");

      extraContent.classList.toggle("hidden");

      if (extraContent.classList.contains("hidden")) {
        button.textContent = "Read More";
      } else {
        button.textContent = "Show Less";
      }
    });
  });
});

const waveText = document.querySelector(".wave-text");
const text = waveText.textContent;
waveText.innerHTML = [...text]
  .map((char, i) => {
    return `<span style="--i:${i + 1}">${char}</span>`;
  })
  .join("");

function eventReadmore() {
  const videoCard = document.querySelector("#event-Read-more .video-card");
  const btn = document.getElementById("read-more-btn");

  if (videoCard.style.display === "none" || videoCard.style.display === "") {
    videoCard.style.display = "block"; // show video
    btn.textContent = "Read Less";
  } else {
    videoCard.style.display = "none"; // hide video
    btn.textContent = "Read More";
  }
}

// Smooth snap scrolling
const arc = document.querySelector(".portrait-arc");
arc.addEventListener("wheel", (e) => {
  e.preventDefault();
  arc.scrollLeft += e.deltaY;
});

// ▶ Play / Pause
function togglePlay(btn) {
  const card = btn.closest(".video-card");
  const video = card.querySelector("video");
  const progress = card.querySelector(".progress");

  if (video.paused) {
    video.play();
    btn.textContent = "⏸";
  } else {
    video.pause();
    btn.textContent = "▶";
  }

  video.ontimeupdate = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.width = percent + "%";
  };
}

// 🔇 Mute / Unmute
function toggleMute(btn) {
  const card = btn.closest(".video-card");
  const video = card.querySelector("video");

  video.muted = !video.muted;
  btn.textContent = video.muted ? "🔇" : "🔊";
}
