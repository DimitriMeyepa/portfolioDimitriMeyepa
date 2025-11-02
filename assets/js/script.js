// Initialisation AOS
AOS.init({ duration: 1000, once: true });

// Navigation - Menus déroulants au survol et filtrage
function initNavbar() {
  console.log('Initialisation de la navbar');
  
  // Gestion des menus déroulants au survol (desktop)
  const dropdowns = document.querySelectorAll('.nav-item.dropdown');
  
  dropdowns.forEach(dropdown => {
    let timeoutId;
    
    dropdown.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) { // Desktop seulement
        clearTimeout(timeoutId);
        const menu = this.querySelector('.dropdown-menu');
        if (menu) {
          menu.classList.remove('hidden');
        }
      }
    });
    
    dropdown.addEventListener('mouseleave', function(e) {
      if (window.innerWidth > 768) {
        // Vérifier si la souris va vers le menu déroulant
        const relatedTarget = e.relatedTarget;
        const menu = this.querySelector('.dropdown-menu');
        
        if (menu && menu.contains(relatedTarget)) {
          // La souris va vers le menu, on ne ferme pas
          return;
        }
        
        // Petit délai pour éviter la fermeture brusque
        timeoutId = setTimeout(() => {
          if (menu) {
            menu.classList.add('hidden');
          }
        }, 150);
      }
    });

    // Également gérer le mouseenter sur le menu déroulant lui-même
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      menu.addEventListener('mouseenter', function() {
        clearTimeout(timeoutId);
      });
      
      menu.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
          timeoutId = setTimeout(() => {
            this.classList.add('hidden');
          }, 150);
        }
      });
    }
  });
// Gestion du filtrage des projets depuis la navbar
const filterLinks = document.querySelectorAll('.filter-link');

filterLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const filterValue = this.getAttribute('data-filter');
    console.log('Filtre sélectionné depuis navbar:', filterValue);
    
    // Rediriger vers la section projets
    const projetsSection = document.getElementById('projets');
    if (projetsSection) {
      window.scrollTo({
        top: projetsSection.offsetTop - document.querySelector('nav').offsetHeight,
        behavior: 'smooth'
      });
    }
    
    // Appliquer le filtre après un petit délai pour laisser le temps à la redirection
    setTimeout(() => {
      filterProjects(filterValue);
    }, 500);
    
    // Fermer le menu déroulant après sélection
    const dropdownMenu = this.closest('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.add('hidden');
    }
    
      
      
      // Fermer le menu mobile si ouvert
      if (window.innerWidth < 768) {
        const mobileMenu = document.getElementById('navbarNav');
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
  

  // Menu mobile
  const mobileMenuButton = document.querySelector('.navbar-toggler');
  const navbarNav = document.getElementById('navbarNav');
  
  if (mobileMenuButton && navbarNav) {
    mobileMenuButton.addEventListener('click', function() {
      navbarNav.classList.toggle('hidden');
      console.log('Menu mobile togglé');
    });
  }

  // Fermer les menus déroulants au clic ailleurs
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    }
  });
}

// Fonction pour filtrer les projets
function filterProjects(filter) {
  const projects = document.querySelectorAll('.projet-item');
  const filtreSelect = document.getElementById('filtre-select');
  
  console.log(`Filtrage des projets: ${filter}`);
  
  projects.forEach(project => {
    if (filter === 'tous' || project.getAttribute('data-type') === filter) {
      project.style.display = 'block';
      project.style.opacity = '0';
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transition = 'opacity 0.3s ease';
      }, 10);
    } else {
      project.style.display = 'none';
    }
  });
  
  // Synchroniser avec le sélecteur
  if (filtreSelect) {
    filtreSelect.value = filter;
  }
}

// Gestion des modales améliorées
document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour ouvrir une modale
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
      modal.classList.add('show');
      overlay.classList.remove('hidden');
      
      // Empêcher le défilement de la page
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Fonction pour fermer une modale
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
      modal.classList.remove('show');
      overlay.classList.add('hidden');
      
      // Rétablir le défilement de la page
      document.body.style.overflow = '';
    }
  }
  
  // Fermer en cliquant sur l'overlay
  document.getElementById('modalOverlay').addEventListener('click', function() {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      closeModal(modal.id);
    });
  });
  
  // Fermer avec la touche Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
  
  // Gestion des boutons d'ouverture de modale
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function() {
      const target = this.getAttribute('data-bs-target');
      if (target) {
        const modalId = target.substring(1); // Enlever le #
        openModal(modalId);
      }
    });
  });
  
  // Gestion des boutons de fermeture de modale
  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      if (modalId) {
        closeModal(modalId);
      }
    });
  });
});

// Canvas étoiles
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 150;

function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2,
      alpha: Math.random()
    });
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
    
    // scintillement
    star.alpha += (Math.random() - 0.5) * 0.05;
    if (star.alpha < 0) star.alpha = 0;
    if (star.alpha > 1) star.alpha = 1;
  }
  requestAnimationFrame(animateStars);
}

