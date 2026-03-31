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
        parseInt(currentSlide.getAttribute("data-duration")) || 9000;
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
    { name: "Pradip Solanki", number: "9313604900" },
    { name: "Ronak Solanki", number: "9537925155" },
    { name: "Milan Sutariya", number: "6353599200" },
    { name: "Mer Dhaval Bharwad", number: "7096543858" },
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
  // Check if it's already open
  if (document.getElementById("custom-lightbox")) return;

  // Create lightbox container
  const lightbox = document.createElement("div");
  lightbox.id = "custom-lightbox";
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
  lightbox.style.opacity = "0"; // Start hidden
  lightbox.style.transition = "opacity 0.4s ease";

 // Create Back Arrow Button (Top Left)
const backBtn = document.createElement("button");
backBtn.innerHTML = "←"; // Arrow
backBtn.style.position = "fixed";
backBtn.style.top = "15px";
backBtn.style.left = "15px";
backBtn.style.fontSize = "1.1rem";
backBtn.style.padding = "6px 14px";
backBtn.style.border = "none";
backBtn.style.borderRadius = "6px";
backBtn.style.backgroundColor = "#333";
backBtn.style.color = "#fff";
backBtn.style.cursor = "pointer";
backBtn.style.zIndex = "10000";
backBtn.style.transition = "0.3s";

// Hover effect
backBtn.addEventListener("mouseenter", () => {
  backBtn.style.backgroundColor = "#555";
});
backBtn.addEventListener("mouseleave", () => {
  backBtn.style.backgroundColor = "#333";
});

// Close on click function with animation
function closeLightbox() {
  lightbox.style.opacity = "0";
  lightboxImg.style.transform = "scale(0.8)";
  setTimeout(() => {
    if (document.body.contains(lightbox)) {
      document.body.removeChild(lightbox);
    }
  }, 400);
}

// Close on click
backBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeLightbox();
});

  // Create image element
  const lightboxImg = document.createElement("img");
  lightboxImg.src = img.src;
  lightboxImg.style.maxWidth = "90%";
  lightboxImg.style.maxHeight = "80%";
  lightboxImg.style.borderRadius = "10px";
  lightboxImg.style.transform = "scale(0.8)"; // Start zoomed out
  lightboxImg.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

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

  // Hover effect
  downloadBtn.addEventListener(
    "mouseenter",
    () => (downloadBtn.style.backgroundColor = "#45a049")
  );
  downloadBtn.addEventListener(
    "mouseleave",
    () => (downloadBtn.style.backgroundColor = "#4CAF50")
  );

  // Download image
  downloadBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = img.src;
    a.download = img.src.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Append items
  lightbox.appendChild(backBtn);
  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(downloadBtn);

  document.body.appendChild(lightbox);

  // Trigger animation
  requestAnimationFrame(() => {
    lightbox.style.opacity = "1";
    lightboxImg.style.transform = "scale(1)";
  });

  // Close when clicking outside
  lightbox.addEventListener("click", () => {
    closeLightbox();
  });

  // Prevent closing when clicking on image or button
  lightboxImg.addEventListener("click", (e) => e.stopPropagation());
  downloadBtn.addEventListener("click", (e) => e.stopPropagation());
}

// ✅ Open Gallery Upload Form
  function openGalleryForm() {
    window.open("https://forms.gle/iv1nieQV2YQ2dmEm7", "_blank");
  }

// ✅ Expand card functionality
  function toggleEventContent() {
    const content = document.getElementById("event-full-content");
    const btn = document.getElementById("read-more-btn");
    const btnText = btn.querySelector("span");
    
    content.classList.toggle("show");
    btn.classList.toggle("active");

    if (content.classList.contains("show")) {
      btnText.innerText = "Read Less";
    } else {
      btnText.innerText = "Read More";
    }
  }
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

