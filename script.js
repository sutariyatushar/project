// ✅ AOS Init (only once)
AOS.init({
  duration: 1000,
  once: true
});

// ✅ Mobile Menu Toggle
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('show');
}

// ✅ Slideshow Logic (only for gallery page)
let slideIndex = 0;
function showSlides() {
  const slides = document.getElementsByClassName("mySlides");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].classList.add("fade");

  setTimeout(showSlides, 3000); // change every 3 seconds
}
window.onload = showSlides;

// ✅ Lightbox Image Popup
function openLightbox(img) {
  const lightbox = document.createElement('div');
  lightbox.style.position = 'fixed';
  lightbox.style.top = 0;
  lightbox.style.left = 0;
  lightbox.style.width = '100%';
  lightbox.style.height = '100%';
  lightbox.style.background = 'rgba(0, 0, 0, 0.9)';
  lightbox.style.display = 'flex';
  lightbox.style.alignItems = 'center';
  lightbox.style.justifyContent = 'center';
  lightbox.style.zIndex = '9999';
  lightbox.style.cursor = 'pointer';

  const lightboxImg = document.createElement('img');
  lightboxImg.src = img.src;
  lightboxImg.style.maxWidth = '90%';
  lightboxImg.style.maxHeight = '90%';
  lightboxImg.style.borderRadius = '10px';

  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', function () {
    document.body.removeChild(lightbox);
  });
}

// ✅ Expand card functionality
function expandCard(button) {
  const card = button.parentElement;
  const extraContent = card.querySelector('.extra-content');

  if (extraContent.style.display === 'none' || !extraContent.style.display) {
    extraContent.style.display = 'block';
    button.textContent = 'Read Less';
  } else {
    extraContent.style.display = 'none';
    button.textContent = 'Read More';
  }
}

// ✅ Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thank you for your feedback! We will get back to you soon.');
  this.reset();
});

// ✅ Weather functionality with real API (simulated)
function loadWeather() {
  const currentWeather = document.getElementById('current-weather');
  const forecast = document.getElementById('forecast');

  currentWeather.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 1rem; animation: spin 2s linear infinite;">🌐</div>
    <div>Loading weather data...</div>
  `;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => fetchWeatherData(position.coords.latitude, position.coords.longitude),
      () => fetchWeatherData(21.2107, 71.3397)
    );
  } else {
    fetchWeatherData(21.2107, 71.3397);
  }
}

function fetchWeatherData(lat, lon) {
  const currentWeather = document.getElementById('current-weather');
  const forecast = document.getElementById('forecast');

  setTimeout(() => {
    const weatherConditions = [
      { temp: 28, condition: '🌤️', desc: 'Partly Cloudy', wind: 12, humidity: 65 },
      { temp: 32, condition: '☀️', desc: 'Sunny', wind: 8, humidity: 45 },
      { temp: 26, condition: '🌦️', desc: 'Light Rain', wind: 15, humidity: 80 },
      { temp: 30, condition: '🌅', desc: 'Clear Sky', wind: 10, humidity: 55 }
    ];

    const currentCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    currentWeather.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem; animation: bounce 2s ease-in-out infinite;">${currentCondition.condition}</div>
      <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${currentCondition.temp}°C</div>
      <div style="font-size: 1.2rem; margin-bottom: 1rem;">${currentCondition.desc}</div>
      <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
        <span style="animation: fadeIn 3s ease-in-out;">💨 Wind: ${currentCondition.wind} km/h</span>
        <span style="animation: fadeIn 3s ease-in-out 0.5s both;">💧 Humidity: ${currentCondition.humidity}%</span>
      </div>
    `;

    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
    forecast.innerHTML = days.map((day, i) => {
      const cond = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const temp = cond.temp + Math.floor(Math.random() * 6) - 3;
      return `
        <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 15px; text-align: center; border: 2px solid rgba(255,255,255,0.2); animation: slideUp 0.6s ease-out ${i * 0.1}s both;">
          <div style="font-weight: bold; margin-bottom: 0.8rem; font-size: 1.1rem;">${day}</div>
          <div style="font-size: 2.5rem; margin: 1rem 0; animation: bounce 3s ease-in-out infinite ${i * 0.2}s;">${cond.condition}</div>
          <div style="font-size: 1.3rem; font-weight: bold;">${temp}°C</div>
        </div>
      `;
    }).join('');
  }, 1500);
}

// ✅ Map dot info cards
let currentActive = null;

function showPlaceInfo(place, dotElement) {
  hideAllInfo();
  const infoCard = document.getElementById(`info-${place}`);
  if (infoCard) {
    infoCard.classList.add('show');
    dotElement.classList.add('active');
    currentActive = place;
  }
}

function hideAllInfo() {
  document.querySelectorAll('.place-info').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.map-dot').forEach(dot => dot.classList.remove('active'));
  currentActive = null;
}

function initializeMap() {
  document.querySelectorAll('.map-dot').forEach(dot => {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      const place = this.getAttribute('data-place');
      showPlaceInfo(place, this);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.place-info') && !e.target.closest('.map-dot')) {
      hideAllInfo();
    }
  });
}

// ✅ Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ✅ Load weather and initialize map on page load
document.addEventListener('DOMContentLoaded', function () {
  loadWeather();
  initializeMap();
});