// Carousel compétences avec boucle infinie
function initCarousel() {
  const slidesContainer = document.querySelector('.carousel-slides');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevButton = document.querySelector('.carousel-arrow-prev');
  const nextButton = document.querySelector('.carousel-arrow-next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (!slidesContainer || !prevButton || !nextButton) {
    console.log('Éléments du carousel non trouvés');
    return;
  }
  
  let currentSlide = 0;
  const totalSlides = slides.length;

  console.log('Carousel initialisé avec', totalSlides, 'slides');

  // Fonction pour mettre à jour le carousel
  function updateCarousel() {
    console.log('Changement vers slide:', currentSlide);
    
    // Déplacer les slides
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Mettre à jour les indicateurs
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
        indicator.style.backgroundColor = '#4b6cb7';
      } else {
        indicator.classList.remove('active');
        indicator.style.backgroundColor = '#6b7280';
      }
    });
    
    // Pour un carousel infini, on ne désactive jamais les boutons
    prevButton.style.opacity = '0.9';
    nextButton.style.opacity = '0.9';
  }

  // Événements pour les flèches - avec boucle infinie
  prevButton.addEventListener('click', () => {
    console.log('Flèche précédente cliquée');
    if (currentSlide === 0) {
      // Si on est sur la première slide, aller à la dernière
      currentSlide = totalSlides - 1;
    } else {
      currentSlide--;
    }
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    console.log('Flèche suivante cliquée');
    if (currentSlide === totalSlides - 1) {
      // Si on est sur la dernière slide, aller à la première
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    updateCarousel();
  });

  // Événements pour les indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      console.log('Indicateur cliqué:', index);
      currentSlide = index;
      updateCarousel();
    });
  });

  // Navigation au clavier avec boucle infinie
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (currentSlide === 0) {
        currentSlide = totalSlides - 1;
      } else {
        currentSlide--;
      }
      updateCarousel();
    } else if (e.key === 'ArrowRight') {
      if (currentSlide === totalSlides - 1) {
        currentSlide = 0;
      } else {
        currentSlide++;
      }
      updateCarousel();
    }
  });

  // Auto-play optionnel avec boucle infinie
  let autoPlayInterval;
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }, 4000); // Change toutes les 4 secondes
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Démarrer l'auto-play (optionnel - décommentez si vous le voulez)
  // startAutoPlay();
  
  // Arrêter l'auto-play au survol
  // const carousel = document.querySelector('.carousel-container');
  // carousel.addEventListener('mouseenter', stopAutoPlay);
  // carousel.addEventListener('mouseleave', startAutoPlay);

  // Initialisation
  updateCarousel();
}

// Filtrage projets
function initProjectFilter() {
  const select = document.getElementById("filtre-select");
  const projets = document.querySelectorAll(".projet-item");

  if (!select) return;

  select.addEventListener("change", () => {
    const value = select.value;
    projets.forEach((p) => {
      if (value === "tous" || p.dataset.type === value) {
        p.style.display = "block";
      } else {
        p.style.display = "none";
      }
    });
  });
}

// Navigation dropdown
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const dropdown = this.nextElementSibling;
      dropdown.classList.toggle('hidden');
    });
  });

  // Fermer les dropdowns en cliquant ailleurs
  document.addEventListener('click', function(e) {
    if (!e.target.matches('.dropdown-toggle')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    }
  });
}

// Contact form
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form)
    }).then(() => {
      alert("✅ Message envoyé !");
      form.reset();
    }).catch(() => {
      alert("❌ Une erreur est survenue. Réessayez.");
    });
  });
}

// Toggle contact box
function toggleContactBox() {
  const box = document.getElementById('contact-box');
  const overlay = document.getElementById('contact-overlay');
  if (box.style.display === 'none' || box.style.display === '') {
    box.style.display = 'block';
    overlay.classList.remove('hidden');
  } else {
    box.style.display = 'none';
    overlay.classList.add('hidden');
  }
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - document.querySelector('nav').offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const toggleButton = document.querySelector('.navbar-toggler');
  const mobileMenu = document.getElementById('navbarNav');
  
  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Contact float button
function initContactButton() {
  const contactFloat = document.getElementById('contact-float');
  const contactClose = document.querySelector('.contact-close');
  const contactOverlay = document.getElementById('contact-overlay');
  
  if (contactFloat) {
    contactFloat.addEventListener('click', toggleContactBox);
  }
  
  if (contactClose) {
    contactClose.addEventListener('click', toggleContactBox);
  }
  
  if (contactOverlay) {
    contactOverlay.addEventListener('click', toggleContactBox);
  }
}

// Initialisation de toutes les fonctions
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM chargé - initialisation des fonctions');
  
  // Initialisation de la navbar (AJOUT IMPORTANT)
  initNavbar();
  
  // Canvas stars
  if (canvas) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateStars();
  }
  
  // Carousel
  initCarousel();
  
  // Autres initialisations
  initProjectFilter();
  initDropdowns();
  initContactForm();
  initSmoothScroll();
  initMobileMenu();
  initContactButton();
});