// ✅ Universal Expansion Logic for all card types
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".read-more, .expand-btn, .read-more-btn, .attraction-read-more");
  if (!btn) return;

  const card = btn.closest(".card, .stat-card, .event-card, .attraction-card");
  if (!card) return;

  const isStatCard = card.classList.contains("stat-card");
  const isAttractionCard = card.classList.contains("attraction-card");

  if (isStatCard) {
    card.classList.toggle("active");
    btn.innerHTML = card.classList.contains("active") 
      ? `Read Less <i class="fa-solid fa-chevron-up"></i>` 
      : `Read More <i class="fa-solid fa-chevron-down"></i>`;
  } else if (isAttractionCard) {
     card.classList.toggle("expanded");
     btn.innerHTML = card.classList.contains("expanded")
       ? 'Read Less <i class="fa-solid fa-arrow-up"></i>'
       : 'Read More <i class="fa-solid fa-arrow-right"></i>';
  } else {
    // Original general card logic
    card.classList.toggle("expanded");
    const moreText = card.querySelector(".more-text, .extra-content");
    if (moreText) {
      if (moreText.style.display === "block" || moreText.classList.contains("show")) {
        moreText.style.display = "none";
        moreText.classList.remove("show");
        btn.textContent = "Read More";
      } else {
        moreText.style.display = "block";
        moreText.classList.add("show");
        btn.textContent = "Read Less";
      }
    }
  }
});







// ✅ Timeline Progress Fill Logic (Only runs if timeline exists on page)
window.addEventListener("scroll", function () {
  const container = document.querySelector(".timeline-container");
  if (!container) return;

  const progressLine = document.querySelector(".timeline-progress-line");
  const items = document.querySelectorAll(".timeline-item");

  const containerRect = container.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate progress based on how much of the container is in view
  let progress = (windowHeight / 2 - containerRect.top) / containerRect.height;
  progress = Math.max(0, Math.min(1, progress));

  if (progressLine) progressLine.style.height = `${progress * 100}%`;

  // Update dots based on progress
  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < windowHeight / 2) {
      item.classList.add("reached");
    } else {
      item.classList.remove("reached");
    }
  });
});

// ✅ Event main page card expand collapse
const eventsGrid = document.getElementById("eventsGrid");
const eventDetailModal = document.getElementById("eventDetailModal");

if (eventsGrid && eventDetailModal) {
  eventsGrid.addEventListener("click", (e) => {
    const item = e.target.closest(".event-item");
    if (!item) return;

    const img = item.querySelector("img").src;
    const expandDiv = item.querySelector(".event-expand");
    if (!expandDiv) return;

    const fullTitle = expandDiv.querySelector("h4").innerText;
    const fullDescHtml = expandDiv.querySelector("p").innerHTML;
    const contentParts = fullDescHtml.split("<br><br>");
    const metaParts = contentParts[0].split("<br>");
    
    const loc = metaParts[0] || "📍 Goradka Village";
    const date = metaParts[1] || "🗓️ Event Date";
    const desc = contentParts[1] || "";

    // Populate Modal
    document.getElementById("modalFullImg").src = img;
    document.getElementById("modalFullTitle").innerText = fullTitle;
    document.getElementById("modalFullLoc").innerHTML = loc;
    document.getElementById("modalFullDate").innerHTML = date;
    document.getElementById("modalFullDesc").innerHTML = desc;

    // Show Modal
    eventDetailModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Global Close function for this modal
  window.closeEventDetail = function() {
    eventDetailModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Close modal on click outside
  window.addEventListener("click", (e) => {
    if (e.target == eventDetailModal) {
      closeEventDetail();
    }
  });
}


  // Show / Hide Events
  const allEvtBtn = document.getElementById("allEventsBtn");
  const hiddenEvts = document.querySelectorAll(".hidden-event");
  let isEvtExpanded = false;

  if (allEvtBtn) {
    allEvtBtn.addEventListener("click", () => {
      isEvtExpanded = !isEvtExpanded;
      hiddenEvts.forEach(event => {
        event.style.display = isEvtExpanded ? "block" : "none";
      });
      allEvtBtn.textContent = isEvtExpanded ? "Show Less" : "All Events";
    });
  }





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


 
// home page event section modal popup/////////////////////////////////////////////////////

  function openEvent(title, img, desc) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalImg").src = img;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("eventModal").style.display = "flex";
  }

  function closeEvent() {
    document.getElementById("eventModal").style.display = "none";
  }

  document.getElementById("eventModal").addEventListener("click", function (e) {
    if (e.target === this) closeEvent();
  });
// ================= EVENTS SECTION END ================= //

  function changeMedia(src, type) {
    const main = document.getElementById("galleryMain");

    if (type === "video") {
      main.innerHTML = `<video src="${src}" controls autoplay></video>`;
    } else {
      main.innerHTML = `<img src="${src}" alt="Goradka Gallery">`;
    }

    document.querySelectorAll('.gallery-thumbs img, .gallery-thumbs video')
      .forEach(el => el.classList.remove('active-thumb'));

    event.target.classList.add('active-thumb');
  }
